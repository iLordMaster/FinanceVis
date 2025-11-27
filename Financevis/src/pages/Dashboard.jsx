import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { UserApi } from "../api/userApi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "./Dashboard.css";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("category"); // 'category' or 'spending'
  const [spendingChartType, setSpendingChartType] = useState("line"); // 'line' or 'bar'
  const [timeRange, setTimeRange] = useState("all"); // '7days', '30days', 'all'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          setError("Invalid user data");
          setLoading(false);
          return;
        }

        const userId = user._id || user.id;
        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        const params = {};
        const now = new Date();
        if (timeRange === "7days") {
          const start = new Date(now);
          start.setDate(now.getDate() - 7);
          params.startDate = start.toISOString();
        } else if (timeRange === "30days") {
          const start = new Date(now);
          start.setDate(now.getDate() - 30);
          params.startDate = start.toISOString();
        }

        const data = await UserApi.getEntries(userId, params);

        if (Array.isArray(data)) {
          setEntries(data);
        } else if (data && Array.isArray(data.entries)) {
          setEntries(data.entries);
        } else {
          setEntries([]);
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(err.message || "Failed to load entries");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Calculations for Summary Cards
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    entries.forEach((e) => {
      const amount = parseFloat(e.entryAmount) || 0;
      if (amount >= 0) income += amount;
      else expense += Math.abs(amount);
    });
    return { income, expense, balance: income - expense };
  }, [entries]);

  // Data for Category Chart (Doughnut)
  const categoryChartData = useMemo(() => {
    const categories = {};
    entries.forEach((entry) => {
      const cat = entry.entryCat || "Uncategorized";
      const amount = parseFloat(entry.entryAmount) || 0;
      // Chart absolute values of expenses/income or just expenses?
      // Let's chart everything by magnitude for now
      if (categories[cat]) {
        categories[cat] += Math.abs(amount);
      } else {
        categories[cat] = Math.abs(amount);
      }
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Amount",
          data: Object.values(categories),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#FF9F80",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [entries]);

  // Data for Spending Chart (Line/Bar)
  const spendingChartData = useMemo(() => {
    // Group by date
    const dailyData = {};
    entries.forEach((entry) => {
      const date = new Date(entry.entryDate || entry.createdAt).toLocaleDateString();
      const amount = parseFloat(entry.entryAmount) || 0;
      
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      // For spending chart, we might want to track cumulative balance or daily spending
      // Let's track daily net flow (income - expense)
      dailyData[date] += amount;
    });

    // Sort dates
    const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Net Flow",
          data: sortedDates.map(d => dailyData[d]),
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          tension: 0.3,
          fill: spendingChartType === 'line', // Fill area for line chart? Maybe not for net flow
        },
      ],
    };
  }, [entries, spendingChartType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Financial Overview</h1>
          <div className="time-range-selector">
            <button 
              className={timeRange === '7days' ? 'active' : ''} 
              onClick={() => setTimeRange('7days')}
            >7 Days</button>
            <button 
              className={timeRange === '30days' ? 'active' : ''} 
              onClick={() => setTimeRange('30days')}
            >30 Days</button>
            <button 
              className={timeRange === 'all' ? 'active' : ''} 
              onClick={() => setTimeRange('all')}
            >All Time</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card balance">
            <div className="card-icon"><FaWallet /></div>
            <div className="card-info">
              <h3>Total Balance</h3>
              <p>${summary.balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card income">
            <div className="card-icon"><FaArrowUp /></div>
            <div className="card-info">
              <h3>Total Income</h3>
              <p>+${summary.income.toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-card expense">
            <div className="card-icon"><FaArrowDown /></div>
            <div className="card-info">
              <h3>Total Expenses</h3>
              <p>-${summary.expense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Loading data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-content">
            <div className="main-chart-section">
              <div className="chart-header">
                <h2>Analytics</h2>
                <div className="chart-controls">
                  <button 
                    className={chartType === 'category' ? 'active' : ''} 
                    onClick={() => setChartType('category')}
                  >Category</button>
                  <button 
                    className={chartType === 'spending' ? 'active' : ''} 
                    onClick={() => setChartType('spending')}
                  >Spending Flow</button>
                </div>
              </div>
              
              <div className="chart-wrapper">
                {chartType === 'category' ? (
                  <div className="doughnut-wrapper">
                    <Doughnut data={categoryChartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="line-wrapper">
                    <div className="sub-controls">
                        <label>
                            <input 
                                type="radio" 
                                checked={spendingChartType === 'line'} 
                                onChange={() => setSpendingChartType('line')} 
                            /> Line
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                checked={spendingChartType === 'bar'} 
                                onChange={() => setSpendingChartType('bar')} 
                            /> Bar
                        </label>
                    </div>
                    {spendingChartType === 'line' ? (
                        <Line data={spendingChartData} options={chartOptions} />
                    ) : (
                        <Bar data={spendingChartData} options={chartOptions} />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="entries-section">
              <h2>Recent Activity</h2>
              {entries.length === 0 ? (
                <p className="no-entries">No transactions found for this period.</p>
              ) : (
                <ul className="entries-list">
                  {entries.slice().reverse().map((entry, index) => (
                    <li key={index} className="entry-item">
                      <div className="entry-icon-wrapper">
                         {/* Placeholder icon based on category could go here */}
                         <div className="entry-dot"></div>
                      </div>
                      <div className="entry-details">
                        <span className="entry-category">{entry.entryCat || "General"}</span>
                        <span className="entry-date">
                          {new Date(entry.entryDate || entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`entry-amount ${
                          parseFloat(entry.entryAmount) >= 0 ? "income" : "expense"
                        }`}
                      >
                        {parseFloat(entry.entryAmount) >= 0 ? "+" : "-"}$
                        {Math.abs(entry.entryAmount).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;