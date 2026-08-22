const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/iot/ambulance/telemetry
 * @desc    Receive IoT telemetry data from ambulances
 * @access  Public (in demo mode) or API-key protected
 */
router.post('/ambulance/telemetry', async (req, res) => {
  try {
    const { 
      ambulanceId, 
      deviceId, 
      timestamp, 
      latitude, 
      longitude, 
      speed, 
      heading, 
      battery, 
      engineStatus, 
      sirenStatus 
    } = req.body;

    // Validate minimum required fields
    if (!ambulanceId || !latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required telemetry data (ambulanceId, latitude, longitude)' 
      });
    }

    // In a real application, this would save to MongoDB (e.g., Ambulance location history)
    // and then emit via Socket.IO

    // Emit the update via Socket.IO directly to the frontend for real-time tracking
    if (req.io) {
      req.io.emit('ambulance:telemetry', {
        ambulanceId,
        deviceId: deviceId || `IOT-${ambulanceId}`,
        timestamp: timestamp || new Date().toISOString(),
        location: {
          type: 'Point',
          coordinates: [longitude, latitude] // GeoJSON format
        },
        telemetry: {
          speed: speed || 0,
          heading: heading || 0,
          battery: battery || 100,
          engineStatus: engineStatus || 'ON',
          sirenStatus: sirenStatus || 'OFF'
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Telemetry received successfully' 
    });
  } catch (error) {
    console.error('IoT Telemetry Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing telemetry' 
    });
  }
});

module.exports = router;
