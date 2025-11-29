const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  type: { type: String, enum: ["INCOME","EXPENSE"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1 });
TransactionSchema.index({ userId: 1, type: 1 });
module.exports = mongoose.model('Transaction', TransactionSchema);
