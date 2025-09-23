import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const data = [
  { time: "04:00", Tilt: 2.1, Vib: 0.5, Crack: 3.9 },
  { time: "08:00", Tilt: 2.3, Vib: 0.7, Crack: 4.0 },
  { time: "12:00", Tilt: 2.6, Vib: 0.9, Crack: 4.2 },
  { time: "20:00", Tilt: 2.4, Vib: 0.8, Crack: 4.1 },
];

export default function LineChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Tilt" stroke="#2ca02c" />
        <Line type="monotone" dataKey="Vib" stroke="#ff7f0e" />
        <Line type="monotone" dataKey="Crack" stroke="#d62728" />
      </LineChart>
    </ResponsiveContainer>
  );
}
