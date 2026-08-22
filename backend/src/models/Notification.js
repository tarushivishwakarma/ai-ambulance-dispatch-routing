const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roleGroup: { type: String, enum: ['DISPATCHER', 'DRIVER', 'HOSPITAL', 'ADMIN'] },
  type: { type: String, required: true }, // e.g., 'NEW_INCIDENT', 'DISPATCH_ASSIGNED'
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Can be incident, dispatch, etc.
  onModel: { type: String, enum: ['Incident', 'Dispatch', 'Ambulance', 'Hospital'] },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ roleGroup: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
