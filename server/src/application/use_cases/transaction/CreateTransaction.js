const Transaction = require('../../../domain/entities/Transaction');

class CreateTransaction {
  constructor(transactionRepository, accountRepository) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
  }

  async execute(transactionData) {
    const { userId, accountId, categoryId, type, amount, date, description } = transactionData;

    if (!categoryId || !type || !amount) {
      throw new Error('categoryId, type, amount are required');
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

    const createdTransaction = await this.transactionRepository.create(transaction);

    // Update account balance
    if (accountId) {
      const balanceChange = type === 'INCOME' ? amount : -amount;
      await this.accountRepository.updateBalance(accountId, balanceChange);
    }

    return createdTransaction;
  }
}

module.exports = CreateTransaction;
