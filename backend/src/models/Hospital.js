const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String },
  emergencyDepartment: { type: Boolean, default: true },
  traumaCenter: { type: Boolean, default: false },
  traumaLevel: { type: Number },
  traumaCapable: { type: Boolean },
  icuAvailable: { type: Boolean, default: false },
  icuBeds: { type: Number },
  availableIcuBeds: { type: Number },
  emergencyBeds: { type: Number },
  availableEmergencyBeds: { type: Number },
  bedsAvailable: { type: Number, default: 0 },
  occupancy: { type: Number },
  bloodBank: { type: Boolean, default: false },
  specialties: [{ type: String }],
  type: { type: String }, // e.g., 'GOVERNMENT', 'PRIVATE'
  ownership: { type: String },
  dataSource: { type: String },
  status: { type: String, enum: ['ACTIVE', 'OVERCAPACITY', 'OFFLINE', 'AVAILABLE'], default: 'ACTIVE' }
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
