const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String },
  emergencyDepartment: { type: Boolean, default: true },
  traumaCenter: { type: Boolean, default: false },
  icuAvailable: { type: Boolean, default: false },
  bedsAvailable: { type: Number, default: 0 },
  bloodBank: { type: Boolean, default: false },
  specialties: [{ type: String }],
  status: { type: String, enum: ['ACTIVE', 'OVERCAPACITY', 'OFFLINE'], default: 'ACTIVE' }
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
