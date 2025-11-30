class GetBudgets {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async execute(userId, filters) {
    return await this.budgetRepository.findByUserId(userId, filters);
  }
}

module.exports = GetBudgets;
