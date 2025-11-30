const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);
