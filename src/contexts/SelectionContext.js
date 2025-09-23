// src/contexts/SelectionContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Robust SelectionContext
 * - Exports named SelectionProvider and default export.
 * - Exports useSelection() hook for consumers.
 * - Attempts to import socket.io-client dynamically; if missing, doesn't crash.
 */

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [wsStatus, setWsStatus] = useState("idle"); // idle | connecting | connected | disconnected | disabled

  useEffect(() => {
    let mounted = true;
    let socket = null;

    async function trySocket() {
      setWsStatus("connecting");
      try {
        // dynamic import so app won't fail if socket.io-client isn't installed
        const mod = await import("socket.io-client");
        const io = mod?.io ?? mod?.default ?? mod;
        // build url: use same host as page, path '/ws' (adjust if backend differs)
        const origin = window.location.origin;
        // use ws protocol for socket url if needed (io will normalize)
        socket = io(origin, { path: "/ws" });

        socket.on("connect", () => {
          if (!mounted) return;
          setWsStatus("connected");
        });
        socket.on("disconnect", () => {
          if (!mounted) return;
          setWsStatus("disconnected");
        });
        // optional: update selection from server messages
        socket.on("selection:update", (payload) => {
          if (!mounted) return;
          if (payload && typeof payload === "object" && payload.selected != null) {
            setSelected(payload.selected);
          }
        });
      } catch (err) {
        // socket lib missing or connection failed -> mark disabled but DO NOT crash
        if (mounted) setWsStatus("disabled");
        // console.info for developer
        // eslint-disable-next-line no-console
        console.info("SelectionContext: socket.io-client not available or failed to connect.", err?.message ?? err);
      }
    }

    trySocket();

    return () => {
      mounted = false;
      if (socket && typeof socket.disconnect === "function") {
        try {
          socket.disconnect();
        } catch {}
      }
    };
  }, []);

  const value = {
    selected,
    setSelected,
    wsStatus,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

// default export (safe for imports that use default)
export default SelectionProvider;

// convenience hook
export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (ctx === null) {
    // helpful dev-time error
    throw new Error("useSelection must be used inside SelectionProvider");
  }
  return ctx;
};
