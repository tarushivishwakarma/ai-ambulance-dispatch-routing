const axios = require('axios');
const Route = require('../models/Route');
const RoadCondition = require('../models/RoadCondition');

const OSRM_BASE_URL = 'http://router.project-osrm.org';

const calculateRoute = async (startCoords, endCoords) => {
  try {
    // Format: lon,lat
    const startStr = `${startCoords[0]},${startCoords[1]}`;
    const endStr = `${endCoords[0]},${endCoords[1]}`;
    
    // Call public OSRM for routing (demo/prototype only, requires proper deployment for production)
    const response = await axios.get(
      `${OSRM_BASE_URL}/route/v1/driving/${startStr};${endStr}?overview=full&geometries=geojson`
    );

    if (response.data.code !== 'Ok') {
      throw new Error('Routing failed');
    }

    const route = response.data.routes[0];
    
    // Apply dynamic traffic penalties based on RoadConditions
    const penalties = await applyRoadPenalties(route);
    
    return {
      geometry: route.geometry,
      distance: route.distance, // meters
      duration: route.duration, // seconds
      adjustedDuration: route.duration + penalties,
      score: calculateRouteScore(route.distance, route.duration + penalties)
    };
  } catch (error) {
    console.error('OSRM Routing Error:', error.message);
    throw error;
  }
};

const applyRoadPenalties = async (osrmRoute) => {
  // Simplistic approach for prototype: 
  // Fetch active RoadConditions and if they intersect with route bbox/points, add penalties
  const activeConditions = await RoadCondition.find({ state: { $ne: 'NORMAL' } });
  
  let penaltySeconds = 0;
  
  // (In a real system, you'd use Turf.js or PostGIS to check intersection precisely)
  activeConditions.forEach(condition => {
    // Dummy check: if we had a blocked road, add 600s
    if (condition.state === 'BLOCKED') penaltySeconds += 600;
    if (condition.state === 'CONGESTED') penaltySeconds += 300;
  });
  
  return penaltySeconds;
};

const calculateRouteScore = (distance, adjustedDuration) => {
  // Lower duration is better. Score algorithm.
  // Inverse relationship: max score for 0 duration.
  const score = 10000 / (adjustedDuration + 1);
  return score;
};

module.exports = {
  calculateRoute
};
