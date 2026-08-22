const express = require('express');
const { calculateRouteEndpoint } = require('../controllers/routeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/calculate', protect, calculateRouteEndpoint);

module.exports = router;
