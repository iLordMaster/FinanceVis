import { TransactionApi } from '../api/transactionApi';
import { CategoryApi } from '../api/categoryApi';
import { AccountApi } from '../api/accountApi';
import { BudgetApi } from '../api/budgetApi';
import { AssetApi } from '../api/assetApi';
import { UserApi } from '../api/userApi';

/**
 * DashboardService - Aggregates data from multiple APIs for dashboard display
 * Implements the service layer pattern to provide high-level business logic
 */
export class DashboardService {
  /**
   * Get total income and expenses
   * @returns {Promise<{totalIncome: number, totalExpense: number, balance: number}>}
   */
  static async getTotals() {
    try {
      const summary = await TransactionApi.getSummary();
      return {
        totalIncome: summary.totalIncome || 0,
        totalExpense: summary.totalExpense || 0,
        balance: summary.balance || 0,
      };
    } catch (error) {
      console.error('Error fetching totals:', error);
      throw error;
    }
  }

  /**
   * Get monthly income vs expenses comparison
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date for filtering
   * @param {string} params.endDate - End date for filtering
   * @returns {Promise<{income: number, expenses: number}>}
   */
  static async getMonthlyIncomeVsExpenses(params = {}) {
    try {
      const [incomeData, expenseData] = await Promise.all([
        TransactionApi.getTransactions({ ...params, type: 'INCOME' }),
        TransactionApi.getTransactions({ ...params, type: 'EXPENSE' }),
      ]);

      const income = incomeData.transactions.reduce((sum, t) => sum + t.amount, 0);
      const expenses = expenseData.transactions.reduce((sum, t) => sum + t.amount, 0);

      return { income, expenses };
    } catch (error) {
      console.error('Error fetching monthly income vs expenses:', error);
      throw error;
    }
  }

  /**
   * Get top categories by spending/income
   * @param {string} type - 'INCOME' or 'EXPENSE'
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Array<{categoryId: string, categoryName: string, total: number, count: number}>>}
   */
  static async getTopCategories(type = 'EXPENSE', params = {}) {
    try {
      const response = await TransactionApi.getByCategory({ ...params, type });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching top categories:', error);
      throw error;
    }
  }

  /**
   * Get recent activity (latest transactions)
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise<Array>}
   */
  static async getRecentActivity(limit = 10) {
    try {
      const response = await TransactionApi.getTransactions();
      return response.transactions.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  /**
   * Get account summary (all accounts with balances)
   * @returns {Promise<{accounts: Array, totalBalance: number}>}
   */
  static async getAccountSummary() {
    try {
      const response = await AccountApi.getAccounts();
      return {
        accounts: response.accounts || [],
        totalBalance: response.totalBalance || 0,
      };
    } catch (error) {
      console.error('Error fetching account summary:', error);
      throw error;
    }
  }

  /**
   * Get budget summary (budgets with progress)
   * @param {Object} params - Query parameters
   * @param {number} params.month - Month (1-12)
   * @param {number} params.year - Year
   * @returns {Promise<Array<{budget: Object, spent: number, progress: number}>>}
   */
  static async getBudgetSummary(params = {}) {
    try {
      const currentDate = new Date();
      const month = params.month || currentDate.getMonth() + 1;
      const year = params.year || currentDate.getFullYear();

      // Get budgets for the specified month/year
      const budgetResponse = await BudgetApi.getBudgets({ month, year });
      const budgets = budgetResponse.budgets || [];

      // Get transactions for the same period to calculate spending
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      const budgetProgress = await Promise.all(
        budgets.map(async (budget) => {
          try {
            const transactionResponse = await TransactionApi.getTransactions({
              categoryId: budget.categoryId._id,
              type: 'EXPENSE',
              startDate,
              endDate,
            });

            const spent = transactionResponse.transactions.reduce(
              (sum, t) => sum + t.amount,
              0
            );

            const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

            return {
              budget,
              spent,
              progress: Math.min(progress, 100), // Cap at 100%
              remaining: Math.max(budget.amount - spent, 0),
            };
          } catch (error) {
            console.error(`Error fetching transactions for budget ${budget._id}:`, error);
            return {
              budget,
              spent: 0,
              progress: 0,
              remaining: budget.amount,
            };
          }
        })
      );

      return budgetProgress;
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  /**
   * Get asset summary (all assets with total value)
   * @returns {Promise<{assets: Array, totalValue: number}>}
   */
  static async getAssetSummary() {
    try {
      const response = await AssetApi.getAssets();
      return {
        assets: response.assets || [],
        totalValue: response.totalValue || 0,
      };
    } catch (error) {
      console.error('Error fetching asset summary:', error);
      throw error;
    }
  }

  /**
   * Get complete dashboard data in a single call
   * @param {Object} params - Optional parameters for filtering
   * @returns {Promise<Object>} Complete dashboard data
   */
  static async getDashboardData(params = {}) {
    try {
      const [
        totals,
        monthlyComparison,
        topExpenseCategories,
        topIncomeCategories,
        recentActivity,
        accountSummary,
        budgetSummary,
        assetSummary,
      ] = await Promise.all([
        this.getTotals(),
        this.getMonthlyIncomeVsExpenses(params),
        this.getTopCategories('EXPENSE', params),
        this.getTopCategories('INCOME', params),
        this.getRecentActivity(10),
        this.getAccountSummary(),
        this.getBudgetSummary(params),
        this.getAssetSummary(),
      ]);

      return {
        totals,
        monthlyComparison,
        topExpenseCategories,
        topIncomeCategories,
        recentActivity,
        accountSummary,
        budgetSummary,
        assetSummary,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}
