// src/components/SensorNetwork.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const SensorNetwork = () => {
  // Dummy sensor data (Line chart ke liye)
  const sensorData = [
    { time: "00:00", Tiltmeter: 12, Piezometer: 18, Vibration: 10, Crackmeter: 22 },
    { time: "06:00", Tiltmeter: 14, Piezometer: 20, Vibration: 9, Crackmeter: 21 },
    { time: "12:00", Tiltmeter: 16, Piezometer: 22, Vibration: 11, Crackmeter: 20 },
    { time: "18:00", Tiltmeter: 15, Piezometer: 19, Vibration: 12, Crackmeter: 19 },
    { time: "24:00", Tiltmeter: 13, Piezometer: 17, Vibration: 10, Crackmeter: 18 },
  ];

  // Dummy sector-wise coverage (Bar chart ke liye)
  const coverageData = [
    { sector: "S1", sensors: 12 },
    { sector: "S2", sensors: 14 },
    { sector: "S3", sensors: 16 },
    { sector: "S4", sensors: 18 },
    { sector: "S5", sensors: 15 },
    { sector: "S6", sensors: 20 },
    { sector: "S7", sensors: 22 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Sensor Network Dashboard</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sensor Readings Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Tiltmeter" stroke="#8884d8" />
              <Line type="monotone" dataKey="Piezometer" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Vibration" stroke="#ffc658" />
              <Line type="monotone" dataKey="Crackmeter" stroke="#ff0000" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sensor Network Coverage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coverageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sensors" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorNetwork;
