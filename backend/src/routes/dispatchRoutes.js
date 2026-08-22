const express = require('express');
const { recommendDispatch, assignDispatch, getActiveDispatches } = require('../controllers/dispatchController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/recommend', protect, authorize('DISPATCHER', 'ADMIN'), recommendDispatch);
router.post('/assign', protect, authorize('DISPATCHER', 'ADMIN'), assignDispatch);
router.get('/active', protect, authorize('DISPATCHER', 'ADMIN', 'DRIVER'), getActiveDispatches);

module.exports = router;
