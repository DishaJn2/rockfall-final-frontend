// src/components/SupervisorDashboard.jsx
import React, { useState } from "react";

/* Recharts (overview + KPI charts) */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie as RePie,
  Cell as ReCell,
  Legend as ReLegend,
  ResponsiveContainer,
} from "recharts";

/* Chart.js + react-chartjs-2 for sensor candlesticks + doughnut */
import { Chart as ReactChart } from "react-chartjs-2";
import {
  Chart as ChartLib,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";

/* Register Chart.js components (kept same as Admin) */
ChartLib.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTooltip,
  ChartLegend,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

/* Reusable Card components (kept same) */
function Card({ children }) {
  return <div className="bg-white rounded-xl shadow p-4 border">{children}</div>;
}
function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}

/* ------------------ Dummy/Static data (kept same style) ------------------ */
const lineData = [
  { time: "00:00", risk: 40, ai: 45 },
  { time: "04:00", risk: 42, ai: 48 },
  { time: "08:00", risk: 47, ai: 53 },
  { time: "12:00", risk: 55, ai: 60 },
  { time: "16:00", risk: 67, ai: 70 },
  { time: "20:00", risk: 63, ai: 65 },
];

const barData = [
  { sensor: "Tiltmeter", value: 90 },
  { sensor: "Piezometer", value: 80 },
  { sensor: "Vibration", value: 85 },
  { sensor: "Crackmeter", value: 70 },
];

const pieData = [
  { name: "Low Risk", value: 50 },
  { name: "Medium Risk", value: 30 },
  { name: "High Risk", value: 20 },
];
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

/* ------------------ Admin-like Sensor Data (copied) ------------------ */
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
      fill: false,
    },
    {
      label: "Piezometer West",
      data: [12, 11.5, 10.8, 11.2, 12, 12.3],
      borderColor: "orange",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Vibration East",
      data: [16, 14, 12, 15, 17, 16.5],
      borderColor: "green",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Crackmeter South",
      data: [18, 18.2, 18.5, 19, 19.3, 19.1],
      borderColor: "red",
      tension: 0.4,
      fill: false,
    },
  ],
};
const sensorLineOptions = { responsive: true, plugins: { legend: { position: "bottom" } } };

const sensorBarData = {
  labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
  datasets: [
    { label: "Active Sensors", data: [10, 12, 15, 9, 13, 14, 18], backgroundColor: "black" },
    { label: "Total Capacity", data: [12, 13, 16, 12, 15, 17, 20], backgroundColor: "gray" },
  ],
};
const sensorBarOptions = { responsive: true, plugins: { legend: { position: "bottom" } } };

/* Candlestick helpers & sample rows (kept same) */
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

/* Personnel (Admin-match) */
const personnelListAdmin = [
  { id: 1, name: "John Smith", role: "Mine Supervisor", sector: "Sector A", status: "Safe", lastSeen: "2 min ago" },
  { id: 2, name: "Sarah Johnson", role: "Equipment Operator", sector: "Sector B", status: "Caution", lastSeen: "1 min ago" },
  { id: 3, name: "Mike Chen", role: "Safety Inspector", sector: "Sector C", status: "Safe", lastSeen: "30 sec ago" },
  { id: 4, name: "Lisa Rodriguez", role: "Geologist", sector: "Sector D", status: "Emergency", lastSeen: "5 min ago" },
  { id: 5, name: "Carlos Diaz", role: "Technician", sector: "Sector B", status: "Offline", lastSeen: "10 min ago" },
];

