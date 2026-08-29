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

    const incidentId = 'INC-NEW-' + Math.floor(100000 + Math.random() * 900000);
    const incident = await Incident.create({
      incidentId: incidentId,
      reportedBy: req.user ? req.user._id : undefined, // allow unauth for demo
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

    try {
      const axios = require('axios');
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiRes = await axios.post(`${aiServiceUrl}/api/ai/analyze`, {
        incidentId: incident._id.toString(),
        description: incident.description,
        category: incident.category
      });
      
      if (aiRes.data && aiRes.data.success) {
        const result = aiRes.data.data;
        const AIAnalysis = require('../models/AIAnalysis');
        await AIAnalysis.create({
          incident: incident._id,
          severityScore: result.recommendedSeverity || incident.severity,
          confidence: result.confidenceScore || 0.85,
          recommendedAmbulanceType: result.recommendedAmbulanceType || 'ALS',
          medicalAssessment: result.reasoning || 'Analysis complete',
          isGemini: result.isGemini !== false
        });
        
        // Update incident with AI fields
        incident.severity = result.recommendedSeverity || incident.severity;
        incident.aiConfidence = result.confidenceScore || 0.85;
        incident.source = result.isGemini === false ? 'DEMO AI' : 'GEMINI AI';
        await incident.save();
      }
    } catch (aiError) {
      console.error("AI Analysis failed:", aiError.message);
      // Fallback to DEMO AI if python server fails completely
      incident.source = 'DEMO AI';
      incident.aiConfidence = 0.75;
      await incident.save();
    }

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
    
    const updateData = { status };
    if (status === 'RESOLVED') {
      updateData.resolvedAt = Date.now();
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// @desc    Get historical incidents with filtering (Reports view)
// @route   GET /api/incidents/historical
// @access  Private
const getHistoricalIncidents = async (req, res, next) => {
  try {
    const { year, city, state, severity, category, ambulanceType, outcome, limit } = req.query;
    
    let filter = { status: 'RESOLVED' };
    
    if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      filter.reportedAt = { $gte: startDate, $lte: endDate };
    }
    
    if (city) filter.city = city;
    if (state) filter.state = state;
    
    if (severity) {
      if (severity === 'CRITICAL') filter.severity = { $gte: 9 };
      else if (severity === 'HIGH') filter.severity = { $gte: 7, $lt: 9 };
      else if (severity === 'MODERATE') filter.severity = { $lt: 7 };
    }
    
    if (category) filter.category = category;
    if (ambulanceType) filter.ambulanceType = ambulanceType;
    if (outcome) filter.outcome = outcome;

    let query = Incident.find(filter).sort('-reportedAt');
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const incidents = await query;
    
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  getHistoricalIncidents
};
