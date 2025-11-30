const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

AssetSchema.index({ userId: 1 });
module.exports = mongoose.model('Asset', AssetSchema);
