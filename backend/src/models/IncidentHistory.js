const mongoose = require('mongoose');

const incidentHistorySchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  status: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String }
}, { timestamps: true });

incidentHistorySchema.index({ incident: 1 });

module.exports = mongoose.model('IncidentHistory', incidentHistorySchema);
