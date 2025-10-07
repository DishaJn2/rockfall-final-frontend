// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MineView from "./components/MineView";          // <-- mineview component
import AdminDashboard from "./components/AdminDashboard";
import SupervisorDashboard from "./components/SupervisorDashboard";

/**
 * App routes
 *
 * Notes:
 * - I added several "alias" routes (e.g. /admin, /predictive, /sensors) so that
 *   different sidebar hrefs or old links won't break and cause the app to fall back.
 * - Root ("/") still shows Login (unchanged).
 * - Unknown paths (fallback "*") now go to /dashboard so users don't get kicked to login unexpectedly.
 * - This file DOES NOT remove or change your existing components - it only wires routes.
 */

function App() {
  return (
    <Routes>
      {/* Public / Entry */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Field Worker / Main Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Mine View (maps / 3D) - keep both /mineview and /maps */}
      <Route path="/mineview" element={<MineView />} />
      <Route path="/maps" element={<MineView />} />
      <Route path="/mineview/*" element={<MineView />} />
      <Route path="/maps/*" element={<MineView />} />

      {/* Admin (maintain original route and add a shorter alias) */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* Supervisor */}
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      <Route path="/supervisor" element={<SupervisorDashboard />} />
      <Route path="/supervisor/*" element={<SupervisorDashboard />} />

      {/* Useful aliases that might be linked from the sidebar or older code.
          They are pointed at appropriate components (Admin or Dashboard).
          If later you make separate components for these, swap them here. */}
      <Route path="/sensors" element={<Dashboard />} />
      <Route path="/predictive" element={<AdminDashboard />} />
      <Route path="/personnel" element={<AdminDashboard />} />
      <Route path="/risk" element={<AdminDashboard />} />
      <Route path="/alerts" element={<AdminDashboard />} />
      <Route path="/system" element={<AdminDashboard />} />

      {/* Fallback: send unknown urls to /dashboard (so user doesn't land on login unexpectedly) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;