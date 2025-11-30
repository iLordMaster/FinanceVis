import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const incomeData = [
  { month: "Jan", income: 12000 },
  { month: "Feb", income: 14000 },
  { month: "Mar", income: 11000 },
  { month: "Apr", income: 18000 },
  { month: "May", income: 20000 },
  { month: "Jun", income: 24000 },
  { month: "Jul", income: 22000 },
];

export default function IncomeChart() {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={incomeData}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient for the line */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />

          <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />

          <Tooltip
            wrapperStyle={{ color: "#fff" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            itemStyle={{ color: "#fff" }}
          />

          <Line
            type="monotone"
            dataKey="income"
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