// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

/**
 * Lightweight Sidebar that uses Link (react-router) to avoid full page reloads.
 * Keeps visuals simple so it can't break the app.
 */

const NavItem = ({ to = "#", label, children }) => (
  <Link to={to} className="flex items-center space-x-3 p-2 rounded hover:bg-green-100" title={label}>
    <span className="w-5 h-5 flex items-center justify-center">{children}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 font-bold text-green-700 text-xl">RockGuard</div>

      <nav className="flex-1 px-3 space-y-1">
        <NavItem to="/dashboard" label="Overview">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12v7a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavItem>

        <NavItem to="/sensors" label="Sensor Network">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 11a9 9 0 0 1 9 9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 6a14 14 0 0 1 14 14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="17.5" r="1.5" />
          </svg>
        </NavItem>

        <NavItem to="/mineview" label="3D Mine View">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.27 6.96 12 12.01l8.73-5.05" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        <NavItem to="/admin" label="AI Predictive">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18v-2a3 3 0 0 1 3-3h0" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 9a5 5 0 0 1 10 0" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        <NavItem to="/personnel" label="Personnel Tracking">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M16 11a4 4 0 1 0-8 0" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        <NavItem to="/risk" label="Risk Analysis">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 12h3l2 5 3-10 2 4h6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        <NavItem to="/alerts" label="Alert Management">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        <NavItem to="/system" label="System Health">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2l7 4v6c0 5-4 9-7 10-3-1-7-5-7-10V6l7-4z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>

        {/* 🚀 New Drone Upload Section */}
        <NavItem to="/drone-upload" label="Drone Upload">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavItem>
      </nav>

      <div className="p-4 text-xs text-gray-500 border-t">Version 1.0 • RockGuard</div>
    </aside>
  );
}
// ---------------- Telemetry ----------------
let currentTelemetry = null;

async function buildTelemetry(lat = DEFAULT_COORDS.lat, lon = DEFAULT_COORDS.lon) {
  const [weather, openMeteo, seismic] = await Promise.all([
    fetchOpenWeather(lat, lon),
    fetchOpenMeteo(lat, lon),
    fetchSeismicByLocation(lat, lon, 200),
  ]);
  const risk = computeRiskScore({ weather, openMeteo, seismic });
  return {
    timestamp: nowISO(),
    lat,
    lon,
    weather,
    precipitation_24h_mm:
      openMeteo?.precipitation_24h_mm ?? weather?.rain_1h_mm ?? 0,
    soil: { moisture_pct: openMeteo?.soil_moisture_pct ?? null },
    seismic,
    risk,
    riskTimeline: generateRiskTimeline(risk.score),
  };
}

// ---------------- Personnel + Alerts Integration ----------------
let personnelLive = [
  { id: 1, name: "Amit Sharma", role: "Engineer", location: "Zone A", status: "Active" },
  { id: 2, name: "Ravi Kumar", role: "Supervisor", location: "Zone B", status: "Active" },
];
let alertsStore = [];

// Personnel live status
app.get("/api/personnel/live", (req, res) => {
  res.json({ personnel: personnelLive });
});

// Add new personnel alert
app.post("/api/personnel/alerts", (req, res) => {
  const { id, alert } = req.body;
  const person = personnelLive.find((p) => p.id === id);
  if (person) {
    alertsStore.push({
      id: alertsStore.length + 1,
      type: "PERSONNEL",
      message: `Alert for ${person.name}: ${alert}`,
      time: nowISO(),
    });
    return res.json({ ok: true });
  }
  res.status(404).json({ error: "personnel not found" });
});

// Global alerts
app.get("/api/alerts", (req, res) => {
  res.json({ alerts: alertsStore });
});

// Test SMS endpoint (simulated)
app.get("/api/test-sms", (req, res) => {
  alertsStore.push({
    id: alertsStore.length + 1,
    type: "TEST",
    message: "This is a test SMS alert from MineMinds system",
    time: nowISO(),
  });
  res.json({ ok: true, msg: "Test SMS alert stored" });
});
// ✅ Risk factors endpoint
app.get("/api/risk-factors", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || DEFAULT_COORDS.lat;
    const lon = parseFloat(req.query.lon) || DEFAULT_COORDS.lon;
    const snapshot = await buildTelemetry(lat, lon);
    const factors = [
      { factor: "Rainfall", impact: snapshot.precipitation_24h_mm || 0 },
      { factor: "Soil Moisture", impact: snapshot.soil?.moisture_pct || 0 },
      {
        factor: "Seismic Activity",
        impact: snapshot.seismic?.strongest_mag
          ? Math.round(snapshot.seismic.strongest_mag * 10)
          : 0,
      },
      {
        factor: "Wind Speed",
        impact: snapshot.weather?.wind_speed_ms
          ? Math.round(snapshot.weather.wind_speed_ms * 5)
          : 0,
      },
      {
        factor: "Temperature",
        impact: snapshot.weather?.temperature_c
          ? Math.round(snapshot.weather.temperature_c)
          : 0,
      },
    ];
    res.json({ updated: nowISO(), lat, lon, factors });
  } catch (e) {
    console.error("risk-factors error:", e.message);
    res.status(500).json({ error: "failed to fetch risk factors" });
  }
});

