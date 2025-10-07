import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function RiskAnalysis() {
  const [forecast, setForecast] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  // 🔹 Dummy data (backend se connect karna ho to API call lagana)
  useEffect(() => {
    setForecast([
      { time: "0h", risk: 12 },
      { time: "6h", risk: 22 },
      { time: "12h", risk: 36 },
      { time: "18h", risk: 55 },
      { time: "24h", risk: 68 },
    ]);

    setComparison([
      { city: "Jharkhand", risk: 62 },
      { city: "Rajasthan", risk: 28 },
      { city: "Odisha", risk: 15 },
      { city: "Goa", risk: 10 },
    ]);

    setSeasonal([
      { month: "Jan", risk: 8 },
      { month: "Apr", risk: 18 },
      { month: "Jul", risk: 65 },
      { month: "Sept", risk: 72 },
      { month: "Dec", risk: 12 },
    ]);

    setAnomalies([
      { sensor: "Rainfall Sensor", status: "20% above normal", time: "14:20" },
      { sensor: "Seismic Sensor", status: "Spike detected (3.2)", time: "14:45" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Risk Analysis & Predictions</h2>

      {/* 🛰️ Real-time anomalies */}
      <div className="bg-red-50 p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">📡 Real-Time Sensor Anomalies</h3>
        {anomalies.length > 0 ? (
          <ul className="space-y-2">
            {anomalies.map((a, i) => (
              <li key={i} className="p-2 border rounded bg-white">
                <b>{a.sensor}:</b> {a.status} <span className="text-xs text-gray-500">({a.time})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No anomalies detected</p>
        )}
      </div>

      {/* ⚠️ Early Warning Triggers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">⚠️ Early Warning Triggers</h3>
          <ul className="text-sm space-y-1">
            <li>Rainfall &gt; 50mm ✅</li>
            <li>Soil moisture &gt; 80% ❌</li>
            <li>Seismic magnitude &gt; 3.0 ✅</li>
            <li>Wind speed &gt; 15m/s ❌</li>
          </ul>
        </div>

        {/* 🧠 AI Suggestions */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">🧠 AI Suggested Actions</h3>
          <p className="text-sm">
            Restrict blasting for 12 hours, deploy drone inspection in Zone B,
            and prepare backup evacuation plan.
          </p>
        </div>
      </div>

      {/* 📊 Comparative Risk */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">📊 Comparative Risk (Mines)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="risk" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🌦️ Risk Forecast Timeline */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">🌦️ Risk Forecast Timeline (Next 24h)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📅 Seasonal Risk Pattern */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">📅 Seasonal Risk Pattern</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={seasonal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📑 Mitigation Tracker */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">📑 Risk Mitigation Tracker</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Early warnings sent</li>
          <li>❌ Drones deployed</li>
          <li>❌ Worker evacuation drills</li>
          <li>✅ Monitoring sensors calibrated</li>
        </ul>
      </div>
    </div>
  );
}

