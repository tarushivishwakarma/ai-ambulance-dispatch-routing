const Incident = require('../models/Incident');

// @desc    Create new incident
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res, next) => {
  try {
    const { category, description, latitude, longitude, address, affectedPeople, isMedicalEmergency } = req.body;
    
    // Process media files if uploaded
    const mediaPaths = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        mediaPaths.push(`/uploads/${req.body.type === 'evidence' ? 'evidence' : 'incidents'}/${file.filename}`);
      });
    }

    const incident = await Incident.create({
      reportedBy: req.user._id,
      category,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] // GeoJSON is [lng, lat]
      },
      address,
      media: mediaPaths,
      affectedPeople: affectedPeople ? parseInt(affectedPeople) : undefined,
      isMedicalEmergency: isMedicalEmergency === 'true' || isMedicalEmergency === true
    });

    // Notify connected clients via Socket.IO
    req.io.emit('incident:created', incident);

    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active incidents (Dispatcher view)
// @route   GET /api/incidents
// @access  Private (Dispatcher, Admin)
const getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({
      status: { $nin: ['RESOLVED', 'CANCELLED'] }
    }).populate('reportedBy', 'name phone').sort('-createdAt');
    
    res.json({ success: true, data: incidents });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name phone')
      .populate('assignedAmbulance');
      
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    res.json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status
// @route   PATCH /api/incidents/:id/status
// @access  Private
const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    // Broadcast status change
    req.io.emit('incident:status', incident);
    
    res.json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus
};
