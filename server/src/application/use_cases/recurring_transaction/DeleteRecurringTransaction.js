class DeleteRecurringTransaction {
  constructor(recurringTransactionRepository) {
    this.recurringTransactionRepository = recurringTransactionRepository;
  }

  async execute(id, userId) {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(id);
    if (!recurringTransaction) {
      throw new Error("Recurring transaction not found");
    }
    if (recurringTransaction.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return await this.recurringTransactionRepository.deleteById(id);
  }
}

module.exports = DeleteRecurringTransaction;
