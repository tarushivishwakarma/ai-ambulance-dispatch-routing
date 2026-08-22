const express = require('express');
const { createAmbulance, getAmbulances, updateLocation, updateStatus } = require('../controllers/ambulanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('ADMIN'), createAmbulance)
  .get(getAmbulances);

router.route('/:id/location')
  .patch(protect, authorize('DRIVER', 'ADMIN'), updateLocation);

router.route('/:id/status')
  .patch(protect, authorize('DRIVER', 'DISPATCHER', 'ADMIN'), updateStatus);

module.exports = router;
