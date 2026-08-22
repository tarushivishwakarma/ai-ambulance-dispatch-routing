const express = require('express');
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', getAnalyticsOverview);

module.exports = router;
