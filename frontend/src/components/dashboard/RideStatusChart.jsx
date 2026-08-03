import { PieChart, Pie } from "recharts";

export default function RideStatusChart() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Ride Status</h2>

      <PieChart width={300} height={300}>
        <Pie
          data={[
            { name: "A", value: 10 },
            { name: "B", value: 20 },
          ]}
          dataKey="value"
          cx={150}
          cy={150}
          outerRadius={80}
          fill="#3B82F6"
        />
      </PieChart>
    </div>
  );
}