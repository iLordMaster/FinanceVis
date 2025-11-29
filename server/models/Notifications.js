const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: String,
  type: { type: String, enum: ["INFO","WARNING","ALERT"], default: "INFO" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
NotificationSchema.index({ userId: 1, isRead: 1 });
module.exports = mongoose.model('Notification', NotificationSchema);
