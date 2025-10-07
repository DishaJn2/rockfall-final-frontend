// src/components/Dashboard.js
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Overview from "./Overview";
import MineView from "./MineView";
import AIPredictiveContent from "./AIPredictiveContent";
import PersonnelTracking from "./PersonnelTracking";
import AlertManagement from "./AlertManagement";
import SensorNetwork from "./SensorNetwork";
import DroneUpload from "./DroneUpload";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const [telemetry, setTelemetry] = useState(null);
  const [seismic, setSeismic] = useState(null);

  // ✅ Polling REST API
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch("http://localhost:8000/api/telemetry");
        const data = await resp.json();

        setTelemetry({
          temperature: data.weather?.temperature_c ?? 0,
          wind: data.weather?.wind_speed_ms ?? 0,
          humidity: data.weather?.humidity_pct ?? 0,
          soilMoisture: data.soil?.moisture_pct ?? 35,
          rainfall: data.precipitation_24h_mm ?? 0,
        });

        setSeismic(data.seismic?.strongest_mag ?? 0);
      } catch (err) {
        console.error("Error fetching telemetry:", err);
      }
    }

    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, []);

  function handleBack() {
    navigate("/login");
  }

  // ✅ WebSocket (live updates)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.weather) {
          setTelemetry({
            temperature: data.weather?.temperature_c ?? 0,
            wind: data.weather?.wind_speed_ms ?? 0,
            humidity: data.weather?.humidity_pct ?? 0,
            soilMoisture: data.soil?.moisture_pct ?? 35,
            rainfall: data.precipitation_24h_mm ?? 0,
          });
        }
        if (data.seismic) {
          setSeismic(data.seismic?.strongest_mag ?? 0);
        }
      } catch (e) {
        console.error("WS parse error", e);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f7fafc",
        fontFamily: "Inter, ui-sans-serif, system-ui",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#081127",
          color: "#fff",
          padding: 22,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>
          RockGuard
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div onClick={() => setActiveTab("overview")} style={sidebarLinkStyle(activeTab === "overview")}>
            1. Overview
          </div>
          <div onClick={() => setActiveTab("maps")} style={sidebarLinkStyle(activeTab === "maps")}>
            2. 2D maps and risk analysis
          </div>
          <div onClick={() => setActiveTab("predictive")} style={sidebarLinkStyle(activeTab === "predictive")}>
            3. AI predictive analysis
          </div>
          <div onClick={() => setActiveTab("personnel")} style={sidebarLinkStyle(activeTab === "personnel")}>
            4. Personnel tracking
          </div>
          {/* 🔹 FIX: Tab key 'alerts' match karega */}
          <div onClick={() => setActiveTab("alerts")} style={sidebarLinkStyle(activeTab === "alerts")}>
            5. Alert management
          </div>
          <div onClick={() => setActiveTab("sensor")} style={sidebarLinkStyle(activeTab === "sensor")}>
            6. Sensor network
          </div>
          <div onClick={() => setActiveTab("drone")} style={sidebarLinkStyle(activeTab === "drone")}>
            7. Drone Upload 
          </div>
        </nav>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 22,
            fontSize: 12,
            color: "#10b981",
          }}
        >
          ● System Online
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24, boxSizing: "border-box" }}>
        {activeTab === "overview" && (
          <div>
            <button
              onClick={handleBack}
              style={{
                marginBottom: 12,
                padding: "6px 12px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
            <Overview telemetry={telemetry} seismic={seismic} />
          </div>
        )}
        {activeTab === "maps" && <MineView />}
        {activeTab === "predictive" && <AIPredictiveContent />}
        {activeTab === "personnel" && <PersonnelTracking />}
        {activeTab === "alerts" && <AlertManagement />} {/* ✅ FIXED */}
        {activeTab === "sensor" && <SensorNetwork />}
        {activeTab === "drone" && <DroneUpload />}
      </main>
    </div>
  );
}

/* helpers */
function sidebarLinkStyle(active) {
  return {
    display: "block",
    padding: "10px 12px",
    textDecoration: "none",
    color: active ? "#10b981" : "#cbd5e1",
    background: active ? "rgba(255,255,255,0.03)" : "transparent",
    borderRadius: 6,
    fontWeight: active ? 700 : 600,
    fontSize: 14,
    cursor: "pointer",
  };
}
