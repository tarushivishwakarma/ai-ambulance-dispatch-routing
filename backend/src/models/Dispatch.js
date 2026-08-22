const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], default: 'MODERATE' },
  eta: { type: Number }, // in minutes
  distance: { type: Number }, // in km
  score: { type: Number },
  factors: { type: Object }, // To store why this was chosen (distance, capabilities, etc.)
  status: { 
    type: String, 
    enum: ['RECOMMENDED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'TRANSPORTING', 'COMPLETED', 'REJECTED', 'CANCELLED'],
    default: 'RECOMMENDED'
  },
  assignedAt: { type: Date },
  dispatchTime: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

dispatchSchema.index({ incident: 1 });
dispatchSchema.index({ ambulance: 1 });

module.exports = mongoose.model('Dispatch', dispatchSchema);