const markersAdmin = [
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

/* ------------------ Main Component ------------------ */
function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  /* PersonnelTracking component (exact Admin match) */
  const PersonnelTracking = () => (
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
        <Card><CardContent><p className="text-2xl font-bold text-gray-800">5</p><p className="text-sm text-gray-500">Total tracked</p></CardContent></Card>
        <Card><CardContent><p className="text-2xl font-bold text-green-600">2</p><p className="text-sm text-gray-500">Safe</p></CardContent></Card>
        <Card><CardContent><p className="text-2xl font-bold text-yellow-600">1</p><p className="text-sm text-gray-500">Caution</p></CardContent></Card>
        <Card><CardContent><p className="text-2xl font-bold text-red-600">1</p><p className="text-sm text-gray-500">Emergency</p></CardContent></Card>
        <Card><CardContent><p className="text-2xl font-bold text-gray-600">1</p><p className="text-sm text-gray-500">Offline</p></CardContent></Card>
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
            {markersAdmin.map((m) => (
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
            {personnelListAdmin.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded p-3 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                    {p.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
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

  /* SensorNetwork component (Admin-like sensor UI) */
  const SensorNetwork = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sensor Network Dashboard</h2>
      <p className="text-gray-500">Real-time monitoring of all mine safety sensors</p>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-2">
            <h3 className="font-semibold mb-2">Sensor Readings Trend (24h)</h3>
            <div style={{ height: 300 }}>
              {/* Using Chart (chartjs) line for admin-look */}
              <ReactChart type="line" data={sensorLineData} options={sensorLineOptions} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-2">
            <h3 className="font-semibold mb-2">Sensor Network Coverage</h3>
            <div style={{ height: 300 }}>
              <ReactChart
                type="bar"
                data={{
                  labels: sensorBarData.labels,
                  datasets: sensorBarData.datasets.map((d) => ({
                    label: d.label,
                    data: d.data,
                    backgroundColor: d.backgroundColor,
                  })),
                }}
                options={sensorBarOptions}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Candlesticks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <h4 className="font-semibold mb-2">Tiltmeter Readings (24h)</h4>
          <div className="h-64"><ReactChart type="candlestick" data={makeCandleData(tiltRows)} options={candleOptions} /></div>
        </Card>

        <Card>
          <h4 className="font-semibold mb-2">Piezometer Readings (24h)</h4>
          <div className="h-64"><ReactChart type="candlestick" data={makeCandleData(piezoRows)} options={candleOptions} /></div>
        </Card>

        <Card>
          <h4 className="font-semibold mb-2">Vibration Readings (24h)</h4>
          <div className="h-64"><ReactChart type="candlestick" data={makeCandleData(vibRows)} options={candleOptions} /></div>
        </Card>

        <Card>
          <h4 className="font-semibold mb-2">Crackmeter Readings (24h)</h4>
          <div className="h-64"><ReactChart type="candlestick" data={makeCandleData(crackRows)} options={candleOptions} /></div>
        </Card>
      </div>

      {/* Sensor Cards with Progress Bars (Admin-like) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <p className="font-semibold">Tiltmeter Array</p>
            <p>Sector 7 - North Slope</p>
            <p>Current Value: 2.3°</p>
            <p>Threshold: 5.0°</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-green-500" style={{ width: "46%" }} />
            </div>
            <p className="text-green-600 mt-2">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Piezometer Network</p>
            <p>Sector 5 - Groundwater</p>
            <p>Current Value: 15.2m</p>
            <p>Threshold: 18.0m</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-yellow-500" style={{ width: "84%" }} />
            </div>
            <p className="text-orange-600 mt-2">Warning</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Vibration Sensors</p>
            <p>Sector 3 - Blast Zone</p>
            <p>Current Value: 0.8 mm/s</p>
            <p>Threshold: 2.0 mm/s</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-green-500" style={{ width: "40%" }} />
            </div>
            <p className="text-green-600 mt-2">Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <Card>
          <CardContent>
            <p className="font-semibold">Crackmeter System</p>
            <p>Sector 7 - Critical Zone</p>
            <p>Current Value: 4.2 mm</p>
            <p>Threshold: 3.0 mm</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-red-500" style={{ width: "140%" }} />
            </div>
            <p className="text-red-600 mt-2">Critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Weather Station</p>
            <p>Central Platform</p>
            <p>Temperature: 12°C</p>
            <p>Humidity: 65%</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-green-500" style={{ width: "65%" }} />
            </div>
            <p className="text-green-600 mt-2">Normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">GNSS Network</p>
            <p>Mine Perimeter</p>
            <p>Movement ±2.1 cm</p>
            <p>Threshold ±5.0 cm</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="h-2 rounded bg-green-500" style={{ width: "42%" }} />
            </div>
            <p className="text-green-600 mt-2">Active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /* ------------------ AI Predictive (Supervisor screenshot-style) ------------------ */
  const AIPredictive = () => {
    // bar chart data for "AI-detected unusual sensor patterns" (red bars)
    const aiBarData = [
      { name: "Tilt-001", val: 3 },
      { name: "Piezo-002", val: 1 },
      { name: "Vib-003", val: 5 },
      { name: "Crack-004", val: 2 },
    ];

    // doughnut data (5 slices) but displayed as semi-donut - animated
    const doughnutData = {
      labels: ["A","B","C","D","E"],
      datasets: [
        {
          data: [20, 15, 25, 18, 22],
          backgroundColor: ["#7c3aed", "#8b5cf6", "#6d28d9", "#a78bfa", "#c7b1ff"],
          borderWidth: 0,
        },
      ],
    };
    const doughnutOptions = {
      cutout: "55%",
      rotation: -Math.PI,       // start at left to get semicircle
      circumference: Math.PI,  // show half circle
      animation: { animateRotate: true, duration: 1200, easing: "easeOutCubic" },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">AI Predictive</h2>
        <p className="text-gray-500">AI-detected sensor anomalies and model metrics</p>

        {/* Top small cards could be here if needed - skipped to match screenshot which shows charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold mb-2">AI-detected unusual sensor patterns</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="val" fill="#ef4444" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Real-time model accuracy metrics</h3>
            <div className="flex items-center justify-center h-72">
              {/* Doughnut that shows as animated semi-circle */}
              <div style={{ width: 260, height: 160 }}>
                <ReactChart type="doughnut" data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </Card>
        </div>

        {/* AI Recommendations section (two colored boxes like screenshot) */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ background: "linear-gradient(90deg,#fff1f0,#fff7ed)" }} className="p-4 rounded border">
              <h4 className="font-semibold mb-2">Immediate Actions</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2">
                <li>Increase monitoring frequency in Sector C</li>
                <li>Deploy additional sensors near Tilt-001</li>
                <li>Restrict heavy equipment in high-risk zones</li>
              </ul>
            </div>

            <div style={{ background: "linear-gradient(90deg,#f0f9ff,#eff6ff)" }} className="p-4 rounded border">
              <h4 className="font-semibold mb-2">Preventive Measures</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2">
                <li>Schedule geological survey for next week</li>
                <li>Review evacuation routes in affected areas</li>
                <li>Prepare emergency response teams</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Simple placeholders for Risk/Alert/SystemHealth (kept minimal but present) */
  const RiskAnalysis = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Risk Analysis</h2>
      <p className="text-gray-500">Risk analysis content (kept as placeholder; leave as-is)</p>
    </div>
  );
  const AlertManagement = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Alert Management</h2>
      <p className="text-gray-500">Alert management content (kept as placeholder; leave as-is)</p>
    </div>
  );
  const SystemHealth = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">System Health</h2>
      <p className="text-gray-500">System health content (kept as placeholder)</p>
    </div>
  );

  /* Render main content depending on active tab (kept Overview unchanged) */
  const renderContent = () => {
    if (activeTab === "overview") {
      return (
        <>
          {/* Header / top cards - unchanged */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Mine Safety Dashboard</h2>
            <p className="mb-2 text-gray-600">
              All Systems Active · Risk: <span className="font-semibold">MEDIUM</span> · Personnel: 517 · Alerts: 3
            </p>
            <p className="mb-6 text-gray-500">Welcome back, Demo User — Monitoring mine safety in real time</p>

            <div className="grid grid-cols-5 gap-4 mb-8">
              <Card><CardContent><p className="text-lg font-bold text-yellow-600">MEDIUM</p><p className="text-sm text-gray-500">Overall Risk Level</p></CardContent></Card>
              <Card><CardContent><p className="text-lg font-bold text-green-600">127/130</p><p className="text-sm text-gray-500">Active Sensors</p></CardContent></Card>
              <Card><CardContent><p className="text-lg font-bold text-red-600">3</p><p className="text-sm text-gray-500">Active Alerts</p></CardContent></Card>
              <Card><CardContent><p className="text-lg font-bold text-blue-600">47</p><p className="text-sm text-gray-500">Personnel On-Site</p></CardContent></Card>
              <Card><CardContent><p className="text-lg font-bold text-purple-600">23%</p><p className="text-sm text-gray-500">AI Prediction</p></CardContent></Card>
            </div>
          </section>

          {/* Real-Time Risk Chart */}
          <section className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Real-Time Risk Analysis & AI Predictions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ReTooltip />
                <ReLegend />
                <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="ai" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Live Sensor Readings */}
          <section className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent><p className="font-semibold">Tiltmeter</p><p className="text-green-600">normal 15.2</p></CardContent></Card>
            <Card><CardContent><p className="font-semibold">Piezometer</p><p className="text-green-600">normal 12.8</p></CardContent></Card>
            <Card><CardContent><p className="font-semibold">Vibration</p><p className="text-green-600">normal 8.4</p></CardContent></Card>
            <Card><CardContent><p className="font-semibold">Crackmeter</p><p className="text-red-600">warning 22.1</p></CardContent></Card>
          </section>

          {/* Performance KPIs */}
          <section className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics & KPIs</h3>
            <div className="grid grid-cols-6 gap-4 mb-6">
              <Card><CardContent><p className="font-bold text-green-600">99.7%</p><p>System Uptime</p></CardContent></Card>
              <Card><CardContent><p className="font-bold text-blue-600">1.2s</p><p>Response Time</p></CardContent></Card>
              <Card><CardContent><p className="font-bold text-indigo-600">94.8%</p><p>Accuracy Rate</p></CardContent></Card>
              <Card><CardContent><p className="font-bold text-yellow-600">2.1%</p><p>False Positives</p></CardContent></Card>
              <Card><CardContent><p className="font-bold text-red-600">23</p><p>Incidents Prevented</p></CardContent></Card>
              <Card><CardContent><p className="font-bold text-purple-600">$2.4M</p><p>Cost Savings</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sensor" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <RePie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (<ReCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </RePie>
                  <ReLegend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* System Health */}
          <section className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card><CardContent><p>CPU Usage</p><p className="text-blue-600">23%</p></CardContent></Card>
              <Card><CardContent><p>Memory Usage</p><p className="text-green-600">67%</p></CardContent></Card>
              <Card><CardContent><p>Critical Alerts</p><p className="text-red-600">3</p></CardContent></Card>
            </div>
          </section>
        </>
      );
    }

    if (activeTab === "sensor") {
      return <SensorNetwork />;
    }

    if (activeTab === "personnel") {
      return <PersonnelTracking />;
    }

    if (activeTab === "ai") {
      return <AIPredictive />;
    }

    if (activeTab === "risk") {
      return <RiskAnalysis />;
    }

    if (activeTab === "alert") {
      return <AlertManagement />;
    }

    if (activeTab === "systemHealth") {
      return <SystemHealth />;
    }

    if (activeTab === "3dview") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">3D Mine View</h2>
          <p className="text-gray-500">3D scene placeholder (kept intentionally empty as requested).</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex">
      {/* Sidebar - keep 3D Mine View (not removed) */}
      <aside className="w-64 h-screen bg-gray-100 border-r p-4">
        <h1 className="text-xl font-bold mb-6">RockGuard</h1>
        <p className="font-medium">Demo User</p>
        <p className="text-sm text-gray-500 mb-6">Supervisor</p>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "overview" ? "bg-gray-200" : ""}`}>Overview</button>

          <button onClick={() => setActiveTab("sensor")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "sensor" ? "bg-gray-200" : ""}`}>Sensor Network</button>

          <button onClick={() => setActiveTab("3dview")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "3dview" ? "bg-gray-200" : ""}`}>3D Mine View</button>

          <button onClick={() => setActiveTab("ai")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "ai" ? "bg-gray-200" : ""}`}>AI Predictive</button>

          <button onClick={() => setActiveTab("personnel")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "personnel" ? "bg-gray-200" : ""}`}>Personnel Tracking</button>

          <button onClick={() => setActiveTab("risk")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "risk" ? "bg-gray-200" : ""}`}>Risk Analysis</button>

          <button onClick={() => setActiveTab("alert")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "alert" ? "bg-gray-200" : ""}`}>Alert Management</button>

          <button onClick={() => setActiveTab("systemHealth")} className={`w-full text-left block px-3 py-2 rounded-md hover:bg-gray-200 ${activeTab === "systemHealth" ? "bg-gray-200" : ""}`}>System Health</button>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-6 bg-gray-50 space-y-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default SupervisorDashboard;

