const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number },
  factors: { type: Object }, // To store why this was chosen (distance, capabilities, etc.)
  status: { 
    type: String, 
    enum: ['RECOMMENDED', 'ASSIGNED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'RECOMMENDED'
  },
  assignedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

dispatchSchema.index({ incident: 1 });
dispatchSchema.index({ ambulance: 1 });

module.exports = mongoose.model('Dispatch', dispatchSchema);
