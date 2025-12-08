import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { TransactionApi } from "../api/transactionApi";
import { CategoryApi } from "../api/categoryApi";
import { UserApi } from "../api/userApi";
import { DashboardService } from "../services/DashboardService";
import MetricCard from "../components/MetricCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import RecentActivityList from "../components/RecentActivityList";
import AddIncomeModal from "../components/AddIncomeModal";
import AddExpenseModal from "../components/AddExpenseModal";
import EmptyState from "../components/EmptyState";
import {
  FaDollarSign,
  FaWallet,
  FaPiggyBank,
  FaStream,
  FaPlus,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";
import PaywallModal from "../components/PaywallModal";
import ManageRecurringIncomeModal from "../components/ManageRecurringIncomeModal";
import "./Overview.css";

const Overview = () => {
  const { user } = useUser();
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    incomeStreams: 0,
  });
  const [accountBalance, setAccountBalance] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isRecurringIncomeModalOpen, setIsRecurringIncomeModalOpen] =
    useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch YTD transactions for metrics
      const now = new Date();
      // Use UTC to ensure we get the full year regardless of timezone
      const startOfYear = new Date(
        Date.UTC(now.getFullYear(), 0, 1)
      ).toISOString();
      const endOfToday = new Date().toISOString();

      const [
        incomeResponse,
        expenseResponse,
        accountsData,
        monthlyStats,
        incomeCategories,
        expenseCategories,
      ] = await Promise.all([
        TransactionApi.getTransactions({
          type: "INCOME",
          startDate: startOfYear,
          endDate: endOfToday,
        }),
        TransactionApi.getTransactions({
          type: "EXPENSE",
          startDate: startOfYear,
          endDate: endOfToday,
        }),
        // Use DashboardService for account summary
        DashboardService.getAccountSummary().then((res) => res.accounts),
        // Use API_BASE_URL to construct the full URL for dashboard stats
        UserApi.request(`${UserApi.API_BASE_URL}/api/dashboard/monthly-stats`),
        CategoryApi.getCategories("INCOME"),
        CategoryApi.getCategories("EXPENSE"),
      ]);

      // Create category map for quick lookup
      const categoryMap = new Map();
      [
        ...(incomeCategories.categories || []),
        ...(expenseCategories.categories || []),
      ].forEach((cat) => {
        categoryMap.set(cat._id, cat);
      });

      // Map categories to transactions
      const incomeTransactions = (incomeResponse.transactions || []).map(
        (t) => ({
          ...t,
          categoryId:
            typeof t.categoryId === "string"
              ? categoryMap.get(t.categoryId)
              : t.categoryId,
        })
      );

      const expenseTransactions = (expenseResponse.transactions || []).map(
        (t) => ({
          ...t,
          categoryId:
            typeof t.categoryId === "string"
              ? categoryMap.get(t.categoryId)
              : t.categoryId,
        })
      );

      const totalIncome = incomeTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );
      const totalExpenses = expenseTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );
      const netSavings = totalIncome - totalExpenses;

      // Count unique income categories (streams)
      const uniqueIncomeCategories = new Set(
        incomeTransactions
          .map((t) => t.categoryId?._id || t.categoryId)
          .filter(Boolean)
      );

      setMetrics({
        totalIncome,
        totalExpenses,
        netSavings,
        incomeStreams: uniqueIncomeCategories.size,
      });

      // Calculate total account balance
      if (Array.isArray(accountsData)) {
        const total = accountsData.reduce(
          (sum, account) => sum + account.balance,
          0
        );
        setAccountBalance(total);
      }

      // Set monthly data for mini chart
      if (Array.isArray(monthlyStats)) {
        setMonthlyData(monthlyStats.slice(-6)); // Last 6 months
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [refreshKey, fetchData]);

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFinancialTip = () => {
    const tips = [
      {
        icon: "📈",
        text: `You have ${metrics.incomeStreams} active income stream${
          metrics.incomeStreams !== 1 ? "s" : ""
        }. Diversification is key!`,
      },
      {
        icon: "💡",
        text: "Track your expenses regularly to identify areas where you can save more.",
      },
      {
        icon: "🎯",
        text: "Set monthly budget goals to stay on track with your financial objectives.",
      },
      {
        icon: "💰",
        text: `Your net savings this year: $${metrics.netSavings.toFixed(
          2
        )}. Keep it up!`,
      },
      {
        icon: "📊",
        text: "Review your spending patterns monthly to make informed financial decisions.",
      },
    ];

    // Select tip based on current data
    if (metrics.netSavings > 0) {
      return tips[3];
    } else if (metrics.incomeStreams > 1) {
      return tips[0];
    }
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const tip = getFinancialTip();

  return (
    <div className="overview-container">
      {/* Hero Section */}
      <div className="overview-hero">
        <div className="hero-greeting">
          <h1>
            {getGreeting()}, {user?.name || "User"}! 👋
          </h1>
          <p>Here's your financial overview for {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Income (YTD)"
          value={`$${metrics.totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<FaDollarSign />}
          gradient="income"
        />
        <MetricCard
          title="Total Expenses (YTD)"
          value={`$${metrics.totalExpenses.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<FaWallet />}
          gradient="expense"
        />
        <MetricCard
          title="Net Savings"
          value={`$${metrics.netSavings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<FaPiggyBank />}
          gradient="savings"
        />
        <div
          onClick={() => setIsRecurringIncomeModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <MetricCard
            title="Income Streams"
            value={metrics.incomeStreams}
            icon={<FaStream />}
            gradient="streams"
          />
        </div>
      </div>

      {/* Middle Section - Recent Activity & Quick Actions */}
      <div className="overview-middle">
        <DashboardCard title="Recent Activity" className="recent-activity-card">
          <RecentActivityList
            limit={5}
            onRefresh={refreshKey}
            onPremiumClick={() => setIsPaywallOpen(true)}
          />
        </DashboardCard>

        <DashboardCard title="Quick Actions" className="quick-actions-card">
          <div className="quick-actions-grid">
            <button
              className="quick-action-btn income"
              onClick={() => setIsIncomeModalOpen(true)}
            >
              <div className="action-icon">
                <FaPlus />
              </div>
              <div className="action-text">
                <div className="action-title">Add Income</div>
                <div className="action-subtitle">Record new income</div>
              </div>
            </button>

            <button
              className="quick-action-btn expense"
              onClick={() => setIsExpenseModalOpen(true)}
            >
              <div className="action-icon">
                <FaPlus />
              </div>
              <div className="action-text">
                <div className="action-title">Add Expense</div>
                <div className="action-subtitle">Track spending</div>
              </div>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Lower Section - Account Summary & Tips */}
      <div className="overview-lower">
        <DashboardCard title="Account Balance" className="account-balance-card">
          <div className="balance-display">
            <div className="balance-icon">
              <FaChartLine size={32} />
            </div>
            <div className="balance-info">
              <div className="balance-amount">
                $
                {accountBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="balance-label">Total across all accounts</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Budget Management" className="tips-card">
          <div
            className="restricted-content"
            onClick={() => setIsPaywallOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <div className="restricted-overlay">
              <div className="lock-icon">🔒</div>
              <div className="restricted-text">Premium Feature</div>
              <div className="restricted-subtext">Click to unlock</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Monthly Trend" className="trend-card">
          {monthlyData.length > 0 ? (
            <div className="mini-chart">
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot income"></span>
                  <span>Income</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot expense"></span>
                  <span>Expenses</span>
                </div>
              </div>
              <div className="chart-bars">
                {monthlyData.map((month, index) => {
                  const maxValue = Math.max(
                    ...monthlyData.map((m) => Math.max(m.income, m.expenses))
                  );
                  const incomeHeight =
                    maxValue > 0 ? (month.income / maxValue) * 100 : 0;
                  const expenseHeight =
                    maxValue > 0 ? (month.expenses / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="chart-month">
                      <div className="chart-bars-wrapper">
                        <div
                          className="chart-bar income"
                          style={{ height: `${incomeHeight}%` }}
                          title={`Income: $${month.income}`}
                        ></div>
                        <div
                          className="chart-bar expense"
                          style={{ height: `${expenseHeight}%` }}
                          title={`Expenses: $${month.expenses}`}
                        ></div>
                      </div>
                      <div className="chart-month-label">{month.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              icon="📊"
              title="No Data Yet"
              message="Start adding transactions to see your monthly trends."
            />
          )}
        </DashboardCard>
      </div>

      {/* Modals */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={handleTransactionAdded}
      />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={handleTransactionAdded}
      />
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
      <ManageRecurringIncomeModal
        isOpen={isRecurringIncomeModalOpen}
        onClose={() => setIsRecurringIncomeModalOpen(false)}
      />
    </div>
  );
};

export default Overview;
