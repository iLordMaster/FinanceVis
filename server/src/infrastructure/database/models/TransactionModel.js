const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
