const BudgetRepository = require('../../domain/repositories/BudgetRepository');
const BudgetModel = require('../database/models/BudgetModel');
const Budget = require('../../domain/entities/Budget');

class MongooseBudgetRepository extends BudgetRepository {
  async create(budget) {
    const newBudget = new BudgetModel({
      userId: budget.userId,
      categoryId: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    const savedBudget = await newBudget.save();
    await savedBudget.populate('categoryId');
    return this._toEntity(savedBudget);
  }

  async findByUserId(userId, filters = {}) {
    const query = { userId };
    if (filters.month) query.month = filters.month;
    if (filters.year) query.year = filters.year;
    if (filters.categoryId) query.categoryId = filters.categoryId;

    const budgets = await BudgetModel.find(query)
      .populate('categoryId')
      .sort({ year: -1, month: -1 });
    return budgets.map(this._toEntity);
  }

  async findOne(query) {
    const budget = await BudgetModel.findOne(query).populate('categoryId');
    if (!budget) return null;
    return this._toEntity(budget);
  }

  async findById(id) {
    const budget = await BudgetModel.findById(id).populate('categoryId');
    if (!budget) return null;
    return this._toEntity(budget);
  }

  async update(id, updates) {
    const budget = await BudgetModel.findByIdAndUpdate(id, updates, { new: true }).populate('categoryId');
    if (!budget) return null;
    return this._toEntity(budget);
  }

  async deleteById(id) {
    const budget = await BudgetModel.findByIdAndDelete(id);
    return !!budget;
  }

  _toEntity(mongoBudget) {
    return new Budget({
      id: mongoBudget._id.toString(),
      userId: mongoBudget.userId.toString(),
      categoryId: mongoBudget.categoryId ? (mongoBudget.categoryId._id ? mongoBudget.categoryId._id.toString() : mongoBudget.categoryId.toString()) : null,
      amount: mongoBudget.amount,
      month: mongoBudget.month,
      year: mongoBudget.year,
      createdAt: mongoBudget.createdAt,
    });
  }
}

module.exports = MongooseBudgetRepository;
