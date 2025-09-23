import React from "react";

export default function RightPanel() {
  const sensors = [
    { name: "Tiltmeter", sector: "Sector 7-North", status: "active" },
    { name: "Piezometer", sector: "Sector 5-Ground", status: "warning" },
    { name: "Vibration", sector: "Sector 3-Blast", status: "active" },
    { name: "Crackmeter", sector: "Sector 3-Critical", status: "critical" },
    { name: "Weather Station", sector: "Central Platform", status: "active" },
  ];

  const zones = [
    { label: "ZONE-A: Medium Risk", level: "medium" },
    { label: "ZONE-B: High Risk", level: "high" },
    { label: "ZONE-C: High Risk", level: "high" },
  ];

  return (
    <div className="w-80 bg-white p-4 shadow-lg rounded-lg space-y-6">
      {/* Emergency Escape System */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-2">
          Emergency Escape System
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600">
            Show Routes
          </button>
          <button className="px-3 py-1 rounded bg-green-500 text-white text-sm hover:bg-green-600">
            Navigate
          </button>
        </div>
      </div>

      {/* Sensor Network */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Sensor Network</h3>
        <ul className="space-y-3">
          {sensors.map((s, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center text-sm border-b pb-2"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-gray-500">{s.sector}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  s.status === "active"
                    ? "bg-green-100 text-green-700"
                    : s.status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Zones */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Risk Zones</h3>
        <div className="space-y-2">
          {zones.map((z, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm font-medium ${
                z.level === "high"
                  ? "bg-red-100 text-red-700"
                  : z.level === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {z.label}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Controls</h3>
        <div className="space-y-2">
          <button className="w-full bg-gray-200 rounded py-1 hover:bg-gray-300">
            Reset Camera
          </button>
          <button className="w-full bg-gray-200 rounded py-1 hover:bg-gray-300">
            Toggle Sensors
          </button>
          <button className="w-full bg-gray-200 rounded py-1 hover:bg-gray-300">
            Toggle Risk Zones
          </button>
        </div>
      </div>
    </div>
  );
}
