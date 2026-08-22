const express = require('express');
const { createIncident, getIncidents, getIncidentById, updateIncidentStatus } = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .post(protect, upload.array('media', 5), createIncident)
  .get(protect, authorize('DISPATCHER', 'ADMIN'), getIncidents);

router.route('/:id')
  .get(protect, getIncidentById);

router.route('/:id/status')
  .patch(protect, authorize('DISPATCHER', 'ADMIN'), updateIncidentStatus);

module.exports = router;
