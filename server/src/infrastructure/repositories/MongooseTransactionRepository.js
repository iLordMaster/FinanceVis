const TransactionRepository = require("../../domain/repositories/TransactionRepository");
const TransactionModel = require("../database/models/TransactionModel");
const mongoose = require("mongoose");
const Transaction = require("../../domain/entities/Transaction");

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
      .populate("categoryId accountId")
      .sort({ date: -1 });

    return transactions.map(this._toEntity);
  }

  async findById(id) {
    const transaction = await TransactionModel.findById(id).populate(
      "categoryId accountId"
    );
    if (!transaction) return null;
    return this._toEntity(transaction);
  }

  async update(id, updates) {
    const transaction = await TransactionModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("categoryId accountId");
    if (!transaction) return null;
    return this._toEntity(transaction);
  }

  async deleteById(id) {
    const transaction = await TransactionModel.findByIdAndDelete(id);
    return !!transaction;
  }

  async getMonthlyStats(userId, year, accountId = null) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const matchQuery = {
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startOfYear, $lte: endOfYear },
    };

    // Add accountId filter if provided
    if (accountId) {
      matchQuery.accountId = new mongoose.Types.ObjectId(accountId);
    }

    const stats = await TransactionModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          type: "$_id.type",
          total: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    // Transform the data into the desired format
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = {};

    // Initialize all 12 months with 0 values
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        month: monthNames[i - 1],
        income: 0,
        expenses: 0,
      };
    }

    // Populate with actual data
    stats.forEach((stat) => {
      const monthNum = stat.month;
      if (stat.type === "INCOME") {
        monthlyData[monthNum].income = stat.total || 0;
      } else if (stat.type === "EXPENSE") {
        monthlyData[monthNum].expenses = stat.total || 0;
      }
    });

    // Convert to array and return
    return Object.values(monthlyData);
  }

  async getMonthlyStatsForSpecificMonth(userId, year, month, accountId = null) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const matchQuery = {
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };

    // Add accountId filter if provided
    if (accountId) {
      matchQuery.accountId = new mongoose.Types.ObjectId(accountId);
    }

    const stats = await TransactionModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          total: 1,
          count: 1,
        },
      },
    ]);

    // Transform the data into the desired format
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const result = {
      month: monthNames[month - 1],
      income: 0,
      expenses: 0,
    };

    // Populate with actual data
    stats.forEach((stat) => {
      if (stat.type === "INCOME") {
        result.income = stat.total || 0;
      } else if (stat.type === "EXPENSE") {
        result.expenses = stat.total || 0;
      }
    });

    return result;
  }

  async getAllMonthlyStats(userId, accountId = null) {
    const matchQuery = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    // Add accountId filter if provided
    if (accountId) {
      matchQuery.accountId = new mongoose.Types.ObjectId(accountId);
    }

    const stats = await TransactionModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          type: "$_id.type",
          total: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return stats;
  }

  async getCategoryStats(
    userId,
    startDate,
    endDate,
    type = "EXPENSE",
    accountId = null
  ) {
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      type: type,
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

    // Add accountId filter if provided
    if (accountId) {
      query.accountId = new mongoose.Types.ObjectId(accountId);
    }

    const stats = await TransactionModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
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
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    return stats;
  }

  _toEntity(mongoTransaction) {
    const accountId = mongoTransaction.accountId;
    const categoryId = mongoTransaction.categoryId;

    return new Transaction({
      id: mongoTransaction._id.toString(),
      userId: mongoTransaction.userId.toString(),
      accountId: accountId
        ? accountId._id
          ? accountId._id.toString()
          : accountId.toString()
        : null,
      categoryId: categoryId
        ? categoryId._id
          ? categoryId._id.toString()
          : categoryId.toString()
        : null,
      type: mongoTransaction.type,
      amount: mongoTransaction.amount,
      date: mongoTransaction.date,
      description: mongoTransaction.description,
      category: categoryId && categoryId._id ? categoryId : null,
    });
  }
}

module.exports = MongooseTransactionRepository;
