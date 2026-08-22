const Ambulance = require('../models/Ambulance');

// @desc    Register a new ambulance
// @route   POST /api/ambulances
// @access  Private (Admin)
const createAmbulance = async (req, res, next) => {
  try {
    const ambulance = await Ambulance.create(req.body);
    res.status(201).json({ success: true, data: ambulance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ambulances
// @route   GET /api/ambulances
// @access  Private (Dispatcher, Admin)
const getAmbulances = async (req, res, next) => {
  try {
    const ambulances = await Ambulance.find().populate('driver', 'name phone');
    res.json({ success: true, data: ambulances });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ambulance location (from Driver app)
// @route   PATCH /api/ambulances/:id/location
// @access  Private (Driver)
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
        lastUpdated: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!ambulance) {
      return res.status(404).json({ success: false, message: 'Ambulance not found' });
    }
    
    // Broadcast location update
    req.io.emit('ambulance:location', ambulance);
    
    res.json({ success: true, data: ambulance });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ambulance status
// @route   PATCH /api/ambulances/:id/status
// @access  Private
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!ambulance) {
      return res.status(404).json({ success: false, message: 'Ambulance not found' });
    }
    
    // Broadcast status update
    req.io.emit('ambulance:status', ambulance);
    
    res.json({ success: true, data: ambulance });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAmbulance,
  getAmbulances,
  updateLocation,
  updateStatus
};
