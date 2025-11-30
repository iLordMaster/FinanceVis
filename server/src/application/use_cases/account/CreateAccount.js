const Account = require('../../../domain/entities/Account');

class CreateAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(accountData) {
    const { userId, name, balance, currency } = accountData;

    if (!name) {
      throw new Error('name is required');
    }

    const account = new Account({
      userId,
      name,
      balance,
      currency,
    });

    return await this.accountRepository.create(account);
  }
}

module.exports = CreateAccount;
