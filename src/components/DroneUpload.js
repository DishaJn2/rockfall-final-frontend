// src/components/DroneUpload.js

import React, { useState, Suspense, lazy } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ReactSpeedometer from "react-d3-speedometer";

// Lazy load 3D scene
const ThreeSlopeScene = lazy(() => import("./ThreeSlopeScene"));

export default function DroneUpload() {
  const [droneFile, setDroneFile] = useState(null);
  const [geoFile, setGeoFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const handleDroneUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDroneFile(file.name);
  };

  const handleGeoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGeoFile(file.name);
  };

  const runSimulation = () => {
    if (!droneFile && !geoFile) {
      alert("Please upload a file before running simulation!");
      return;
    }

    const result = {
      slopeAngle: Math.floor(Math.random() * 20) + 35, 
      crackProb: Math.floor(Math.random() * 30), 
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: ["Low", "Medium", "High", "Critical"][
        Math.floor(Math.random() * 4)
      ],
    };

    setAnalysis(result);

    setHistory((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        risk: result.riskScore,
      },
    ]);
  };

  const getSlopeColor = (angle) => {
    if (angle > 60) return "#dc2626";
    if (angle > 50) return "#f97316";
    if (angle > 40) return "#eab308";
    return "#22c55e";
  };

  const crackPoints = [
    { x: 1.5, y: 0.8, z: 0.2 },
    { x: -2.0, y: -1.2, z: 0.3 },
    { x: 0.5, y: 1.5, z: -0.2 },
  ];

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800">
        🚁 Drone Upload & AI Analysis
      </h2>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-dashed border-2 p-4 rounded-lg text-center">
          <h3 className="font-semibold mb-2">📷 Upload Drone Images</h3>
          <input type="file" accept="image/*" onChange={handleDroneUpload} />
          {droneFile && (
            <p className="text-sm text-gray-500 mt-2">Uploaded: {droneFile}</p>
          )}
        </div>

        <div className="border-dashed border-2 p-4 rounded-lg text-center">
          <h3 className="font-semibold mb-2">📊 Upload Geotechnical Data (CSV)</h3>
          <input type="file" accept=".csv" onChange={handleGeoUpload} />
          {geoFile && (
            <p className="text-sm text-gray-500 mt-2">Uploaded: {geoFile}</p>
          )}
        </div>
      </div>

      {/* Run Button */}
      <div className="text-center">
        <button
          onClick={runSimulation}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Run AI Simulation
        </button>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* AI Analysis */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">🧠 AI Analysis Results</h3>
            <ul className="text-sm space-y-1">
              <li>📐 Detected slope angle: <b>{analysis.slopeAngle}°</b></li>
              <li>
                🚨 Predicted risk: 
                <span
                  className={`ml-1 font-bold ${
                    analysis.riskLevel === "Low"
                      ? "text-green-600"
                      : analysis.riskLevel === "Medium"
                      ? "text-yellow-600"
                      : analysis.riskLevel === "High"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {analysis.riskLevel}
                </span>
              </li>
            </ul>
          </div>

          {/* Risk Gauge */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3">📊 Risk Meter</h3>
            <ReactSpeedometer
              value={analysis.riskScore}
              minValue={0}
              maxValue={100}
              needleColor="#111827"
              startColor="#22c55e"
              endColor="#ef4444"
              segments={4}
              customSegmentStops={[0, 40, 60, 80, 100]}
              customSegmentLabels={[
                { text: "Low", position: "INSIDE", color: "#111827" },
                { text: "Medium", position: "INSIDE", color: "#111827" },
                { text: "High", position: "INSIDE", color: "#111827" },
                { text: "Critical", position: "INSIDE", color: "#111827" },
              ]}
              height={200}
            />
          </div>

          {/* Risk Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">📈 Upload History</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3D Slope Visualization (Lazy Loaded) */}
      {analysis && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">🌍 3D Slope Visualization</h3>
          <div style={{ height: "380px" }}>
            <Suspense fallback={<p className="text-center">⏳ Loading 3D View...</p>}>
              <ThreeSlopeScene
                analysis={analysis}
                crackPoints={crackPoints}
                getSlopeColor={getSlopeColor}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
