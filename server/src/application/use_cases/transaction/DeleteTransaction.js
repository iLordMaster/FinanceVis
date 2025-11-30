class DeleteTransaction {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(id, userId) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.transactionRepository.deleteById(id);
  }
}

module.exports = DeleteTransaction;
