// src/components/Overview.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ==========================================================
// ✅ Meter Component (unchanged)
// ==========================================================
function Meter({ label, value, percent, color = "#34D399" }) {
  const barStyle = {
    height: 8,
    background: "#e6e6e6",
    borderRadius: 6,
    overflow: "hidden",
  };
  const fillStyle = {
    height: "100%",
    width: `${Math.max(0, Math.min(100, percent))}%`,
    background: color,
    borderRadius: 6,
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          marginBottom: 6,
        }}
      >
        <div style={{ color: "#333" }}>{label}</div>
        <div style={{ color: "#666", fontSize: 13 }}>{value}</div>
      </div>
      <div style={barStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}
// ==========================================================
// ✅ AI Assistant helper
// ==========================================================
async function fetchAIResponse(query, history) {
  try {
    const res = await fetch("https://rockfall-backend.onrender.com/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, history }),
    });
    const data = await res.json();
    return data.answer;
  } catch (err) {
    console.error("AI error:", err);
    return "⚠ Unable to fetch response. Check backend.";
  }
}

// ==========================================================
// ✅ Overview Component
// ==========================================================
export default function Overview() {
  const [telemetry, setTelemetry] = useState(null);
  const [cords, setCoords] = useState({ lat: 26.9124, lon: 75.7873 }); // Jaipur fallback

  // ✅ AI Assistant state
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋, I am your Mine Safety Assistant. Ask me about risk, rainfall, or preventive measures!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // 🎙 Voice recognition
  const [recognizing, setRecognizing] = useState(false);
  let recognition = null;
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  }

  // 🗣 Text-to-speech
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  // ==========================================================
  // ✅ Stats section (unchanged, dynamic values)
  // ==========================================================
  const miniStats = [
    {
      title: "Overall Risk Level",
      value: telemetry?.risk?.level || "—",
      subtitle: `Risk Score: ${telemetry?.risk?.score ?? "—"}`,
    },
    {
      title: "AI Prediction",
      value: `${telemetry?.risk?.score ?? 0}%`,
      subtitle: "next 48–72 hours",
    },
    // { title: "Active Alerts", value: "3", subtitle: "1 critical, 2 warnings" },
  {
  title: "Last Prediction",
  value: (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        {new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
      <span style={{ fontSize: "14px", color: "#6b7280" }}>
        {new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>
  ),
},
  ];

  // ==========================================================
  // ✅ Line chart data
  // ==========================================================
  const linePoints = telemetry
    ? [
        { time: "00:00", risk: telemetry?.risk?.score / 2, threshold: 45 },
        { time: "04:00", risk: telemetry?.risk?.score / 2.2, threshold: 45 },
        { time: "08:00", risk: telemetry?.risk?.score / 1.8, threshold: 45 },
        { time: "12:00", risk: telemetry?.risk?.score / 1.5, threshold: 45 },
        { time: "16:00", risk: telemetry?.risk?.score / 1.3, threshold: 45 },
        { time: "20:00", risk: telemetry?.risk?.score / 1.4, threshold: 45 },
        { time: "24:00", risk: telemetry?.risk?.score / 2, threshold: 45 },
      ]
    : [];

  // ==========================================================
  // ✅ Fetch live location + backend data
  // ==========================================================
  useEffect(() => {
    function fetchTelemetry(lat, lon) {
     fetch(`https://rockfall-backend.onrender.com/api/telemetry?lat=${lat}&lon=${lon}`)
        .then((res) => res.json())
        .then((data) => setTelemetry(data))
        .catch((err) => console.error("Telemetry fetch error:", err));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchTelemetry(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        fetchTelemetry(cords.lat, cords.lon); // fallback
      }
    );

    const id = setInterval(() => {
      fetchTelemetry(cords.lat, cords.lon);
    }, 20000);

    return () => clearInterval(id);
  }, [cords.lat, cords.lon]);

  // ==========================================================
  // ✅ AI Assistant send handler
  // ==========================================================
  const handleSend = async () => {
    if (!query.trim()) return;
    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    const response = await fetchAIResponse(query, newMessages);
    setMessages([...newMessages, { sender: "bot", text: response }]);
    setLoading(false);
    speak(response); // voice reply
  };

  // ==========================================================
  // 🎙 Handle voice input
  // ==========================================================
  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (recognizing) {
      recognition.stop();
      setRecognizing(false);
    } else {
      recognition.start();
      setRecognizing(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setRecognizing(false);
      };
      recognition.onerror = () => setRecognizing(false);
      recognition.onend = () => setRecognizing(false);
    }
  };

  // ==========================================================
  // ✅ Render Component
  // ==========================================================
  return (
    <div style={{ padding: 24, background: "#f7fafc", minHeight: "100%" }}>
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>
            Mine Safety Dashboard
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
              alignItems: "center",
            }}
          >
            <div style={pillStyle("#d1fae5", "#065f46")}>Live (Polling)</div>
            <div style={pillStyle("#fff7ed", "#92400e")}>
              Risk: {telemetry?.risk?.level || "—"}
            </div>
            <div style={pillStyle("#f1f5f9", "#111827")}>
              Live @ {cords.lat.toFixed(4)}, {cords.lon.toFixed(4)}
            </div>
            {/* <div style={pillStyle("#fee2e2", "#b91c1c")}>3 Alerts</div> */}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#065f46" }}>
            MineMinds
          </div>
          <div style={{ color: "#111827", fontWeight: 600 }}>
            Rockfall Prediction System
          </div>
        </div>
      </header>

      {/* ===================================================== */}
      {/* Top cards */}
      {/* ===================================================== */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {miniStats.map((s, I) => (
          <div
            key={I}
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 16,
              boxShadow: "0 1px 4px rgba(16,24,40,0.05)",
            }}
          >
            <div style={{ color: "#6b7280", fontSize: 13 }}>{s.title}</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginTop: 8,
                color: "#111827",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                color: "#9ca3af",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {s.subtitle}
            </div>
          </div>
        ))}
      </section>

      {/* ===================================================== */}
      {/* Graph + meters */}
      {/* ===================================================== */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 1px 6px rgba(16,24,40,0.04)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12 }}>
            Real-Time Risk Analysis & AI Predictions
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={linePoints}
                margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{
                    value: "Time (HH:MM)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Risk Score",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ Live Readings */}
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 1px 6px rgba(16,24,40,0.04)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Live Readings</div>
          <Meter
            label="Temperature"
            value={`${telemetry?.weather?.temperature_c ?? "—"} °C`}
            percent={(telemetry?.weather?.temperature_c || 0) * 2}
            color="#60A5FA"
          />
          <Meter
            label="Wind speed"
            value={`${telemetry?.weather?.wind_speed_ms ?? "—"} m/s`}
            percent={(telemetry?.weather?.wind_speed_ms || 0) * 5}
            color="#60fa84ff"
          />
          <Meter
            label="Soil Moisture"
            value={`${telemetry?.soil?.moisture_pct ?? "—"}%`}
            percent={telemetry?.soil?.moisture_pct || 0}
            color="#34d3a1ff"
          />
          <Meter
            label="Humidity"
            value={`${telemetry?.weather?.humidity_pct ?? "—"}%`}
            percent={telemetry?.weather?.humidity_pct || 0}
            color="#9874fdff"
          />
          <Meter
            label="Rainfall (24h)"
            value={`${telemetry?.precipitation_24h_mm ?? "—"} mm`}
            percent={(telemetry?.precipitation_24h_mm || 0) * 2}
            color="#e3f63bff"
          />
          <Meter
            label="Seismic activity"
            value={`${telemetry?.seismic?.strongest_mag ?? "—"} Nm`}
            percent={(telemetry?.seismic?.strongest_mag || 0) * 15}
            color="#F87171"
          />
        </div>
      </section>

      {/* ===================================================== */}
      {/* ✅ AI Assistant with voice features */}
      {/* ===================================================== */}
      <section
        style={{
          marginTop: 20,
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          boxShadow: "0 1px 6px rgba(16,24,40,0.05)",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
          🤖 AI Assistant
        </h2>

        <div
          style={{
            height: 200,
            overflowY: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 10,
                textAlign: msg.sender === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: msg.sender === "user" ? "#10b981" : "#f3f4f6",
                  color: msg.sender === "user" ? "#fff" : "#111827",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div style={{ fontSize: 12, color: "#6b7280" }}>Thinking...</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question... (e.g., risk level, weather, safety tips)"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            style={{
              background: recognizing ? "#f59e0b" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {recognizing ? "Listening..." : "🎙 Speak"}
          </button>
        </div>
      </section>
    </div>
  );
}

// ==========================================================
// ✅ Pill Style
// ==========================================================
const pillStyle = (bg = "#eef2ff", color = "#3730a3") => ({
  background: bg,
  color,
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
});



