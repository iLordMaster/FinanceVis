import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Gold", value: 15700 },
  { name: "Stock", value: 22500 },
  { name: "Warehouse", value: 120000 },
  { name: "Land", value: 135000 },
];

const COLORS = ["#facc15", "#22d3ee", "#a855f7", "#ef4444"];

export default function DonutChart() {
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
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}