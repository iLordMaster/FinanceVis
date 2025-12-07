const RecurringTransactionModel = require("../database/models/RecurringTransactionModel");
const RecurringTransaction = require("../../domain/entities/RecurringTransaction");

class MongooseRecurringTransactionRepository {
  async create(recurringTransaction) {
    const newRecurringTransaction = new RecurringTransactionModel({
      userId: recurringTransaction.userId,
      accountId: recurringTransaction.accountId,
      categoryId: recurringTransaction.categoryId,
      name: recurringTransaction.name,
      amount: recurringTransaction.amount,
      type: recurringTransaction.type,
      frequency: recurringTransaction.frequency,
      dayOfMonth: recurringTransaction.dayOfMonth,
      startDate: recurringTransaction.startDate,
      endDate: recurringTransaction.endDate,
      isActive: recurringTransaction.isActive,
    });

    const saved = await newRecurringTransaction.save();
    return this._toEntity(saved);
  }

  async findByUserId(userId) {
    const recurringTransactions = await RecurringTransactionModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .populate("categoryId")
      .populate("accountId");
    return recurringTransactions.map((rt) => this._toEntity(rt));
  }

  async findById(id) {
    const recurringTransaction = await RecurringTransactionModel.findById(id)
      .populate("categoryId")
      .populate("accountId");
    if (!recurringTransaction) return null;
    return this._toEntity(recurringTransaction);
  }

  async update(id, updates) {
    const recurringTransaction =
      await RecurringTransactionModel.findByIdAndUpdate(id, updates, {
        new: true,
      })
        .populate("categoryId")
        .populate("accountId");
    if (!recurringTransaction) return null;
    return this._toEntity(recurringTransaction);
  }

  async deleteById(id) {
    const recurringTransaction =
      await RecurringTransactionModel.findByIdAndDelete(id);
    return !!recurringTransaction;
  }

  async findDueToday() {
    const today = new Date();
    const dayOfMonth = today.getDate();

    const recurringTransactions = await RecurringTransactionModel.find({
      isActive: true,
      dayOfMonth: dayOfMonth,
      startDate: { $lte: today },
      $or: [{ endDate: null }, { endDate: { $gte: today } }],
    })
      .populate("categoryId")
      .populate("accountId");

    return recurringTransactions.map((rt) => this._toEntity(rt));
  }

  _toEntity(mongoRecurringTransaction) {
    return new RecurringTransaction({
      id: mongoRecurringTransaction._id.toString(),
      userId: mongoRecurringTransaction.userId.toString(),
      accountId: (
        mongoRecurringTransaction.accountId?.id ||
        mongoRecurringTransaction.accountId
      )?.toString(),
      categoryId: mongoRecurringTransaction.categoryId,
      name: mongoRecurringTransaction.name,
      amount: mongoRecurringTransaction.amount,
      type: mongoRecurringTransaction.type,
      frequency: mongoRecurringTransaction.frequency,
      dayOfMonth: mongoRecurringTransaction.dayOfMonth,
      startDate: mongoRecurringTransaction.startDate,
      endDate: mongoRecurringTransaction.endDate,
      lastExecuted: mongoRecurringTransaction.lastExecuted,
      isActive: mongoRecurringTransaction.isActive,
      createdAt: mongoRecurringTransaction.createdAt,
    });
  }
}

module.exports = MongooseRecurringTransactionRepository;
