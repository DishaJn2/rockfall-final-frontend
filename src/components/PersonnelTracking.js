// src/components/PersonnelTracking.js
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const StatusPill = ({ s }) => {
  const map = {
    SAFE: "bg-emerald-100 text-emerald-700",
    CAUTION: "bg-amber-100 text-amber-700",
    EMERGENCY: "bg-rose-100 text-rose-700",
    CRITICAL: "bg-rose-100 text-rose-700",
    WARNING: "bg-amber-100 text-amber-700",
    ACTIVE: "bg-blue-100 text-blue-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        map[s?.toUpperCase()] || "bg-gray-100 text-gray-700"
      }`}
    >
      {s || "—"}
    </span>
  );
};

export default function PersonnelTracking() {
  const [live, setLive] = useState({
    updated: "",
    workers: [],
    totals: { safe: 0, caution: 0, emergency: 0 },
  });
  const [trend, setTrend] = useState([]);
  const [only, setOnly] = useState("");
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);

  const fetchAll = async (o = only) => {
    setLoading(true);
    const q = new URLSearchParams({ count: String(count) });
    if (o) q.set("only", o);

    const a = await fetch(`http://localhost:8000/api/personnel/live?${q}`).then(
      (r) => r.json()
    );

    setLive(a);

    setTrend((prev) => [
      ...prev.slice(-10),
      {
        time: new Date(a.updated || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        safe: a.totals.safe,
        caution: a.totals.caution,
        emergency: a.totals.emergency,
      },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(() => fetchAll(), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [count]);

  const totals = live.totals || { safe: 0, caution: 0, emergency: 0 };

  // Sorting workers: emergency → caution → safe
  const listed = useMemo(() => {
    return [...(live.workers || [])].sort((p, q) => {
      const rank = { EMERGENCY: 0, CAUTION: 1, SAFE: 2 };
      const r = rank[p.risk] - rank[q.risk];
      return r !== 0 ? r : q.risk_score - p.risk_score;
    });
  }, [live]);

  // Alerts = sirf emergency/caution workers
  const alerts = listed
    .filter((w) => w.risk === "EMERGENCY" || w.risk === "CAUTION")
    .map((w) => ({
      title: `Status Alert: Worker ${w.id}`,
      sector: w.zone || "Unknown Zone",
      timestamp: live.updated,
      severity: w.risk === "EMERGENCY" ? "critical" : "warning",
      status: "active",
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personnel Tracking System</h2>
          <p className="text-gray-500">
            Real-time location and safety monitoring (simulated)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setOnly("");
              fetchAll("");
            }}
            className={`px-3 py-1 rounded border ${
              only ? "bg-white" : "bg-gray-900 text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setOnly("safe");
              fetchAll("safe");
            }}
            className="px-3 py-1 rounded border"
          >
            Safe
          </button>
          <button
            onClick={() => {
              setOnly("caution");
              fetchAll("caution");
            }}
            className="px-3 py-1 rounded border"
          >
            Caution
          </button>
          <button
            onClick={() => {
              setOnly("emergency");
              fetchAll("emergency");
            }}
            className="px-3 py-1 rounded border bg-rose-600 text-white"
          >
            Emergency
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-sm text-gray-500">Total Personnel</div>
          <div className="text-3xl font-bold">{(live.workers || []).length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-sm text-gray-500">Safe</div>
          <div className="text-3xl font-bold text-emerald-600">
            {totals.safe}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-sm text-gray-500">Caution</div>
          <div className="text-3xl font-bold text-amber-600">
            {totals.caution}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-sm text-gray-500">Emergency</div>
          <div className="text-3xl font-bold text-rose-600">
            {totals.emergency}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-sm text-gray-500">Last update</div>
          <div className="text-sm font-semibold">
            {live.updated
              ? new Date(live.updated).toLocaleTimeString()
              : "—"}
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500">Markers:</label>{" "}
            <select
              value={count}
              onChange={(e) => setCount(+e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {[8, 12, 16, 20, 24].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map + Status List */}
      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className="col-span-2 bg-white p-4 rounded shadow border">
          <div className="font-semibold mb-3">Live Personnel Map</div>
          <div
            className="relative border rounded bg-gray-50"
            style={{ height: 280 }}
          >
            {(live.workers || []).map((w) => (
              <div
                key={w.id}
                title={`Worker ${w.id} • ${w.risk} (${w.risk_score})`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow"
                style={{
                  left: `${w.x}%`,
                  top: `${100 - w.y}%`,
                  width: 14,
                  height: 14,
                  background:
                    w.risk === "EMERGENCY"
                      ? "#ef4444"
                      : w.risk === "CAUTION"
                      ? "#f59e0b"
                      : "#10b981",
                }}
              />
            ))}
            {loading && (
              <div className="absolute inset-0 grid place-items-center text-sm text-gray-500">
                Updating…
              </div>
            )}
          </div>
        </div>

        {/* Personnel Status List */}
        <div className="bg-white p-4 rounded shadow border">
          <div className="font-semibold mb-3">Personnel Status</div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {listed.slice(0, 12).map((w) => (
              <div
                key={w.id}
                className="border rounded p-2 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{`Worker ${w.id}`}</div>
                  <div className="text-xs text-gray-500">
                    Sector {w.zone || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{w.risk_score}</span>
                  <StatusPill s={w.risk} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Trend */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white p-4 rounded shadow border">
          <div className="font-semibold mb-3">Recent Alerts</div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {alerts.length ? (
              alerts.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded px-2 py-1 text-sm"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {a.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {a.sector} •{" "}
                      {a.timestamp
                        ? new Date(a.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <StatusPill s={a.severity} />
                    <StatusPill s={a.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No alerts yet</div>
            )}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="col-span-2 bg-white p-4 rounded shadow border">
          <div className="font-semibold mb-3">Status Trend (24h)</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="caution" stroke="#f59e0b" />
                <Line type="monotone" dataKey="emergency" stroke="#ef4444" />
                <Line type="monotone" dataKey="safe" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

