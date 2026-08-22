const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  dispatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispatch' },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  geometry: { type: Object, required: true }, // GeoJSON from OSRM
  distance: { type: Number }, // in meters
  duration: { type: Number }, // in seconds
  score: { type: Number }, // Computed score with penalties
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

routeSchema.index({ dispatch: 1 });
routeSchema.index({ ambulance: 1 });

module.exports = mongoose.model('Route', routeSchema);
