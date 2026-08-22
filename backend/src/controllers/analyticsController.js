const Incident = require('../models/Incident');
const Dispatch = require('../models/Dispatch');

// @desc    Get dashboard analytics overview
// @route   GET /api/analytics/overview
// @access  Private (Dispatcher, Admin)
const getAnalyticsOverview = async (req, res, next) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const criticalIncidents = await Incident.countDocuments({ severity: { $gte: 9 } });
    
    const resolvedIncidents = await Incident.find({ status: 'RESOLVED' });
    
    let totalResponseTime = 0;
    let responseCount = 0;
    
    // Simplistic response time calculation (createdAt to resolvedAt)
    resolvedIncidents.forEach(inc => {
      if (inc.resolvedAt) {
        totalResponseTime += (inc.resolvedAt - inc.createdAt);
        responseCount++;
      }
    });
    
    const avgResponseTimeMs = responseCount > 0 ? totalResponseTime / responseCount : 0;
    const avgResponseMinutes = Math.round(avgResponseTimeMs / 60000);
    
    // Aggregation by category
    const categoryStats = await Incident.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalIncidents,
        criticalIncidents,
        avgResponseMinutes,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview
};
