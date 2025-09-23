// src/components/Dashboard.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { getTelemetry, openTelemetryWS } from "../services/api";

export default function Dashboard() {
  // --------- LIVE STATE ---------
  const [coords, setCoords] = useState(null);              // {lat, lon}
  const [telemetry, setTelemetry] = useState(null);        // backend payload
  const [status, setStatus] = useState("Starting...");
  const [points, setPoints] = useState([]);                // chart data
  const pollRef = useRef(null);
  const wsRef = useRef(null);

  // nice clock label
  const nowLabel = () => {
    const d = new Date();
    return d.toTimeString().slice(0, 5); // HH:MM
  };

  // resolve browser location (fallback Delhi coords)
  useEffect(() => {
    let cancelled = false;

    const ok = (pos) => {
      if (cancelled) return;
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: +latitude.toFixed(4), lon: +longitude.toFixed(4) });
    };
    const fail = () => {
      if (cancelled) return;
      setCoords({ lat: 28.6139, lon: 77.2090 }); // fallback
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(ok, fail, { timeout: 6000 });
    } else {
      fail();
    }

    return () => { cancelled = true; };
  }, []);

  // start live once coords ready
  useEffect(() => {
    if (!coords) return;

    // try WS first
    tryWS();

    // fallback to polling if WS closed/error
    function tryWS() {
      // cleanup existing
      if (wsRef.current) { try { wsRef.current.close(); } catch {} wsRef.current = null; }
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }

      setStatus("Connecting (WS)...");
      wsRef.current = openTelemetryWS({
        lat: coords.lat,
        lon: coords.lon,
        radius_km: 200,
        onOpen: () => setStatus("Live (WebSocket)"),
        onError: () => {
          setStatus("WS failed — switching to polling");
          startPolling(); // fallback
        },
        onClose: () => {
          if (status.startsWith("Live (WebSocket)")) {
            setStatus("WS closed — switching to polling");
            startPolling();
          }
        },
        onMessage: (payload) => pushTelemetry(payload),
      });
    }

    function startPolling() {
      if (pollRef.current) return; // already polling
      setStatus("Live (Polling)");
      const fetchOnce = async () => {
        try {
          const data = await getTelemetry({ lat: coords.lat, lon: coords.lon, radius_km: 200 });
          pushTelemetry(data);
        } catch (e) {
          // keep quiet; UI continues
        }
      };
      fetchOnce(); // immediate
      pollRef.current = setInterval(fetchOnce, 10000); // every 10s
    }

    function pushTelemetry(payload) {
      setTelemetry(payload);
      const riskScore = Number(payload?.risk?.score ?? 0);
      const thresh = Math.max(45, Math.min(75, Math.round(riskScore + 5)));
      setPoints((prev) => {
        const next = [...prev, { time: nowLabel(), risk: +riskScore.toFixed(1), threshold: thresh }];
        // keep last 12 points
        return next.slice(-12);
      });
    }

    return () => {
      if (wsRef.current) { try { wsRef.current.close(); } catch {} wsRef.current = null; }
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  // derived UI bits
  const live = telemetry || {};
  const weather = live.weather || {};
  const seismic = live.seismic || {};
  const risk = live.risk || {};
  const rain24 = live.rain_24h_mm ?? 0;

  const riskLevel = risk.level || "—";
  const riskScore = Math.round(risk.score ?? 0);

  // progress helpers (0..100)
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const bar = useMemo(() => {
    const windPct = clamp(((weather.wind_speed_ms ?? 0) / 20) * 100, 0, 100);
    const humPct  = clamp(weather.humidity_pct ?? 0, 0, 100);
    const vibPct  = clamp(((seismic.strongest_mag ?? 0) / 6) * 100, 0, 100);
    const crackPct = clamp(((rain24 ?? 0) / 25) * 100, 0, 100);
    return { windPct, humPct, vibPct, crackPct };
  }, [weather.wind_speed_ms, weather.humidity_pct, seismic.strongest_mag, rain24]);

  // --------- ORIGINAL UI (kept) + live bindings injected ---------
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl border-b">RockGuard</div>
        <div className="p-4 text-sm text-gray-600">
          Demo User <br /> Worker
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <Link to="/dashboard">
            <button className="w-full text-left p-2 rounded bg-green-100 font-medium">
              Overview
            </button>
          </Link>
          <Link to="/mineview">
            <button className="w-full text-left p-2 rounded hover:bg-gray-100">
              3D Mine View
            </button>
          </Link>
        </nav>
        <div className="p-4 text-green-600 text-sm">● System Online</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mine Safety Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
              {status}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
              Risk: {riskLevel}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded">
              {coords ? `Live @ ${coords.lat}, ${coords.lon}` : "Locating..."}
            </span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded">
              3 Alerts
            </span>
          </div>
        </header>

        {/* Banner */}
        <div className="bg-blue-50 border p-4 rounded mb-6">
          <p className="text-blue-800 font-medium">AI Predictive System Active</p>
          <p className="text-sm text-blue-600">
            Machine learning models are continuously monitoring for potential rockfall events.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-600">Overall Risk Level</p>
            <p className="text-yellow-600 font-bold text-xl">{riskLevel}</p>
            <p className="text-xs text-gray-500">Risk Score: {riskScore}</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-600">Active Sensors</p>
            <p className="text-green-600 font-bold text-xl">127/130</p>
            <p className="text-xs text-gray-500">3 sensors offline</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-600">Active Alerts</p>
            <p className="text-red-600 font-bold text-xl">3</p>
            <p className="text-xs text-gray-500">1 critical, 2 warnings</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-600">Personnel On-Site</p>
            <p className="text-purple-600 font-bold text-xl">47</p>
            <p className="text-xs text-gray-500">All tracked & safe</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-600">AI Prediction</p>
            <p className="text-orange-600 font-bold text-xl">
              {Math.max(0, Math.min(100, riskScore))}%
            </p>
            <p className="text-xs text-gray-500">next 48–72 hours</p>
          </div>
        </div>

        {/* Graph + Sensor Readings */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="font-semibold mb-2">Real-Time Risk Analysis & AI Predictions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={points.length ? points : [
                { time: "00:00", risk: 40, threshold: 45 },
                { time: "04:00", risk: 42, threshold: 50 },
                { time: "08:00", risk: 48, threshold: 55 },
                { time: "12:00", risk: 55, threshold: 60 },
                { time: "16:00", risk: 68, threshold: 70 },
                { time: "20:00", risk: 62, threshold: 65 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#4F46E5" strokeWidth={2} dot />
                <Line type="monotone" dataKey="threshold" stroke="#F59E0B" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3 className="font-semibold mb-2">Live Sensor Readings</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="flex justify-between">
                  <span>Tiltmeter</span>
                  <span className="text-green-600">
                    {weather.wind_speed_ms != null ? `normal ${weather.wind_speed_ms.toFixed(1)} m/s` : "—"}
                  </span>
                </p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${bar.windPct}%` }} />
                </div>
              </div>
              <div>
                <p className="flex justify-between">
                  <span>Piezometer</span>
                  <span className="text-green-600">
                    {weather.humidity_pct != null ? `normal ${weather.humidity_pct}%` : "—"}
                  </span>
                </p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${bar.humPct}%` }} />
                </div>
              </div>
              <div>
                <p className="flex justify-between">
                  <span>Vibration</span>
                  <span className="text-green-600">
                    {seismic.strongest_mag != null ? `normal ${seismic.strongest_mag}` : "—"}
                  </span>
                </p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${bar.vibPct}%` }} />
                </div>
              </div>
              <div>
                <p className="flex justify-between">
                  <span>Crackmeter</span>
                  <span className="text-red-600">
                    {rain24 != null ? `warning ${rain24.toFixed(1)} mm` : "—"}
                  </span>
                </p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-red-500 h-2 rounded" style={{ width: `${bar.crackPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Risk + Alerts (unchanged static) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="font-semibold mb-2">Sector Risk Overview</h3>
            <ul className="space-y-2 text-sm">
              <li>Sector A – <span className="text-green-600">Low Risk</span></li>
              <li>Sector B – <span className="text-yellow-600">Medium Risk</span></li>
              <li>Sector C – <span className="text-red-600">High Risk</span></li>
              <li>Sector D – <span className="text-green-600">Low Risk</span></li>
              <li>Workshop – <span className="text-green-600">Low Risk</span></li>
            </ul>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3 className="font-semibold mb-2">Live Alert Stream</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">High risk detected in Sector C</p>
                  <p className="text-xs text-gray-500">2 min ago – Sector C</p>
                </div>
                <span className="bg-red-100 text-red-600 px-2 py-1 text-xs rounded">URGENT</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Piezometer pressure rising in Sector B</p>
                  <p className="text-xs text-gray-500">15 min ago – Sector B</p>
                </div>
                <button className="text-blue-600 text-xs">View</button>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">AI model updated with new geological data</p>
                  <p className="text-xs text-gray-500">1 hour ago – All Sectors</p>
                </div>
                <button className="text-blue-600 text-xs">View</button>
              </li>
            </ul>
            <div className="mt-4 p-2 bg-green-50 text-green-700 text-sm rounded">
              ● System Status: All critical systems operational
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


