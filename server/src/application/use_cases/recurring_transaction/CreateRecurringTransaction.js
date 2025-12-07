class CreateRecurringTransaction {
  constructor(recurringTransactionRepository) {
    this.recurringTransactionRepository = recurringTransactionRepository;
  }

  async execute(data) {
    // Validate required fields
    if (
      !data.userId ||
      !data.accountId ||
      !data.categoryId ||
      !data.name ||
      !data.amount ||
      !data.type ||
      !data.dayOfMonth ||
      !data.startDate
    ) {
      throw new Error("Missing required fields");
    }

    // Validate dayOfMonth
    if (data.dayOfMonth < 1 || data.dayOfMonth > 31) {
      throw new Error("Day of month must be between 1 and 31");
    }

    // Validate amount
    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    return await this.recurringTransactionRepository.create(data);
  }
}

module.exports = CreateRecurringTransaction;
