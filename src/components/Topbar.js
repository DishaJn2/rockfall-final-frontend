import React from "react";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-xl font-bold">Mine Safety Dashboard</h1>
      <div className="flex items-center space-x-6">
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded">
          All Systems Active
        </span>
        <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
          Risk: MEDIUM
        </span>
        <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
          3 Alerts
        </span>
        <span className="text-xs text-gray-500">
          Last update: 4:20:06 PM
        </span>
      </div>
    </div>
  );
}
