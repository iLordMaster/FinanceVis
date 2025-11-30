class GetTransactionSummary {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, filters) {
    const transactions = await this.transactionRepository.findByUserId(userId, filters);

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'INCOME') {
          acc.totalIncome += transaction.amount;
        } else if (transaction.type === 'EXPENSE') {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    summary.balance = summary.totalIncome - summary.totalExpense;
    return summary;
  }
}

module.exports = GetTransactionSummary;
