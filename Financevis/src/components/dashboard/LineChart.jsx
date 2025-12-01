import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserApi } from "../../api/userApi";

export default function IncomeChart({ selectedMonth, type = 'INCOME' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Determine the target month index
        const selectedMonthIndex = selectedMonth ? monthNames.indexOf(selectedMonth) : currentDate.getMonth();
        
        if (selectedMonthIndex === -1) {
          console.error('Invalid month name:', selectedMonth);
          setData([]);
          setLoading(false);
          return;
        }

        // Handle year transition: If selected month is in the future relative to current month, assume previous year
        // e.g. If current is Jan (0) and selected is Dec (11), use previous year
        if (selectedMonthIndex > currentDate.getMonth()) {
          currentYear -= 1;
        }

        // Calculate startDate (1st of month) and endDate (last day of month)
        // Note: new Date(year, month + 1, 0) gives the last day of the month
        const startDate = new Date(currentYear, selectedMonthIndex, 1);
        const endDate = new Date(currentYear, selectedMonthIndex + 1, 0, 23, 59, 59, 999);

        // Format dates as ISO strings for the API
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        // Fetch transactions for the specific date range
        // UserApi.request doesn't handle params automatically, so we construct the URL
        const response = await UserApi.request(`/api/transactions?startDate=${startDateStr}&endDate=${endDateStr}`);
        
        console.log('Transactions API response:', response);
        
        // response is expected to be { count: N, transactions: [...] } based on TransactionController
        // Handle both possible response formats
        let transactions = [];
        
        if (Array.isArray(response)) {
          // If response is directly an array
          transactions = response;
        } else if (response && Array.isArray(response.transactions)) {
          // If response is an object with transactions property
          transactions = response.transactions;
        } else {
          console.error('Unexpected response format from /api/transactions:', response);
          transactions = [];
        }
        
        console.log(`Processing ${transactions.length} transactions for ${monthNames[selectedMonthIndex]} ${currentYear}, type: ${type}`);
        processData(transactions, selectedMonthIndex, currentYear);

      } catch (error) {
        console.error('Error fetching daily stats:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, type]);

  const processData = (transactions, monthIndex, year) => {
    // Get number of days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const dailyData = [];

    // Initialize array for all days
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData.push({
        day: i,
        label: `${i}`, // Display just the day number
        amount: 0
      });
    }

    // Aggregate amount by day for the specific type
    transactions.forEach(t => {
      if (t.type === type) {
        const date = new Date(t.date);
        const day = date.getDate(); // 1-31
        
        // Find the corresponding entry in dailyData (day is 1-based, index is 0-based)
        if (day >= 1 && day <= daysInMonth) {
          dailyData[day - 1].amount += t.amount;
        }
      }
    });

    setData(dailyData);
  };

  if (loading) {
    return <div style={{ width: "100%", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient for the line */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />

          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            tickLine={false}
            tick={false}
            axisLine={false}
          />

          <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />

          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.13)" }}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(51, 65, 85, 0.4)",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            itemStyle={{ color: "#fff" }}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#incomeGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#4ade80" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}