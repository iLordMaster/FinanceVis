const TransactionRepository = require('../../domain/repositories/TransactionRepository');
const TransactionModel = require('../database/models/TransactionModel');
const Transaction = require('../../domain/entities/Transaction');

class MongooseTransactionRepository extends TransactionRepository {
  async create(transaction) {
    const newTransaction = new TransactionModel({
      userId: transaction.userId,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
    });
    const savedTransaction = await newTransaction.save();
    return this._toEntity(savedTransaction);
  }

  async findByUserId(userId, filters = {}) {
    const query = { userId };
    
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }
    if (filters.type) query.type = filters.type;
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.accountId) query.accountId = filters.accountId;

    const transactions = await TransactionModel.find(query)
      .populate('categoryId accountId')
      .sort({ date: -1 });
    
    return transactions.map(this._toEntity);
  }

  async findById(id) {
    const transaction = await TransactionModel.findById(id).populate('categoryId accountId');
    if (!transaction) return null;
    return this._toEntity(transaction);
  }

  async update(id, updates) {
    const transaction = await TransactionModel.findByIdAndUpdate(id, updates, { new: true }).populate('categoryId accountId');
    if (!transaction) return null;
    return this._toEntity(transaction);
  }

  async deleteById(id) {
    const transaction = await TransactionModel.findByIdAndDelete(id);
    return !!transaction;
  }

  _toEntity(mongoTransaction) {
    return new Transaction({
      id: mongoTransaction._id.toString(),
      userId: mongoTransaction.userId.toString(),
      accountId: mongoTransaction.accountId ? mongoTransaction.accountId.toString() : null, // Handle optional accountId
      categoryId: mongoTransaction.categoryId ? mongoTransaction.categoryId.toString() : null, // Handle populated or not
      type: mongoTransaction.type,
      amount: mongoTransaction.amount,
      date: mongoTransaction.date,
      description: mongoTransaction.description,
      // We might want to pass the full populated category/account objects if needed by the entity, 
      // but the entity definition currently only has IDs or generic 'category' field.
      // For now, let's stick to the basic entity structure.
      category: mongoTransaction.categoryId, // This might be the object if populated
    });
  }
}

module.exports = MongooseTransactionRepository;
