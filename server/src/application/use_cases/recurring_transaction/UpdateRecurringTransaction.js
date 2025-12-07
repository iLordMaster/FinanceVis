class UpdateRecurringTransaction {
  constructor(recurringTransactionRepository) {
    this.recurringTransactionRepository = recurringTransactionRepository;
  }

  async execute(id, userId, updates) {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(id);
    if (!recurringTransaction) {
      throw new Error("Recurring transaction not found");
    }
    if (recurringTransaction.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Validate updates if provided
    if (
      updates.dayOfMonth &&
      (updates.dayOfMonth < 1 || updates.dayOfMonth > 31)
    ) {
      throw new Error("Day of month must be between 1 and 31");
    }
    if (updates.amount && updates.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return await this.recurringTransactionRepository.update(id, updates);
  }
}

module.exports = UpdateRecurringTransaction;
