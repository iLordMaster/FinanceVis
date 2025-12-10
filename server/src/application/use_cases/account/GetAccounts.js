class GetAccounts {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(userId) {
    try {
      const accounts = await this.accountRepository.findByUserId(userId);
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      return { accounts, totalBalance };
    } catch (error) {
      logger.error("Error getting accounts:", error);
      throw new Error(error.message);
    }
  }
}

module.exports = GetAccounts;
