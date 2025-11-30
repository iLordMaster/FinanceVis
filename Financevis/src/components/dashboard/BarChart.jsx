import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function IncomeSourceColumnChart() {
  const data = [
    { name: "E-commerce", value: 2100, color: "#ffffff" },
    { name: "Google Adsense", value: 950, color: "#ef4444" },
    { name: "My Shop", value: 8000, color: "#ffffff" },
    { name: "Salary", value: 13000, color: "#10b981" },
  ];
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