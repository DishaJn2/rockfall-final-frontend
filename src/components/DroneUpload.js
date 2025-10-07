// src/components/DroneUpload.js

import React, { useState } from "react";
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

// 3D imports
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

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

    // Dummy AI results for demo
    const result = {
      slopeAngle: Math.floor(Math.random() * 20) + 35, // 35–55°
      crackProb: Math.floor(Math.random() * 30), // 0–30%
      riskScore: Math.floor(Math.random() * 100), // 0–100%
      riskLevel: ["Low", "Medium", "High", "Critical"][
        Math.floor(Math.random() * 4)
      ],
    };

    setAnalysis(result);

    // Add to upload history
    setHistory((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        risk: result.riskScore,
      },
    ]);
  };

  // Function: slope color by angle
  const getSlopeColor = (angle) => {
    if (angle > 60) return "#dc2626"; // red-600
    if (angle > 50) return "#f97316"; // orange-500
    if (angle > 40) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  // 🔴 Example crack coordinates
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
          <h3 className="font-semibold mb-2">
            📊 Upload Geotechnical Data (CSV)
          </h3>
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
          {/* AI Analysis Insights */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">🧠 AI Analysis Results</h3>
            <ul className="text-sm space-y-1">
              <li>
                📐 Detected slope angle: <b>{analysis.slopeAngle}°</b>
              </li>
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
            <p className="text-xs text-gray-500 mt-2">
              (AI auto-generated insights. Replace with real model outputs.)
            </p>
          </div>

          {/* Risk Gauge */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3">📊Risk Meter</h3>
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

      {/* 3D Slope Visualization */}
      {analysis && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">🌍 3D Slope Visualization</h3>
          <div style={{ height: "380px" }}>
            <Canvas camera={{ position: [0, 8, 15], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} />

              {/* Ground plane */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#d1d5db" />
              </mesh>

              {/* Tilted slope */}
              <mesh
                rotation={[(-(analysis.slopeAngle - 30) * Math.PI) / 180, 0, 0]}
                position={[0, 0, 0]}
              >
                <planeGeometry args={[10, 8]} />
                <meshStandardMaterial
                  color={getSlopeColor(analysis.slopeAngle)}
                  side={2}
                  opacity={0.95}
                  transparent
                  roughness={0.4}
                  metalness={0.1}
                />
              </mesh>

              {/* 🔴 Crack markers with coordinates */}
              {crackPoints.map((p, i) => (
                <group key={i}>
                  {/* Red crack dot */}
                  <mesh position={[p.x, p.y, p.z]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial
                      color="red"
                      opacity={0.85}
                      transparent
                      emissive="red"
                      emissiveIntensity={0.6}
                    />
                  </mesh>

                  {/* Coordinates label above dot */}
                  <Text
                    position={[p.x, p.y + 0.5, p.z]}
                    fontSize={0.35}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                  >
                    ({p.x.toFixed(1)}, {p.y.toFixed(1)}, {p.z.toFixed(1)})
                  </Text>
                </group>
              ))}

              {/* Labels */}
              <Text position={[0, 5, 0]} fontSize={0.7} color="black">
                Slope Angle: {analysis.slopeAngle}°
              </Text>
              <OrbitControls />
            </Canvas>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Gray = ground, colored slope = detected slope angle, red dots = crack
            locations (coordinates displayed above each dot).
          </p>
        </div>
      )}
    </div>
  );
}