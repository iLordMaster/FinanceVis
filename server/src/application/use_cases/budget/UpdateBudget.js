class UpdateBudget {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async execute(id, userId, updates) {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    if (budget.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (updates.month && (updates.month < 1 || updates.month > 12)) {
      throw new Error('month must be between 1 and 12');
    }

    return await this.budgetRepository.update(id, updates);
  }
}

module.exports = UpdateBudget;
