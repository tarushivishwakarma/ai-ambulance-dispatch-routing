const mongoose = require('mongoose');

const roadConditionSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  segmentId: { type: String }, // Optional, if using external map segment IDs
  state: { 
    type: String, 
    enum: ['NORMAL', 'CONGESTED', 'BLOCKED', 'HIGH_RISK'],
    default: 'NORMAL'
  },
  relatedIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  penaltyScore: { type: Number, default: 0 },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { timestamps: true });

roadConditionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RoadCondition', roadConditionSchema);
