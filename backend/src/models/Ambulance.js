const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceId: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'PATIENT_TRANSPORT', 'OTHER'],
    default: 'BASIC_LIFE_SUPPORT'
  },
  capabilities: [{ type: String }],
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'AT_HOSPITAL', 'OFFLINE'],
    default: 'OFFLINE'
  },
  currentIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  destination: {
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }
    },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

ambulanceSchema.index({ currentLocation: '2dsphere' });
ambulanceSchema.index({ status: 1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
