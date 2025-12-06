const TransactionRepository = require("../../domain/repositories/TransactionRepository");
const AccountRepository = require("../../domain/repositories/AccountRepository");
const BudgetRepository = require("../../domain/repositories/BudgetRepository");
const AssetRepository = require("../../domain/repositories/AssetRepository");

class DashboardService {
  constructor({
    transactionRepository,
    accountRepository,
    budgetRepository,
    assetRepository,
  }) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
    this.budgetRepository = budgetRepository;
    this.assetRepository = assetRepository;
  }

  async getTotals(userId, accountId = null) {
    const accounts = await this.accountRepository.findByUserId(userId);
    const totalBalance = accountId
      ? accounts.find((a) => a.id === accountId)?.balance || 0
      : accounts.reduce((sum, account) => sum + account.balance, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const filters = {
      startDate: startOfMonth,
      endDate: endOfMonth,
    };

    if (accountId) {
      filters.accountId = accountId;
    }

    const transactions = await this.transactionRepository.findByUserId(
      userId,
      filters
    );

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
    };
  }

  async getMonthlyIncomeVsExpenses(userId, year, accountId = null) {
    return this.transactionRepository.getMonthlyStats(userId, year, accountId);
  }

  async getTopCategories(
    userId,
    type = "EXPENSE",
    startDate = null,
    endDate = null,
    accountId = null
  ) {
    // If no date range provided, default to current month
    if (!startDate || !endDate) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    return this.transactionRepository.getCategoryStats(
      userId,
      startDate,
      endDate,
      type,
      accountId
    );
  }

  async getRecentActivity(userId, accountId = null) {
    const filters = accountId ? { accountId } : {};
    const transactions = await this.transactionRepository.findByUserId(
      userId,
      filters
    );
    return transactions.slice(0, 5); // Return top 5 most recent
  }

  async getAccountSummary(userId) {
    return this.accountRepository.findByUserId(userId);
  }

  async getBudgetSummary(userId, accountId = null) {
    // This might need more complex logic to calculate spent vs budget
    // For now, just return the budgets
    return this.budgetRepository.findByUserId(userId);
  }

  async getAssetSummary(userId) {
    return this.assetRepository.findByUserId(userId);
  }

  async getMonthlyStatsForSpecificMonth(userId, year, month, accountId = null) {
    return this.transactionRepository.getMonthlyStatsForSpecificMonth(
      userId,
      year,
      month,
      accountId
    );
  }

  async getAllMonthlyStats(userId, accountId = null) {
    return this.transactionRepository.getAllMonthlyStats(userId, accountId);
  }
}

module.exports = DashboardService;
