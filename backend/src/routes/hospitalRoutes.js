const express = require('express');
const { createHospital, getHospitals, matchHospitals } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('ADMIN'), createHospital);
router.get('/', getHospitals);
router.post('/match', protect, authorize('DISPATCHER', 'ADMIN'), matchHospitals);

module.exports = router;
