const Incident = require('../models/Incident');

// @desc    Get dashboard and historical analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getAnalyticsOverview = async (req, res, next) => {
  try {
    const filter = {}; // Include both live and historical

    // Overview Stats
    const totalIncidents = await Incident.countDocuments(filter);
    const criticalIncidents = await Incident.countDocuments({ ...filter, severity: { $gte: 9 } });
    
    // Detailed Aggregations (Mainly for historical/resolved data)
    const resolvedIncidents = await Incident.find({ ...filter, status: 'RESOLVED' });
    
    let totalResponseTimeMs = 0;
    let totalHospitalArrivalTimeMs = 0;
    let totalResolutionTimeMs = 0;
    
    let responseCount = 0;
    let hospitalCount = 0;
    let resolutionCount = 0;
    
    resolvedIncidents.forEach(inc => {
      // Response time (Reported -> Arrived On Scene)
      if (inc.arrivedOnSceneTime && inc.reportedAt) {
        totalResponseTimeMs += (inc.arrivedOnSceneTime - inc.reportedAt);
        responseCount++;
      } else if (inc.resolvedAt && inc.reportedAt) {
        // fallback to old logic
        totalResponseTimeMs += (inc.resolvedAt - inc.reportedAt);
        responseCount++;
      }

      // Hospital Arrival (Arrived -> Hospital Arrival)
      if (inc.hospitalArrivalTime && inc.arrivedOnSceneTime) {
        totalHospitalArrivalTimeMs += (inc.hospitalArrivalTime - inc.arrivedOnSceneTime);
        hospitalCount++;
      }

      // Resolution Time (Reported -> Resolved)
      if (inc.resolvedAt && inc.reportedAt) {
        totalResolutionTimeMs += (inc.resolvedAt - inc.reportedAt);
        resolutionCount++;
      }
    });
    
    const avgResponseMinutes = responseCount > 0 ? Math.round((totalResponseTimeMs / responseCount) / 60000) : 0;
    const avgHospitalArrivalMinutes = hospitalCount > 0 ? Math.round((totalHospitalArrivalTimeMs / hospitalCount) / 60000) : 0;
    const avgResolutionMinutes = resolutionCount > 0 ? Math.round((totalResolutionTimeMs / resolutionCount) / 60000) : 0;
    
    // Aggregations
    const categoryStats = await Incident.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const incidentsByCity = await Incident.aggregate([
      { $match: filter },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const incidentsByYear = await Incident.aggregate([
      { $match: { ...filter, reportedAt: { $ne: null } } },
      { $group: { _id: { $year: "$reportedAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const resolutionOutcomes = await Incident.aggregate([
      { $match: { ...filter, outcome: { $ne: null } } },
      { $group: { _id: '$outcome', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ambulanceTypeUsage = await Incident.aggregate([
      { $match: { ...filter, ambulanceType: { $ne: null } } },
      { $group: { _id: '$ambulanceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const severityDistribution = await Incident.aggregate([
      { $match: filter },
      { $group: { 
          _id: {
            $cond: [
              { $gte: ["$severity", 9] }, "CRITICAL",
              { $cond: [{ $gte: ["$severity", 7] }, "HIGH", "MODERATE"] }
            ]
          }, 
          count: { $sum: 1 } 
      } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalIncidents,
        criticalIncidents,
        avgResponseMinutes,
        avgHospitalArrivalMinutes,
        avgResolutionMinutes,
        categoryStats,
        incidentsByCity,
        incidentsByYear,
        resolutionOutcomes,
        ambulanceTypeUsage,
        severityDistribution,
        totalResolved: resolvedIncidents.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview
};
