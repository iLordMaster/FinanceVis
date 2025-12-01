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
        const response = await UserApi.request('/api/dashboard/monthly-stats');
        
        console.log('Monthly stats API response:', response);
        
        // Ensure data is an array before setting it
        if (Array.isArray(response)) {
          // Validate that each item has the expected structure
          const validData = response.every(item => 
            item.hasOwnProperty('month') && 
            item.hasOwnProperty('income') && 
            item.hasOwnProperty('expenses')
          );
          
          if (validData) {
            setData(response);
          } else {
            console.error('Data items missing required fields (month, income, expenses):', response);
            setData([]);
          }
        } else {
          console.error('Expected array from monthly-stats but got:', typeof response, response);
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

  console.log('DualLineChart data:', data);

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
            cursor={{ fill: "rgba(255, 255, 255, 0.13)" }}
            contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(51, 65, 85, 0.4)",
                borderRadius: "8px",
                color: "#fff",
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