const TransactionRepository = require('../../domain/repositories/TransactionRepository');
const AccountRepository = require('../../domain/repositories/AccountRepository');
const BudgetRepository = require('../../domain/repositories/BudgetRepository');
const AssetRepository = require('../../domain/repositories/AssetRepository');

class DashboardService {
  constructor({ transactionRepository, accountRepository, budgetRepository, assetRepository }) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
    this.budgetRepository = budgetRepository;
    this.assetRepository = assetRepository;
  }

  async getTotals(userId) {
    const accounts = await this.accountRepository.findByUserId(userId);
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const transactions = await this.transactionRepository.findByUserId(userId, {
      startDate: startOfMonth,
      endDate: endOfMonth
    });

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      totalIncome,
      totalExpenses
    };
  }

  async getMonthlyIncomeVsExpenses(userId, year) {
    return this.transactionRepository.getMonthlyStats(userId, year);
  }

  async getTopCategories(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return this.transactionRepository.getCategoryStats(userId, startOfMonth, endOfMonth);
  }

  async getRecentActivity(userId) {
    const transactions = await this.transactionRepository.findByUserId(userId);
    return transactions.slice(0, 5); // Return top 5 most recent
  }

  async getAccountSummary(userId) {
    return this.accountRepository.findByUserId(userId);
  }

  async getBudgetSummary(userId) {
    // This might need more complex logic to calculate spent vs budget
    // For now, just return the budgets
    return this.budgetRepository.findByUserId(userId);
  }

  async getAssetSummary(userId) {
    return this.assetRepository.findByUserId(userId);
  }
}

module.exports = DashboardService;
