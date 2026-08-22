const express = require('express');
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', protect, authorize('DISPATCHER', 'ADMIN'), getAnalyticsOverview);

module.exports = router;
