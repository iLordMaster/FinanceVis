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
import { UserApi } from "../../api/userApi";

export default function DualLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use UserApi.request to handle token and auto-logout
        const dataJson = await UserApi.request('/api/dashboard/monthly-stats');
        
        // Ensure data is an array before setting it
        if (Array.isArray(dataJson)) {
          setData(dataJson);
        } else {
          console.error('Expected array from monthly-stats but got:', dataJson);
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
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
            contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
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
          />

          <Line
            type="monotone"
            dataKey="expenses"
            stroke="url(#expenseColor)"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}