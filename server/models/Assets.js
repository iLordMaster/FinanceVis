const mongoose = require('mongoose');
const AssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  value: Number,
  color: String,
  createdAt: { type: Date, default: Date.now },
});
AssetSchema.index({ userId: 1 });
module.exports = mongoose.model('Asset', AssetSchema);
