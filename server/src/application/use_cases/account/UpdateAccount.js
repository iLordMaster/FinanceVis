class UpdateAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(id, userId, updates) {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error("Account not found");
      }
      if (account.userId !== userId) {
        throw new Error("Unauthorized");
      }
      return await this.accountRepository.update(id, updates);
    } catch (error) {
      logger.error("Error updating account:", error);
      throw new Error(error.message);
    }
  }
}

module.exports = UpdateAccount;
