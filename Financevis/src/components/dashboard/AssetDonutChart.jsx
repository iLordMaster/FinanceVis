import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserApi } from "../../api/userApi";

export default function DonutChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserApi.request('/api/dashboard/asset-summary');
        
        console.log('Asset summary API response:', response);
        
        // Transform the API response to match the chart format
        if (Array.isArray(response)) {
          const chartData = response.map(asset => ({
            name: asset.name,
            value: asset.value,
            color: asset.color
          }));
          setData(chartData);
        } else {
          console.error('Expected array from asset-summary but got:', response);
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching asset summary:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
        No asset data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            wrapperStyle={{ color: "#fff" }}
            contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff"        
            }}
            labelStyle={{
                color: "#cbd5e1"     
            }}
            itemStyle={{
                color: "#fff"        
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}   
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}