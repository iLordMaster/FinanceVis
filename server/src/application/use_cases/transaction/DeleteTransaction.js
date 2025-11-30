class DeleteTransaction {
  constructor(transactionRepository, accountRepository) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
  }

  async execute(id, userId) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await this.transactionRepository.deleteById(id);

    // Reverse account balance change
    if (transaction.accountId) {
      const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
      await this.accountRepository.updateBalance(transaction.accountId, balanceChange);
    }

    return true;
  }
}

module.exports = DeleteTransaction;
