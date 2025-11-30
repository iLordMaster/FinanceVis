class DeleteBudget {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async execute(id, userId) {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    if (budget.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.budgetRepository.deleteById(id);
  }
}

module.exports = DeleteBudget;
