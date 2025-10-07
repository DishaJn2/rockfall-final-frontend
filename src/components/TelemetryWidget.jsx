// TelemetryWidget.jsx (SSE + fallback polling)
import React, { useEffect, useState } from "react";

export default function TelemetryWidget({ lat = 26.8829, lon = 75.7957 }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);
  const sseUrl = `/sse/telemetry?lat=${lat}&lon=${lon}`;

  useEffect(() => {
    let es;
    // try EventSource (SSE)
    try {
      es = new EventSource(sseUrl);
    } catch (e) {
      es = null;
    }

    let pollId = null;

    const fetchOnce = async () => {
      try {
        const r = await fetch(`/api/telemetry?lat=${lat}&lon=${lon}`);
        if (!r.ok) throw new Error("fetch failed");
        const j = await r.json();
        setD(j);
        setErr(null);
      } catch (e) {
        setErr(e.message);
      }
    };

    if (es && es.addEventListener) {
      es.onmessage = (ev) => {
        try {
          const j = JSON.parse(ev.data);
          setD(j);
          setErr(null);
        } catch (e) {
          // ignore parse errors
        }
      };
      es.onerror = (e) => {
        // fallback to polling if SSE errors
        console.warn("SSE error, falling back to polling", e);
        setErr("SSE connection failed — using polling");
        try { es.close(); } catch {}
        pollId = setInterval(fetchOnce, 15*1000);
        fetchOnce();
      };
    } else {
      // no SSE support -> polling
      pollId = setInterval(fetchOnce, 15*1000);
      fetchOnce();
    }

    return () => {
      try { if (es) es.close(); } catch {}
      if (pollId) clearInterval(pollId);
    };
  }, [sseUrl, lat, lon]);

  if (err && !d) return <div className="p-4 bg-red-50 text-red-700 rounded">Error: {err}</div>;
  if (!d) return <div className="p-4 bg-gray-50 rounded">Loading telemetry…</div>;

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h4 className="font-semibold">Live Readings</h4>
      <div className="text-sm">Temperature: <strong>{d.temp ?? "—"}°C</strong></div>
      <div className="text-sm">Wind speed: <strong>{d.wind ?? "—"} m/s</strong></div>
      <div className="text-sm">Humidity: <strong>{d.humidity ?? "—"}%</strong></div>
      <div className="text-sm">Soil moisture: <strong>{d.soil != null ? Math.round(d.soil*100) + "%" : "—"}</strong></div>
      <div className="text-sm">Rain (24h): <strong>{d.rain24 ?? "—"} mm</strong></div>
      <div className="text-sm">Seismic: <strong>{d.maxMag ?? 0} M</strong> ({d.quakeCount ?? 0})</div>

      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="text-xs text-gray-600">Computed risk score</div>
        <div className="text-xl font-bold">{d.riskScore ?? "—"}%</div>
      </div>

      <div className="text-xs text-gray-400">Updated: {d.timestamp ? new Date(d.timestamp).toLocaleString() : "—"}</div>
    </div>
  );
}
