// src/components/AlertManagement.js
import React, { useState, useEffect } from "react";

export default function AlertManagement() {
  const [filter, setFilter] = useState("All");
  const [alertsData, setAlertsData] = useState([]);

  // ✅ Fetch alerts from backend (initial load + refresh)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/alerts");
        const data = await res.json();
        setAlertsData(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      }
    };

    fetchAlerts();
    const id = setInterval(fetchAlerts, 20000); // refresh every 20s
    return () => clearInterval(id);
  }, []);

  // ✅ Connect WebSocket for live alerts
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("✅ Connected to Alert WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // agar data ek alert object hai, list me prepend kar do
        if (data && data.id) {
          setAlertsData((prev) => [data, ...prev]);
        } else if (data.msg) {
          console.log("WS Message:", data.msg);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    ws.onerror = (err) => {
      console.error("⚠ WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  const filteredAlerts =
    filter === "All"
      ? alertsData
      : alertsData.filter(
          (a) =>
            a.severity?.toLowerCase() === filter.toLowerCase() ||
            a.status?.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Alert Management
      </h2>
      <p style={{ color: "#64748b", marginBottom: 20 }}>
        Monitor and manage all system alerts and notifications
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["All", "Critical", "Warnings", "Active"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: filter === f ? "#059669" : "#fff",
              color: filter === f ? "#fff" : "#374151",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredAlerts.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 1px 6px rgba(16,24,40,0.08)",
            }}
          >
            {/* Title + badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{a.title}</div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {a.description}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={badgeStyle(a.severity)}>{a.severity}</span>
                <span style={badgeStyle(a.status)}>{a.status}</span>
              </div>
            </div>

            {/* Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: 8,
                fontSize: 13,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              <div>
                <b>Alert ID:</b> {a.id}
              </div>
              <div>
                <b>Sector:</b> {a.sector}
              </div>
              <div>
                <b>Sensor:</b> {a.sensor}
              </div>
              <div>
                <b>Assigned To:</b> {a.assigned}
              </div>
            </div>

            {/* Recommended Actions */}
            <div style={{ marginBottom: 10 }}>
              <b>Recommended Actions:</b>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                {(a.actions || []).map((act, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 10px",
                      background: "#f3f4f6",
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnStyle("#2563eb")}>Acknowledge</button>
                <button style={btnStyle("#374151")}>View Details</button>
                <button style={btnStyle("#059669")}>Resolve</button>
              </div>
            </div>
          </div>
        ))}

        {/* Fallback when no alerts */}
        {!filteredAlerts.length && (
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            No alerts available
          </div>
        )}
      </div>
    </div>
  );
}

/* Helpers */
function badgeStyle(type) {
  const colors = {
    critical: { bg: "#fee2e2", color: "#b91c1c" },
    warning: { bg: "#fef3c7", color: "#92400e" },
    info: { bg: "#dbeafe", color: "#1d4ed8" },
    active: { bg: "#fee2e2", color: "#b91c1c" },
    acknowledged: { bg: "#e0e7ff", color: "#3730a3" },
    resolved: { bg: "#dcfce7", color: "#15803d" },
    "in-progress": { bg: "#fef9c3", color: "#ca8a04" },
  };
  return {
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: colors[type]?.bg || "#f3f4f6",
    color: colors[type]?.color || "#374151",
    textTransform: "capitalize",
  };
}

function btnStyle(color) {
  return {
    background: color,
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  };
}