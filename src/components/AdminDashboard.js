// src/components/AdminDashboard.js
import React, { useState } from "react";
import { Line, Bar, Chart } from "react-chartjs-2";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";

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
  CandlestickController,
  CandlestickElement
);

const Box = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
    {children}
  </div>
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // ---------------- Overview Graph Data ----------------
  const overviewLineData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Risk Analysis",
        data: [40, 45, 50, 60, 70, 65],
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const overviewLineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // ---------------- Sensor Network Graph Data ----------------
  const sensorLineData = {
    labels: [
      "Jan 16 10:00",
      "Jan 16 16:00",
      "Jan 16 22:00",
      "Jan 17 04:00",
      "Jan 17 10:00",
      "Jan 17 14:00",
    ],
    datasets: [
      {
        label: "Tiltmeter North",
        data: [20, 19, 18.5, 19.5, 20, 20.2],
        borderColor: "blue",
        tension: 0.4,
      },
      {
        label: "Piezometer West",
        data: [12, 11.5, 10.8, 11.2, 12, 12.3],
        borderColor: "orange",
        tension: 0.4,
      },
      {
        label: "Vibration East",
        data: [16, 14, 12, 15, 17, 16.5],
        borderColor: "green",
        tension: 0.4,
      },
      {
        label: "Crackmeter South",
        data: [18, 18.2, 18.5, 19, 19.3, 19.1],
        borderColor: "red",
        tension: 0.4,
      },
    ],
  };
  const sensorLineOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  const sensorBarData = {
    labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
    datasets: [
      { label: "Active Sensors", data: [10, 12, 15, 9, 13, 14, 18], backgroundColor: "black" },
      { label: "Total Capacity", data: [12, 13, 16, 12, 15, 17, 20], backgroundColor: "gray" },
    ],
  };
  const sensorBarOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  // ---------------- Candlestick helpers ----------------
  const candleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.raw || {};
            return ` O:${v.o}  H:${v.h}  L:${v.l}  C:${v.c}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "hour", displayFormats: { hour: "HH:mm" } },
        grid: { color: "#e5e7eb" },
        ticks: { maxTicksLimit: 3 },
      },
      y: { grid: { color: "#e5e7eb" }, ticks: { padding: 6 } },
    },
  };
  const makeCandleData = (rows) => ({
    datasets: [
      {
        type: "candlestick",
        data: rows,
        borderWidth: 1.25,
        barThickness: 18,
        wick: { useCandlestickColor: true, width: 1.25 },
        borderColor: { up: "#16a34a", down: "#ef4444", unchanged: "#94a3b8" },
        color: { up: "#86efac", down: "#fecaca", unchanged: "#cbd5e1" },
      },
    ],
  });

  // sample rows
  const tiltRows = [
    { x: new Date("2025-09-21T04:00"), o: 2.1, h: 2.4, l: 2.0, c: 2.3 },
    { x: new Date("2025-09-21T12:00"), o: 2.3, h: 2.6, l: 2.2, c: 2.5 },
    { x: new Date("2025-09-21T20:00"), o: 2.5, h: 2.65, l: 2.3, c: 2.45 },
  ];
  const piezoRows = [
    { x: new Date("2025-09-21T04:00"), o: 14.8, h: 15.3, l: 14.5, c: 15.0 },
    { x: new Date("2025-09-21T12:00"), o: 15.0, h: 15.6, l: 14.9, c: 15.4 },
    { x: new Date("2025-09-21T20:00"), o: 15.4, h: 15.7, l: 15.2, c: 15.3 },
  ];
  const vibRows = [
    { x: new Date("2025-09-21T04:00"), o: 0.6, h: 0.8, l: 0.6, c: 0.75 },
    { x: new Date("2025-09-21T12:00"), o: 0.75, h: 0.95, l: 0.7, c: 0.9 },
    { x: new Date("2025-09-21T20:00"), o: 0.9, h: 1.1, l: 0.85, c: 1.0 },
  ];
  const crackRows = [
    { x: new Date("2025-09-21T04:00"), o: 3.8, h: 4.1, l: 3.7, c: 4.0 },
    { x: new Date("2025-09-21T12:00"), o: 4.0, h: 4.3, l: 3.9, c: 4.2 },
    { x: new Date("2025-09-21T20:00"), o: 4.2, h: 4.4, l: 4.0, c: 4.3 },
  ];

  // ---------------- Personnel & markers ----------------
  const personnelList = [
    { id: 1, name: "John Smith", role: "Mine Supervisor", sector: "Sector A", status: "Safe", lastSeen: "2 min ago" },
    { id: 2, name: "Sarah Johnson", role: "Equipment Operator", sector: "Sector B", status: "Caution", lastSeen: "1 min ago" },
    { id: 3, name: "Mike Chen", role: "Safety Inspector", sector: "Sector C", status: "Safe", lastSeen: "30 sec ago" },
    { id: 4, name: "Lisa Rodriguez", role: "Geologist", sector: "Sector D", status: "Emergency", lastSeen: "5 min ago" },
    { id: 5, name: "Carlos Diaz", role: "Technician", sector: "Sector B", status: "Offline", lastSeen: "10 min ago" },
  ];

  const markers = [
    { id: 1, left: "40%", top: "35%", color: "bg-green-500" },
    { id: 2, left: "18%", top: "65%", color: "bg-green-500" },
    { id: 3, left: "75%", top: "28%", color: "bg-red-500" },
    { id: 4, left: "55%", top: "55%", color: "bg-yellow-400" },
    { id: 5, left: "30%", top: "48%", color: "bg-gray-500" },
  ];

  const statusClass = (s) =>
    s === "Safe" ? "bg-green-100 text-green-800" :
    s === "Caution" ? "bg-yellow-100 text-yellow-800" :
    s === "Emergency" ? "bg-red-100 text-red-800" :
    "bg-gray-100 text-gray-700";

  // ---------------- Risk & Alerts data ----------------
  const riskFactors = [
    { title: "Ground Displacement", desc: "Accelerating movement detected in northwest slope", pct: 85, tag: "high impact", tagColor: "bg-red-100 text-red-700" },
    { title: "Groundwater Pressure", desc: "Elevated but stable pressure levels", pct: 72, tag: "medium impact", tagColor: "bg-gray-100 text-gray-700" },
    { title: "Weather Conditions", desc: "Recent rainfall contributing to instability", pct: 45, tag: "low impact", tagColor: "bg-green-100 text-green-700" },
    { title: "Seismic Activity", desc: "Normal background vibration levels", pct: 28, tag: "low impact", tagColor: "bg-green-100 text-green-700" },
  ];
  const rockfallForecast = [
    { label: "Next 6 Hours", pct: 15, rec: "Continue normal operations with enhanced monitoring" },
    { label: "Next 24 Hours", pct: 35, rec: "Restrict access to Sector 7, increase sensor frequency" },
    { label: "Next 72 Hours", pct: 68, rec: "Evacuate Sector 7, implement emergency protocols" },
  ];

  const alerts = [
    {
      id: "ALT-001", title: "Crackmeter Threshold Exceeded",
      summary: "Crackmeter CM-07 in Sector 7 shows 4.2mm displacement, exceeding 3.0mm safety threshold",
      severity: "critical", status: "active", sector: "Sector 7", sensor: "Crackmeter CM-07", assignedTo: "John Smith",
      actions: ["Evacuate area", "Inspect slope", "Contact supervisor"], timestamp: "2024-01-15 14:23:15",
    },
    {
      id: "ALT-002", title: "Piezometer Pressure Rising",
      summary: "Groundwater pressure in PZ-05 showing upward trend, approaching warning levels",
      severity: "warning", status: "acknowledged", sector: "Sector 5", sensor: "Piezometer PZ-05", assignedTo: "Sarah Johnson",
      actions: ["Monitor trend", "Check drainage", "Review rainfall data"], timestamp: "2024-01-15 14:08:42",
    },
    {
      id: "ALT-003", title: "LiDAR Scan Completed",
      summary: "Scheduled LiDAR scan of all sectors completed successfully. Data processing in progress",
      severity: "info", status: "resolved", sector: "All Sectors", sensor: "LiDAR LD-01", assignedTo: "Mike Chen",
      actions: ["Process data", "Generate report", "Update risk maps"], timestamp: "2024-01-15 13:45:00",
    },
    {
      id: "ALT-004", title: "Tiltmeter Anomaly Detected",
      summary: "Unusual tilt pattern detected in TM-03, requires investigation",
      severity: "warning", status: "in-progress", sector: "Sector 3", sensor: "Tiltmeter TM-03", assignedTo: "Lisa Wong",
      actions: ["Field inspection", "Calibrate sensor", "Verify readings"], timestamp: "2024-01-15 12:15:30",
    },
  ];

  // ---------------- Tabs Content ----------------
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mine Safety Dashboard</h2>
            <p className="text-gray-500">Welcome back, Demo Admin – Sector Management Dashboard</p>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Box title="Overall Risk Level">
                <p className="text-yellow-600 font-bold text-xl">MEDIUM</p>
                <p>AI Confidence: 87%</p>
              </Box>
              <Box title="Active Sensors">
                <p className="text-green-600 font-bold text-xl">127/130</p>
                <p>3 sensors offline</p>
              </Box>
              <Box title="Active Alerts">
                <p className="text-red-600 font-bold text-xl">3</p>
                <p>1 critical, 2 warnings</p>
              </Box>
              <Box title="Personnel On-Site">
                <p className="text-purple-600 font-bold text-xl">47</p>
                <p>All tracked & safe</p>
              </Box>
              <Box title="AI Prediction">
                <p className="text-orange-600 font-bold text-xl">23%</p>
                <p>48-72 hours</p>
              </Box>
            </div>

            {/* Graph + Live Sensors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="Real-Time Risk Analysis & AI Predictions">
                <Line data={overviewLineData} options={overviewLineOptions} />
              </Box>
              <Box title="Live Sensor Readings">
                <p className="mb-2">Tiltmeter: <span className="text-green-600">15.2</span></p>
                <p>Piezometer: <span className="text-green-600">12.8</span></p>
                <p>Vibration: <span className="text-green-600">8.5</span></p>
                <p>Crackmeter: <span className="text-red-600">19.8 (warning)</span></p>
              </Box>
            </div>

            {/* Sector Risk + Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="Sector Risk Overview">
                <ul className="space-y-2">
                  <li>Sector A - Low Risk</li>
                  <li>Sector B - Medium Risk</li>
                  <li>Sector C - High Risk</li>
                  <li>Sector D - Low Risk</li>
                  <li>Workshop - Low Risk</li>
                </ul>
              </Box>
              <Box title="Live Alert Stream">
                <ul className="space-y-2">
                  <li className="text-red-600">Crackmeter exceeded in Sector C</li>
                  <li className="text-orange-600">Piezometer rising in Sector B</li>
                  <li className="text-blue-600">AI model updated with new data</li>
                </ul>
              </Box>
            </div>
          </div>
        );
      case "sensor":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sensor Network Dashboard</h2>
            <p className="text-gray-500">Real-time monitoring of all mine safety sensors</p>

            {/* Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="Sensor Readings Trend (24h)">
                <Line data={sensorLineData} options={sensorLineOptions} />
              </Box>
              <Box title="Sensor Network Coverage">
                <Bar data={sensorBarData} options={sensorBarOptions} />
              </Box>
            </div>

            {/* Candlesticks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Box title="Tiltmeter Readings (24h)">
                <div className="h-64"><Chart type="candlestick" data={makeCandleData(tiltRows)} options={candleOptions} /></div>
              </Box>
              <Box title="Piezometer Readings (24h)">
                <div className="h-64"><Chart type="candlestick" data={makeCandleData(piezoRows)} options={candleOptions} /></div>
              </Box>
              <Box title="Vibration Readings (24h)">
                <div className="h-64"><Chart type="candlestick" data={makeCandleData(vibRows)} options={candleOptions} /></div>
              </Box>
              <Box title="Crackmeter Readings (24h)">
                <div className="h-64"><Chart type="candlestick" data={makeCandleData(crackRows)} options={candleOptions} /></div>
              </Box>
            </div>

            {/* ✅ Sensor Cards with Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Box title="Tiltmeter Array">
                <p>Sector 7 - North Slope</p>
                <p>Current Value: 2.3°</p>
                <p>Threshold: 5.0°</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-green-500" style={{ width: "46%" }}></div>
                </div>
                <p className="text-green-600 mt-2">Active</p>
              </Box>

              <Box title="Piezometer Network">
                <p>Sector 5 - Groundwater</p>
                <p>Current Value: 15.2m</p>
                <p>Threshold: 18.0m</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-yellow-500" style={{ width: "84%" }}></div>
                </div>
                <p className="text-orange-600 mt-2">Warning</p>
              </Box>

              <Box title="Vibration Sensors">
                <p>Sector 3 - Blast Zone</p>
                <p>Current Value: 0.8 mm/s</p>
                <p>Threshold: 2.0 mm/s</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-green-500" style={{ width: "40%" }}></div>
                </div>
                <p className="text-green-600 mt-2">Active</p>
              </Box>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Box title="Crackmeter System">
                <p>Sector 7 - Critical Zone</p>
                <p>Current Value: 4.2 mm</p>
                <p>Threshold: 3.0 mm</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-red-500" style={{ width: "140%" }}></div>
                </div>
                <p className="text-red-600 mt-2">Critical</p>
              </Box>

              <Box title="Weather Station">
                <p>Central Platform</p>
                <p>Temperature: 12°C</p>
                <p>Humidity: 65%</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-green-500" style={{ width: "65%" }}></div>
                </div>
                <p className="text-green-600 mt-2">Normal</p>
              </Box>

              <Box title="GNSS Network">
                <p>Mine Perimeter</p>
                <p>Movement ±2.1 cm</p>
                <p>Threshold ±5.0 cm</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="h-2 rounded bg-green-500" style={{ width: "42%" }}></div>
                </div>
                <p className="text-green-600 mt-2">Active</p>
              </Box>
            </div>
          </div>
        );
      // ---------------- AI Predictive Section (MODIFIED: removed anomaly+ml boxes) ----------------
      case "ai":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">AI Predictive Analytics</h2>
            <p className="text-gray-500">Machine Learning-powered rockfall prediction system</p>

            {/* 🔹 Top Summary Cards (kept, but Model Confidence & Active Anomalies removed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="Rockfall Probability">
                <p className="text-orange-600 font-bold text-2xl">23%</p>
                <p className="text-gray-600">Next 24 hours</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "23%" }}></div>
                </div>
              </Box>

              <Box title="Predicted Event Window">
                <p className="text-blue-600 font-bold text-2xl">48-72 hours</p>
                <p className="text-gray-600">High confidence range</p>
              </Box>
            </div>

            {/* 🔹 Prediction Timeline + Risk Factor Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="24-Hour Prediction Timeline">
                <Line
                  data={{
                    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
                    datasets: [
                      {
                        label: "Predicted Probability",
                        data: [10, 20, 30, 50, 70, 90],
                        borderColor: "orange",
                        backgroundColor: "rgba(255,165,0,0.2)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </Box>

              <Box title="Risk Factor Analysis">
                <div className="space-y-4">
                  <div>
                    <p className="flex justify-between">
                      <span>Geological Stress</span>
                      <span className="text-red-600">increasing 78%</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>

                  <div>
                    <p className="flex justify-between">
                      <span>Weather Impact</span>
                      <span className="text-gray-600">stable 45%</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div>
                    <p className="flex justify-between">
                      <span>Vibration Patterns</span>
                      <span className="text-green-600">decreasing 62%</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>

                  <div>
                    <p className="flex justify-between">
                      <span>Historical Correlation</span>
                      <span className="text-red-600">increasing 89%</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                  </div>
                </div>
              </Box>
            </div>

            {/* 🔹 Removed Anomaly Detection Results & ML Model Performance as requested */}

            {/* 🔹 AI Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box title="AI Recommendations - Immediate Actions">
                <ul className="list-disc pl-5 space-y-2 text-red-600">
                  <li>Increase monitoring frequency in Sector C</li>
                  <li>Deploy additional sensors near Tilt-001</li>
                  <li>Restrict heavy equipment in high-risk zones</li>
                </ul>
              </Box>

              <Box title="Preventive Measures">
                <ul className="list-disc pl-5 space-y-2 text-blue-600">
                  <li>Schedule geological survey for next week</li>
                  <li>Review evacuation routes in affected areas</li>
                  <li>Prepare emergency response teams</li>
                </ul>
              </Box>
            </div>
          </div>
        );

      // personnel, risk, alert cases remain unchanged...
      case "personnel":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Personnel Tracking System</h2>
                <p className="text-gray-500">Real-time location and safety monitoring</p>
              </div>
              <div>
                <button className="px-4 py-2 bg-white border rounded text-gray-700 shadow-sm">Emergency Mode</button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Box title="Total Personnel">
                <p className="text-2xl font-bold text-gray-800">5</p>
                <p className="text-sm text-gray-500">Total tracked</p>
              </Box>
              <Box title="Safe">
                <p className="text-2xl font-bold text-green-600">2</p>
                <p className="text-sm text-gray-500">Safe</p>
              </Box>
              <Box title="Caution">
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-gray-500">Caution</p>
              </Box>
              <Box title="Emergency">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-gray-500">Emergency</p>
              </Box>
              <Box title="Offline">
                <p className="text-2xl font-bold text-gray-600">1</p>
                <p className="text-sm text-gray-500">Offline</p>
              </Box>
            </div>

            {/* Map + Personnel list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Personnel Map */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Live Personnel Map</h3>
                  <p className="text-sm text-gray-500">Real-time personnel locations in the mine</p>
                </div>

                <div className="relative h-96 rounded-md overflow-hidden" style={{ background: "linear-gradient(180deg,#fff7ed,#fff1f2)" }}>
                  {/* sector boxes */}
                  <div style={{ position: "absolute", left: "6%", top: "6%", width: 80, height: 60, background: "rgba(0,0,0,0.05)", borderRadius: 6 }}></div>
                  <div style={{ position: "absolute", right: "6%", top: "6%", width: 80, height: 60, background: "rgba(0,0,0,0.05)", borderRadius: 6 }}></div>
                  <div style={{ position: "absolute", left: "6%", bottom: "6%", width: 80, height: 60, background: "rgba(0,0,0,0.05)", borderRadius: 6 }}></div>
                  <div style={{ position: "absolute", right: "6%", bottom: "6%", width: 80, height: 60, background: "rgba(0,0,0,0.05)", borderRadius: 6 }}></div>

                  {/* markers */}
                  {markers.map((m) => (
                    <div key={m.id} style={{ position: "absolute", left: m.left, top: m.top, transform: "translate(-50%,-50%)" }}>
                      <div className={`w-4 h-4 rounded-full ${m.color} ring-2 ring-white`} />
                    </div>
                  ))}

                  {/* legend */}
                  <div style={{ position: "absolute", left: 12, top: 12 }}>
                    <div className="text-sm text-gray-600 font-medium">Sector A</div>
                  </div>
                </div>
              </div>

              {/* Personnel Status list */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Personnel Status</h3>
                  <p className="text-sm text-gray-500">Detailed personnel information and status</p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {personnelList.map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded p-3 border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                          {p.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{p.name}</div>
                          <div className="text-sm text-gray-500">{p.role}</div>
                          <div className="text-xs text-gray-400">{p.sector}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 text-sm rounded-full ${statusClass(p.status)}`}>{p.status}</div>
                        <div className="text-xs text-gray-400 mt-1">{p.lastSeen}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "risk":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Risk Analysis & Predictions</h2>
            <p className="text-gray-500">AI-powered rockfall risk assessment and forecasting</p>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskFactors.map((r, i) => (
                  <div key={i} className="bg-white p-4 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs text-gray-400">Risk Level</div>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded ${r.tagColor}`}>{r.tag}</div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 h-3 rounded">
                        <div className="h-3 bg-emerald-800 rounded" style={{ width: `${r.pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="font-semibold mb-3">Rockfall Probability Forecast</h3>
              <div className="space-y-4">
                {rockfallForecast.map((f, idx) => (
                  <div key={idx} className="p-3 rounded border bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{f.label}</div>
                        <div className="text-sm text-gray-400">Rockfall Probability</div>
                      </div>
                      <div className="text-sm text-gray-600">{f.pct}%</div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 h-3 rounded">
                        <div className="h-3 bg-emerald-800 rounded" style={{ width: `${f.pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Recommendation: {f.rec}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "alert":
      case "alerts":
      case "alert-management":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Alert Management</h2>
            <p className="text-gray-500">Monitor and manage all system alerts and notifications</p>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <input type="text" placeholder="Search alerts..." className="w-2/3 border rounded p-2" />
                <div className="space-x-2">
                  <button className="px-3 py-1 rounded bg-emerald-800 text-white">All</button>
                  <button className="px-3 py-1 rounded border">Critical</button>
                  <button className="px-3 py-1 rounded border">Warnings</button>
                  <button className="px-3 py-1 rounded border">Active</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {alerts.map((a) => (
                <div key={a.id} className="bg-white rounded-lg shadow border p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xl font-semibold">{a.title}</div>
                        <div className={`text-sm px-2 py-1 rounded ${a.severity === "critical" ? "bg-red-100 text-red-700" : a.severity === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{a.severity}</div>
                        <div className={`text-sm px-2 py-1 rounded ${a.status === "active" ? "bg-red-50 text-red-700" : a.status === "acknowledged" ? "bg-gray-100 text-gray-700" : "bg-green-50 text-green-700"}`}>{a.status}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">{a.summary}</div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                        <div><strong>Alert ID:</strong> {a.id}</div>
                        <div><strong>Sector:</strong> {a.sector}</div>
                        <div><strong>Sensor:</strong> {a.sensor}</div>
                        <div><strong>Assigned To:</strong> {a.assignedTo}</div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-semibold mb-1">Recommended Actions:</div>
                        <div className="flex flex-wrap gap-2">
                          {a.actions.map((act, i) => (<div key={i} className="px-3 py-1 rounded border text-sm bg-gray-50">{act}</div>))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mt-3">{a.timestamp}</div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 border rounded">Acknowledge</button>
                        <button className="px-3 py-1 border rounded">View Details</button>
                      </div>
                      <button className="px-4 py-2 bg-emerald-700 text-white rounded">Resolve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>Select a tab from sidebar</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">RockGuard</h2>
        <ul className="space-y-2">
          <li onClick={() => setActiveTab("overview")} className="cursor-pointer hover:text-yellow-400">Overview</li>
          <li onClick={() => setActiveTab("sensor")} className="cursor-pointer hover:text-yellow-400">Sensor Network</li>
          <li onClick={() => setActiveTab("ai")} className="cursor-pointer hover:text-yellow-400">AI Predictive</li>
          <li onClick={() => setActiveTab("personnel")} className="cursor-pointer hover:text-yellow-400">Personnel Tracking</li>
          <li onClick={() => setActiveTab("risk")} className="cursor-pointer hover:text-yellow-400">Risk Analysis</li>
          <li onClick={() => setActiveTab("alert")} className="cursor-pointer hover:text-yellow-400">Alert Management</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-scroll">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;