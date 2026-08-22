const Hospital = require('../models/Hospital');
const Incident = require('../models/Incident');

// @desc    Register a new hospital
// @route   POST /api/hospitals
// @access  Private (Admin)
const createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Private (Dispatcher, Admin, Driver)
const getHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res.json({ success: true, data: hospitals });
  } catch (error) {
    next(error);
  }
};

// @desc    Match and recommend hospitals for an incident
// @route   POST /api/hospitals/match
// @access  Private (Dispatcher, Admin)
const matchHospitals = async (req, res, next) => {
  try {
    const { incidentId } = req.body;
    
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Find all active hospitals
    const hospitals = await Hospital.find({ status: { $ne: 'OFFLINE' } });
    
    // Rank hospitals based on:
    // 1. Distance (haversine for demo)
    // 2. Capacity (beds available)
    // 3. Trauma/ICU requirements based on incident severity

    const toRad = (value) => (value * Math.PI) / 180;
    
    const rankedHospitals = hospitals.map(hospital => {
      let score = 100;
      
      // Distance calc
      const [lon1, lat1] = hospital.location.coordinates;
      const [lon2, lat2] = incident.location.coordinates;
      const R = 6371; 
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // km
      
      // Distance penalty
      score -= (distance * 2);

      // Capability checks
      if (incident.severity >= 8 && !hospital.traumaCenter) score -= 30;
      if (incident.severity >= 7 && !hospital.icuAvailable) score -= 20;
      
      // Capacity checks
      if (hospital.status === 'OVERCAPACITY') score -= 40;
      if (hospital.bedsAvailable === 0) score -= 50;
      
      return { hospital, distance, score };
    });
    
    rankedHospitals.sort((a, b) => b.score - a.score);

    res.json({ success: true, data: rankedHospitals.slice(0, 5) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHospital,
  getHospitals,
  matchHospitals
};
