// src/services/api.js  — CRA version
import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000")
  .replace(/\/+$/, ""); // strip trailing slash

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// ---- REST: realtime snapshot ----
export async function getTelemetry({ lat, lon, radius_km = 200 }) {
  const q = new URLSearchParams({ lat, lon, radius_km }).toString();
  const { data } = await api.get(`/api/telemetry?${q}`);
  return data;
}

// ---- WebSocket (optional) ----
// backend agar /ws push karta hai to yeh use hoga; warna Dashboard polling fallback karega
export function openTelemetryWS({ lat, lon, radius_km = 200, onMessage, onOpen, onError, onClose }) {
  const base = (process.env.REACT_APP_WS_URL || "ws://127.0.0.1:8000/ws").replace(/\/+$/, "");
  const url = `${base}?${new URLSearchParams({ lat, lon, radius_km }).toString()}`;

  const ws = new WebSocket(url);
  ws.onopen = () => onOpen && onOpen();
  ws.onerror = (e) => onError && onError(e);
  ws.onclose = () => onClose && onClose();
  ws.onmessage = (evt) => {
    try {
      const payload = JSON.parse(evt.data);
      onMessage && onMessage(payload);
    } catch (e) {
      // ignore bad frame
    }
  };
  return ws;
}



