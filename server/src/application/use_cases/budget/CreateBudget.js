const Budget = require('../../../domain/entities/Budget');

class CreateBudget {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async execute(budgetData) {
    const { userId, categoryId, amount, month, year } = budgetData;

    if (!categoryId || !amount || !month || !year) {
      throw new Error('categoryId, amount, month, and year are required');
    }

    if (month < 1 || month > 12) {
      throw new Error('month must be between 1 and 12');
    }

    const existingBudget = await this.budgetRepository.findOne({
      userId,
      categoryId,
      month,
      year,
    });

    if (existingBudget) {
      throw new Error('Budget already exists for this category and period');
    }

    const budget = new Budget({
      userId,
      categoryId,
      amount,
      month,
      year,
    });

    return await this.budgetRepository.create(budget);
  }
}

module.exports = CreateBudget;
