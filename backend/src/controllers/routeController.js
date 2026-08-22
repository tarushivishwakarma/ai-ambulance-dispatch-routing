const { calculateRoute } = require('../services/routingService');
const Route = require('../models/Route');

// @desc    Calculate route between two coordinates
// @route   POST /api/routes/calculate
// @access  Private
const calculateRouteEndpoint = async (req, res, next) => {
  try {
    const { startCoords, endCoords, dispatchId, ambulanceId, incidentId } = req.body;
    
    if (!startCoords || !endCoords) {
      return res.status(400).json({ success: false, message: 'Start and end coordinates required' });
    }

    const routeData = await calculateRoute(startCoords, endCoords);

    // Optionally save route to DB if related to a dispatch
    let savedRoute = null;
    if (dispatchId) {
      savedRoute = await Route.create({
        dispatch: dispatchId,
        ambulance: ambulanceId,
        incident: incidentId,
        geometry: routeData.geometry,
        distance: routeData.distance,
        duration: routeData.adjustedDuration,
        score: routeData.score
      });
    }

    res.json({
      success: true,
      data: savedRoute || routeData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateRouteEndpoint
};
