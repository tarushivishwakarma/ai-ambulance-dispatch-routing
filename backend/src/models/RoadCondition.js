const mongoose = require('mongoose');

const roadConditionSchema = new mongoose.Schema({
  roadName: { type: String },
  city: { type: String },
  state: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  type: { 
    type: String, 
    enum: ['ACCIDENT', 'ROAD_BLOCK', 'FLOODING', 'CONSTRUCTION', 'HEAVY_TRAFFIC', 'WATERLOGGING', 'DEBRIS', 'BRIDGE_CLOSURE'],
    default: 'ROAD_BLOCK'
  },
  severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], default: 'MODERATE' },
  description: { type: String },
  estimatedDelay: { type: Number }, // in minutes
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
  relatedIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { timestamps: true });

roadConditionSchema.index({ location: '2dsphere' });
roadConditionSchema.index({ city: 1 });
roadConditionSchema.index({ status: 1 });

module.exports = mongoose.model('RoadCondition', roadConditionSchema);
