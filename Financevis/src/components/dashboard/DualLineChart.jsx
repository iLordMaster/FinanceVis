import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Api from "../../api/api";
import { TransactionApi } from "../../api/transactionApi";
import { useAccount } from "../../context/AccountContext";

export default function DualLineChart({ onDataLoaded }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1Y");
  const { selectedAccount } = useAccount();

  const timeOptions = ["1M", "3M", "6M", "1Y"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (timeRange === "1M" || timeRange === "3M") {
          // Fetch daily data for shorter ranges
          const endDate = new Date();
          const startDate = new Date();

          if (timeRange === "1M") {
            startDate.setMonth(endDate.getMonth() - 1);
          } else {
            startDate.setMonth(endDate.getMonth() - 3);
          }

          // Add account filter if selected
          const filters = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          };

          if (selectedAccount?.id) {
            filters.accountId = selectedAccount.id;
          }

          const [incomeData, expenseData] = await Promise.all([
            TransactionApi.getTransactions({ ...filters, type: "INCOME" }),
            TransactionApi.getTransactions({ ...filters, type: "EXPENSE" }),
          ]);

          // Process daily data
          const dailyMap = new Map();

          // Initialize map with all days in range
          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            const dayStr = d.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            });
            dailyMap.set(dayStr, {
              month: dayStr,
              income: 0,
              expenses: 0,
              rawDate: new Date(d),
            });
          }

          // Aggregate income
          incomeData.transactions.forEach((t) => {
            const d = new Date(t.date);
            const dayStr = d.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            });
            if (dailyMap.has(dayStr)) {
              dailyMap.get(dayStr).income += t.amount;
            }
          });

          // Aggregate expenses
          expenseData.transactions.forEach((t) => {
            const d = new Date(t.date);
            const dayStr = d.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            });
            if (dailyMap.has(dayStr)) {
              dailyMap.get(dayStr).expenses += t.amount;
            }
          });

          // Convert map to array and sort by date
          const sortedData = Array.from(dailyMap.values())
            .sort((a, b) => a.rawDate - b.rawDate)
            .map(({ rawDate, ...rest }) => rest);

          setData(sortedData);
          if (onDataLoaded) onDataLoaded(sortedData);
        } else {
          // Fetch monthly data for longer ranges (6M, 1Y)
          const accountParam = selectedAccount?.id
            ? `?accountId=${selectedAccount.id}`
            : "";
          const response = await Api.request(
            `/api/dashboard/monthly-stats${accountParam}`
          );

          if (Array.isArray(response)) {
            const count = response.length;
            let sliceCount = count;

            if (timeRange === "6M") sliceCount = 6;
            else sliceCount = 12; // 1Y

            const slicedData = response.slice(Math.max(count - sliceCount, 0));
            setData(slicedData);
            if (onDataLoaded) onDataLoaded(slicedData);
          } else {
            setData([]);
            if (onDataLoaded) onDataLoaded([]);
          }
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setData([]);
        if (onDataLoaded) onDataLoaded([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedAccount]); // Added selectedAccount dependency

  // Calculate indicator position
  const activeIndex = timeOptions.indexOf(timeRange);
  const indicatorStyle = {
    transform: `translateX(${activeIndex * 42}px)`,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          paddingRight: "20px",
        }}
      >
        <div className="chart-time-selector">
          <div
            className="chart-time-selector-indicator"
            style={indicatorStyle}
          ></div>
          {timeOptions.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`chart-time-option ${
                timeRange === range ? "active" : ""
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        {loading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Loading...
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.1} />
                </linearGradient>

                <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.13)" }}
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(51, 65, 85, 0.4)",
                  borderRadius: "8px",
                  color: "#fff",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend />

              <Line
                type="monotone"
                dataKey="income"
                stroke="url(#incomeColor)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="url(#expenseColor)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
