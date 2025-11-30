class DeleteAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(id, userId) {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.accountRepository.deleteById(id);
  }
}

module.exports = DeleteAccount;
