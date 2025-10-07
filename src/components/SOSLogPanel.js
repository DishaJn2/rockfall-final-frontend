import React, { useEffect, useState, useRef } from "react";

export default function SOSLogPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const r = await fetch("http://localhost:8000/api/alerts/logs?limit=100");
      const j = await r.json();
      if (j.ok) setItems(j.items || []);
    } catch (e) {
      console.error("fetchLogs error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    timer.current = setInterval(fetchLogs, 5000);
    return () => clearInterval(timer.current);
  }, []);

  const clearLogs = async () => {
    await fetch("http://localhost:8000/api/alerts/logs", { method: "DELETE" });
    fetchLogs();
  };

  const testHigh = async () => {
    await fetch("http://localhost:8000/api/alerts/test?level=HIGH");
    fetchLogs();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">SOS (Simulated SMS) Log</h3>
        <div className="flex gap-2">
          <button onClick={testHigh} className="px-3 py-1 text-sm rounded bg-emerald-600 text-white">Test HIGH</button>
          <button onClick={clearLogs} className="px-3 py-1 text-sm rounded bg-gray-200">Clear</button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-2">Refreshing…</div>}

      <ul className="divide-y">
        {items.map((it, idx) => (
          <li key={idx} className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                  it.level === "HIGH" ? "bg-red-600" :
                  it.level === "MEDIUM" ? "bg-yellow-500" : "bg-gray-400"
                }`} />
                <div className="font-medium">{it.level}</div>
                <div className="text-xs text-gray-500">score {it.score}</div>
              </div>
              <div className="text-xs text-gray-500">{new Date(it.ts).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-700">
              W:{it.worker?.id || "NA"} {it.worker?.name || ""} ({it.worker?.phone || "NA"}) · {it.worker?.zone || "Zone"}
            </div>
            <div className="text-xs text-gray-500">Loc: {it.lat?.toFixed?.(2)},{it.lon?.toFixed?.(2)}</div>
          </li>
        ))}
        {!items.length && <li className="py-2 text-sm text-gray-500">No SOS yet.</li>}
      </ul>
    </div>
  );
}
