// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MineView from "./components/MineView";
import AdminDashboard from "./components/AdminDashboard";
import SupervisorDashboard from "./components/SupervisorDashboard";

function App() {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* Field Worker Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

<Route path="/mineview" element={<MineView />} />

      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* Supervisor Dashboard */}
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
    </Routes>
  );
}

export default App;
