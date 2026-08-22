const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], default: 'MODERATE' },
  city: { type: String },
  state: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  message: { type: String, required: true },
  source: { type: String },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED', 'EXPIRED'], default: 'ACTIVE' },
  expiresAt: { type: Date }
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });
alertSchema.index({ city: 1 });
alertSchema.index({ status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
