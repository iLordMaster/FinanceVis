const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  createdAt: { type: Date, default: Date.now },
});
AccountSchema.index({ userId: 1 });
module.exports = mongoose.model('Account', AccountSchema);
