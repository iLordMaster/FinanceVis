const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["INCOME","EXPENSE"], required: true },
  icon: String,
  color: String,
  createdAt: { type: Date, default: Date.now },
});
CategorySchema.index({ userId: 1, type: 1 });
module.exports = mongoose.model('Category', CategorySchema);
