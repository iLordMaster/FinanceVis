import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UserApi } from "../../api/userApi";

export default function IncomeSourceColumnChart({ selectedMonth }) {
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
        if (selectedMonthIndex > currentDate.getMonth()) {
          currentYear -= 1;
        }

        // Calculate startDate (1st of month) and endDate (last day of month)
        const startDate = new Date(currentYear, selectedMonthIndex, 1);
        const endDate = new Date(currentYear, selectedMonthIndex + 1, 0, 23, 59, 59, 999);

        // Format dates as ISO strings for the API
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        const response = await UserApi.request(`/api/dashboard/top-categories?type=INCOME&startDate=${startDateStr}&endDate=${endDateStr}`);
        
        console.log('Income categories API response:', response);
        
        // Transform the API response to match the chart format
        if (Array.isArray(response)) {
          const chartData = response.map(category => ({
            name: category.categoryName,
            value: category.total,
            color: category.color || "#ffffff"
          }));
          setData(chartData);
        } else {
          console.error('Expected array from top-categories but got:', response);
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching income categories:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div style={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
        No income data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          {/* Remove axes */}
          <XAxis
            dataKey="name"
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />

          <YAxis hide />

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

          <Bar
            dataKey="value"
            barSize={30}
            radius={[4, 4, 0, 0]}
            label={{
              position: "top",
              fill: "#fff",
              fontSize: 13,
              formatter: (v) => `$${v.toLocaleString()}`,
            }}
          >
            {data.map((item, i) => (
              <Cell key={i} fill={item.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}