const Transaction = require("../../../domain/entities/Transaction");

class CreateTransaction {
  constructor(transactionRepository, accountRepository) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
  }

  async execute(transactionData) {
    const { userId, accountId, categoryId, type, amount, date, description } =
      transactionData;

    if (!accountId || !categoryId || !type || !amount) {
      throw new Error("accountId, categoryId, type, and amount are required");
    }

    if (!["INCOME", "EXPENSE"].includes(type)) {
      throw new Error("type must be either INCOME or EXPENSE");
    }

    // Check if user has at least one account
    const userAccounts = await this.accountRepository.findByUserId(userId);
    if (!userAccounts || userAccounts.length === 0) {
      const error = new Error(
        "You must create at least one account before adding transactions"
      );
      error.code = "NO_ACCOUNTS";
      throw error;
    }

    // Verify the selected account belongs to the user
    const accountBelongsToUser = userAccounts.some((acc) => {
      const accId = (acc._id || acc.id).toString();
      const selectedAccId = accountId.toString();
      return accId === selectedAccId;
    });
    if (!accountBelongsToUser) {
      throw new Error("The selected account does not belong to you");
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

    const createdTransaction = await this.transactionRepository.create(
      transaction
    );

    // Update account balance
    const balanceChange = type === "INCOME" ? amount : -amount;
    await this.accountRepository.updateBalance(accountId, balanceChange);

    return createdTransaction;
  }
}

module.exports = CreateTransaction;
