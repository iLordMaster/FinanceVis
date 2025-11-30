const TransactionRepository = require('../../domain/repositories/TransactionRepository');
const TransactionModel = require('../database/models/TransactionModel');
const mongoose = require('mongoose');
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

  async getMonthlyStats(userId, year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const stats = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          type: "$_id.type",
          total: 1
        }
      }
    ]);

    return stats;
  }

  async getCategoryStats(userId, startDate, endDate) {
    const query = { 
      userId: new mongoose.Types.ObjectId(userId),
      type: 'EXPENSE' // Corrected to match enum 'EXPENSE'
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const stats = await TransactionModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories", // Assuming the collection name is 'categories'
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$category.name",
          color: "$category.color",
          icon: "$category.icon",
          total: 1,
          count: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    return stats;
  }

  _toEntity(mongoTransaction) {
    const accountId = mongoTransaction.accountId;
    const categoryId = mongoTransaction.categoryId;

    return new Transaction({
      id: mongoTransaction._id.toString(),
      userId: mongoTransaction.userId.toString(),
      accountId: accountId ? (accountId._id ? accountId._id.toString() : accountId.toString()) : null,
      categoryId: categoryId ? (categoryId._id ? categoryId._id.toString() : categoryId.toString()) : null,
      type: mongoTransaction.type,
      amount: mongoTransaction.amount,
      date: mongoTransaction.date,
      description: mongoTransaction.description,
      category: categoryId && categoryId._id ? categoryId : null, // Pass full object if populated
    });
  }
}

module.exports = MongooseTransactionRepository;
