const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { 
    type: String, 
    enum: ['ACCIDENT', 'MEDICAL_EMERGENCY', 'FIRE', 'FLOOD', 'ROAD_BLOCKAGE', 'FALLEN_TREE', 'BUILDING_COLLAPSE', 'TRAFFIC_HAZARD', 'OTHER'],
    required: true
  },
  description: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String },
  media: [{ type: String }], // Array of file paths
  status: {
    type: String,
    enum: ['REPORTED', 'AI_PROCESSING', 'VERIFIED', 'REJECTED', 'PRIORITIZED', 'ASSIGNED', 'RESPONDING', 'ON_SCENE', 'TRANSPORTING', 'AT_HOSPITAL', 'RESOLVED', 'CANCELLED'],
    default: 'REPORTED'
  },
  severity: { type: Number, min: 0, max: 10 },
  aiConfidence: { type: Number },
  aiClassification: { type: String },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  duplicateProbability: { type: Number },
  affectedPeople: { type: Number },
  isMedicalEmergency: { type: Boolean, default: false },
  assignedAmbulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  assignedDispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recommendedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  resolvedAt: { type: Date }
}, { timestamps: true });

incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ category: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ severity: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
