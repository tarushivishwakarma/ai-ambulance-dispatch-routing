const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  rawResponse: { type: Object }, // JSON from FastAPI
  verified: { type: Boolean },
  recommendedCategory: { type: String },
  recommendedSeverity: { type: Number },
  confidenceScore: { type: Number },
  medicalEmergency: { type: Boolean },
  possibleCasualties: { type: Number },
  reasoning: { type: String },
  processedAt: { type: Date, default: Date.now }
}, { timestamps: true });

aiAnalysisSchema.index({ incident: 1 });

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema);