// ✅ NEW: Risk Trend (Last 7 Days)
app.get("/api/risk-trend", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || DEFAULT_COORDS.lat;
    const lon = parseFloat(req.query.lon) || DEFAULT_COORDS.lon;
    const snapshot = await buildTelemetry(lat, lon);
    const baseScore = snapshot?.risk?.score || 30;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const trend = days.map((d, i) => {
      const variation = (Math.random() * 0.2 - 0.1) * baseScore;
      return {
        day: d,
        risk: Math.max(0, Math.round(baseScore + variation + i * 2 - 6)),
      };
    });
    res.json({ lat, lon, trend });
  } catch (e) {
    console.error("risk-trend error:", e.message);
    res.status(500).json({ error: "failed to fetch risk trend" });
  }
});

// ✅ NEW: Cities Risk endpoint
app.get("/api/cities-risk", async (req, res) => {
  try {
    const cities = [
      { city: "Jaipur", lat: 26.9124, lon: 75.7873 },
      { city: "Mumbai", lat: 19.0760, lon: 72.8777 },
      { city: "Nagpur", lat: 21.1458, lon: 79.0882 },
      { city: "Delhi", lat: 28.7041, lon: 77.1025 },
      { city: "Kolkata", lat: 22.5726, lon: 88.3639 },
    ];
    const results = [];
    for (const c of cities) {
      const telemetry = await buildTelemetry(c.lat, c.lon);
      results.push({
        city: c.city,
        lat: c.lat,
        lon: c.lon,
        risk: telemetry.risk?.level || "UNKNOWN",
        score: telemetry.risk?.score || 0,
        updated: nowISO(),
      });
    }
    res.json({ results });
  } catch (e) {
    console.error("cities-risk error:", e.message);
    res.status(500).json({ error: "failed to fetch cities risk" });
  }
});

// ✅ NEW: Synthetic Sensor Data endpoint
app.get("/api/sensors", (req, res) => {
  const sensors = {
    tiltmeters: { sector: "Sector 7 - North Slope", current: +(Math.random() * 5).toFixed(2), threshold: 5.0, unit: "°" },
    piezometers: { sector: "Sector 5 - Groundwater", current: +(12 + Math.random() * 8).toFixed(2), threshold: 18.0, unit: "m" },
    vibrations: { sector: "Sector 3 - Blast Zone", current: +(Math.random() * 2).toFixed(2), threshold: 2.0, unit: " mm/s" },
    crackmeters: { sector: "Sector 7 - Critical Zone", current: +(Math.random() * 6).toFixed(2), threshold: 3.0, unit: " mm" },
    weather: { sector: "Central Platform", temperature: 10 + Math.floor(Math.random() * 20), humidity: 40 + Math.floor(Math.random() * 50) },
    gnss: { sector: "Mine Perimeter", current: +(Math.random() * 5).toFixed(2), threshold: 5.0, unit: " cm" },
  };
  res.json({ updated: nowISO(), sensors });
});

// ✅ NEW: Historical Events endpoint
app.get("/api/historical/events", (req, res) => {
  const file = path.join(__dirname, "..", "data", "historical", "events.csv");
  const rows = [];
  fs.createReadStream(file)
    .on("error", () => res.status(500).json({ error: "events.csv not found" }))
    .pipe(csv())
    .on("data", (r) =>
      rows.push({
        date: r.date,
        lat: +r.lat,
        lon: +r.lon,
        rain_24h_mm: +r.rain_24h_mm,
        rain_72h_mm: +r.rain_72h_mm,
        slope_deg: +r.slope_deg,
        label: +r.label,
      })
    )
    .on("end", () => res.json(rows));
});

// ✅ NEW: Case Studies endpoint
app.get("/api/historical/case-studies", (req, res) => {
  const file = path.join(__dirname, "..", "data", "historical", "case_studies.json");
  fs.readFile(file, "utf8", (err, text) => {
    if (err) return res.status(500).json({ error: "case_studies.json not found" });
    res.type("json").send(text);
  });
});

// ✅ NEW: API endpoint for frontend to call with its own coords
app.get("/api/seismic", async (req, res) => {
  const lat = parseFloat(req.query.lat) || DEFAULT_COORDS.lat;
  const lon = parseFloat(req.query.lon) || DEFAULT_COORDS.lon;

  try {
    const data = await fetchSeismicByLocation(lat, lon, 200);
    res.json({ lat, lon, data });
  } catch (e) {
    res.status(500).json({ error: "failed to fetch seismic data" });
  }
});
// ---------------- WebSocket ----------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🔗 WebSocket client connected");
  ws.send(JSON.stringify({ ok: true, msg: "Welcome WebSocket client!" }));

  ws.on("message", (message) => {
    console.log("📩 Received from client:", message.toString());
    ws.send(JSON.stringify({ echo: message.toString() }));
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });
});
// ---------------- Start Server ----------------
server.listen(PORT, () => {
  console.log(`✅ Realtime telemetry server running at http://localhost:${PORT}`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use. Please stop other process or change PORT.`);
    process.exit(1);
  } else {
    throw err;
  }
});
