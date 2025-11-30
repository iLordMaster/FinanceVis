const Transaction = require('../../../domain/entities/Transaction');

class CreateTransaction {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(transactionData) {
    const { userId, accountId, categoryId, type, amount, date, description } = transactionData;

    if (!categoryId || !type || !amount || !date) {
      throw new Error('categoryId, type, amount, and date are required');
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      throw new Error('type must be either INCOME or EXPENSE');
    }

    const transaction = new Transaction({
      userId,
      accountId,
      categoryId,
      type,
      amount,
      date,
      description,
    });

    return await this.transactionRepository.create(transaction);
  }
}

module.exports = CreateTransaction;
