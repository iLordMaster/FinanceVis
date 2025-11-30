class GetTransactions {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, filters) {
    return await this.transactionRepository.findByUserId(userId, filters);
  }
}

module.exports = GetTransactions;
