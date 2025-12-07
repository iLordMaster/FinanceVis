class GetRecurringTransactions {
  constructor(recurringTransactionRepository) {
    this.recurringTransactionRepository = recurringTransactionRepository;
  }

  async execute(userId) {
    return await this.recurringTransactionRepository.findByUserId(userId);
  }
}

module.exports = GetRecurringTransactions;
