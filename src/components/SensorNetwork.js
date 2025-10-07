// src/components/SensorNetwork.js
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
  Title,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
  Title
);

const Box = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
    {children}
  </div>
);

// Progress bar component
const ProgressBar = ({ value, threshold }) => {
  let percent = Math.min((value / threshold) * 100, 120); // cap at 120%
  let color = "bg-green-500";
  if (value >= threshold) color = "bg-red-500";       // Critical
  else if (value >= threshold * 0.8) color = "bg-yellow-500"; // Warning

  return (
    <div className="w-full bg-gray-200 h-2 rounded mt-2">
      <div className={`h-2 rounded ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

// Helper: random number near base
const randomNear = (base, variance = 0.5) => {
  return parseFloat((base + (Math.random() - 0.5) * variance).toFixed(2));
};

export default function SensorNetwork() {
  const [sensorValues, setSensorValues] = useState({});
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      setSensorValues({
        tiltmeter: randomNear(2.3, 0.7), // threshold 5.0°
        piezometer: randomNear(15, 2),   // threshold 18m
        vibration: randomNear(1, 0.6),   // threshold 2 mm/s
        crackmeter: randomNear(2.8, 1.5),// threshold 3 mm
        weatherTemp: randomNear(12, 5),
        weatherHumidity: randomNear(65, 10),
        gnss: randomNear(2, 1.5),        // threshold ±5 cm
      });

      // Update bar graph synthetic data
      setBarData([
        randomNear(10, 3),
        randomNear(12, 2),
        randomNear(15, 3),
        randomNear(9, 2),
        randomNear(13, 2),
        randomNear(14, 3),
        randomNear(18, 2),
      ]);
    };

    generateData();
    const interval = setInterval(generateData, 5000); // update every 5s
    return () => clearInterval(interval);
  }, []);

  // Line Graph Data (6 sensors)
  const sensorLineData = {
    labels: ["10:00", "16:00", "22:00", "04:00", "10:00", "14:00"],
    datasets: [
      {
        label: "Tiltmeter North (°)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.tiltmeter || 2.3, 1)),
        borderColor: "blue",
        tension: 0.4,
      },
      {
        label: "Piezometer West (m)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.piezometer || 15, 2)),
        borderColor: "orange",
        tension: 0.4,
      },
      {
        label: "Vibration East (mm/s)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.vibration || 1, 0.5)),
        borderColor: "green",
        tension: 0.4,
      },
      {
        label: "Crackmeter South (mm)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.crackmeter || 2.8, 1)),
        borderColor: "red",
        tension: 0.4,
      },
      {
        label: "Weather Temp (°C)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.weatherTemp || 12, 3)),
        borderColor: "purple",
        borderDash: [5, 5], // dotted line
        tension: 0.4,
      },
      {
        label: "GNSS Movement (cm)",
        data: Array.from({ length: 6 }, () => randomNear(sensorValues.gnss || 2, 1)),
        borderColor: "brown",
        tension: 0.4,
      },
    ],
  };

  const sensorLineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Sensor Readings (Last 24h)" },
    },
    scales: {
      x: { title: { display: true, text: "Time (hh:mm)" } },
      y: { title: { display: true, text: "Sensor Values" } },
    },
  };

  // Bar Graph Data (active vs total)
  const sensorBarData = {
    labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
    datasets: [
      {
        label: "Active Sensors",
        data: barData.length ? barData : [10, 12, 15, 9, 13, 14, 18],
        backgroundColor: "black",
      },
      {
        label: "Total Capacity",
        data: [12, 13, 16, 12, 15, 17, 20],
        backgroundColor: "gray",
      },
    ],
  };

  const sensorBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Sensor Network Coverage" },
    },
    scales: {
      x: { title: { display: true, text: "Sensor Nodes" } },
      y: { title: { display: true, text: "Count" }, beginAtZero: true },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sensor Network Dashboard</h2>
      <p className="text-gray-500">Synthetic real-time monitoring of all mine safety sensors</p>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box title="Sensor Readings Trend (24h)">
          <Line data={sensorLineData} options={sensorLineOptions} />
        </Box>
        <Box title="Sensor Network Coverage">
          <Bar data={sensorBarData} options={sensorBarOptions} />
        </Box>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Box title="Tiltmeter Array">
          <p>Current Value: {sensorValues.tiltmeter}°</p>
          <p>Threshold: 5.0°</p>
          <ProgressBar value={sensorValues.tiltmeter} threshold={5} />
        </Box>

        <Box title="Piezometer Network">
          <p>Current Value: {sensorValues.piezometer}m</p>
          <p>Threshold: 18.0m</p>
          <ProgressBar value={sensorValues.piezometer} threshold={18} />
        </Box>

        <Box title="Vibration Sensors">
          <p>Current Value: {sensorValues.vibration} mm/s</p>
          <p>Threshold: 2.0 mm/s</p>
          <ProgressBar value={sensorValues.vibration} threshold={2} />
        </Box>

        <Box title="Crackmeter System">
          <p>Current Value: {sensorValues.crackmeter} mm</p>
          <p>Threshold: 3.0 mm</p>
          <ProgressBar value={sensorValues.crackmeter} threshold={3} />
        </Box>

        <Box title="Weather Station">
          <p>Temperature: {sensorValues.weatherTemp}°C</p>
          <p>Humidity: {sensorValues.weatherHumidity}%</p>
          <ProgressBar value={sensorValues.weatherHumidity} threshold={100} />
        </Box>

        <Box title="GNSS Network">
          <p>Movement ±{sensorValues.gnss} cm</p>
          <p>Threshold ±5.0 cm</p>
          <ProgressBar value={sensorValues.gnss} threshold={5} />
        </Box>
      </div>
    </div>
  );
}
