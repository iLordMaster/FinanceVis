class GetAccounts {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(userId) {
    const accounts = await this.accountRepository.findByUserId(userId);
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    return { accounts, totalBalance };
  }
}

module.exports = GetAccounts;
