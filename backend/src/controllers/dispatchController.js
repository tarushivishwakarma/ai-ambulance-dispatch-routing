const Dispatch = require('../models/Dispatch');
const Ambulance = require('../models/Ambulance');
const Incident = require('../models/Incident');

// @desc    Recommend ambulance for an incident
// @route   POST /api/dispatch/recommend
// @access  Private (Dispatcher, Admin)
const recommendDispatch = async (req, res, next) => {
  try {
    const { incidentId } = req.body;
    
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Find available ambulances
    const availableAmbulances = await Ambulance.find({ status: 'AVAILABLE' });
    
    if (availableAmbulances.length === 0) {
      return res.json({ success: true, data: null, message: 'No ambulances available' });
    }

    // Simple Dispatch Scoring Logic (Haversine distance for simplicity here, OSRM can be added)
    // In a real system, this calls OSRM to get real ETA
    let bestAmbulance = null;
    let bestScore = -1;
    let scoreFactors = {};

    const toRad = (value) => (value * Math.PI) / 180;
    
    availableAmbulances.forEach(ambulance => {
      // 1. Calculate straight-line distance
      const [lon1, lat1] = ambulance.currentLocation.coordinates;
      const [lon2, lat2] = incident.location.coordinates;
      
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // in km

      // 2. Capability matching
      let capabilityScore = 1.0;
      if (incident.isMedicalEmergency && ambulance.type === 'ADVANCED_LIFE_SUPPORT') {
        capabilityScore = 1.5;
      }

      // 3. Final score (higher is better, so inverse of distance)
      const distanceScore = 100 / (distance + 1); // Avoid division by zero
      const totalScore = distanceScore * capabilityScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestAmbulance = ambulance;
        scoreFactors = { distance, capabilityScore, distanceScore };
      }
    });

    res.json({
      success: true,
      data: {
        ambulance: bestAmbulance,
        score: bestScore,
        factors: scoreFactors
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ambulance to incident
// @route   POST /api/dispatch/assign
// @access  Private (Dispatcher, Admin)
const assignDispatch = async (req, res, next) => {
  try {
    const { incidentId, ambulanceId } = req.body;

    const dispatch = await Dispatch.create({
      incident: incidentId,
      ambulance: ambulanceId,
      dispatcher: req.user._id,
      status: 'ASSIGNED',
      assignedAt: Date.now()
    });

    // Update Incident
    await Incident.findByIdAndUpdate(incidentId, { 
      assignedAmbulance: ambulanceId,
      assignedDispatcher: req.user._id,
      status: 'ASSIGNED'
    });

    // Update Ambulance
    const ambulance = await Ambulance.findByIdAndUpdate(ambulanceId, {
      status: 'ASSIGNED',
      currentIncident: incidentId
    }, { new: true });

    // Notify connected clients
    req.io.emit('dispatch:created', dispatch);
    req.io.emit('ambulance:status', ambulance);
    req.io.emit('incident:status', await Incident.findById(incidentId));

    res.status(201).json({ success: true, data: dispatch });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active dispatches
// @route   GET /api/dispatch/active
// @access  Private
const getActiveDispatches = async (req, res, next) => {
  try {
    const dispatches = await Dispatch.find({ status: { $in: ['RECOMMENDED', 'ASSIGNED'] } })
      .populate('ambulance')
      .populate('incident');
      
    res.json({ success: true, data: dispatches });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendDispatch,
  assignDispatch,
  getActiveDispatches
};
