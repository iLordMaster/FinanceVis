const Account = require("../../../domain/entities/Account");

class CreateAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(accountData) {
    try {
      const { userId, name, balance, currency } = accountData;

      if (!name) {
        throw new Error("name is required");
      }

      const account = new Account({
        userId,
        name,
        balance,
        currency,
      });

      return await this.accountRepository.create(account);
    } catch (error) {
      logger.error("Error creating account:", error);
      throw new Error(error.message);
    }
  }
}

module.exports = CreateAccount;
