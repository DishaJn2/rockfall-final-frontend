// src/services/api.js

// ✅ Telemetry fetch
export async function getTelemetry() {
  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://rockfall-backend.onrender.com"; // 🔹 Render backend

  const resp = await fetch(`${baseUrl}/api/telemetry`);
  if (!resp.ok) throw new Error("Telemetry fetch failed");
  return resp.json();
}

// ✅ WebSocket connection
export function openTelemetryWS({ onOpen, onMessage, onError, onClose } = {}) {
  const url =
    window.location.hostname === "localhost"
      ? "ws://localhost:8000"
      : "wss://rockfall-backend.onrender.com"; // 🔹 Render WebSocket

  const ws = new WebSocket(url);

  ws.addEventListener("open", () => onOpen && onOpen());
  ws.addEventListener("message", (ev) => {
    try {
      const d = JSON.parse(ev.data);
      onMessage && onMessage(d);
    } catch (e) {}
  });
  ws.addEventListener("error", (e) => onError && onError(e));
  ws.addEventListener("close", (e) => onClose && onClose(e));

  return ws;
}

/* ---------------- Compatibility alias ----------------
   Some components (e.g. MineView.js) import `fetchTelemetry`.
   Add this alias so old imports keep working without changing many files.
------------------------------------------------------- */
export { getTelemetry as fetchTelemetry };
