const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  amount: { type: Number, required: true },
  month: Number, // 1-12
  year: Number,
  createdAt: { type: Date, default: Date.now },
});

BudgetSchema.index({ userId: 1, month: 1, year: 1 });
module.exports = mongoose.model('Budget', BudgetSchema);
