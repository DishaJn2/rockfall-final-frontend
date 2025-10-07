import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const API_BASE = "https://rockfall-backend.onrender.com";
 // change if needed
function slopeColor(deg) {
  if (deg < 15) return "#10b981";   // green
  if (deg < 30) return "#f59e0b";   // orange
  return "#ef4444";                 // red
}

const containerStyle = { width: "100%", height: "520px" };
const defaultCenter = { lat: 26.9124, lng: 75.7873 }; // Jaipur fallback

export default function MineView() {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [lastPrediction, setLastPrediction] = useState("");
  const [selected, setSelected] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA0gut8gcApERPgeexXxhUU71i1L-5odno",
    libraries: ["places"],
  });
  // ✅ Cities risk fetch from backend
  useEffect(() => {
  const interval = setInterval(() => {
    setLastPrediction(
      new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const fetchCitiesRisk = async () => {
      try {
        const resp = await fetch("https://rockfall-backend.onrender.com/api/cities-risk");
        const data = await resp.json();
        if (data.results) {
          const updated = data.results.map((c, i) => ({
            id: i + 1,
            lat: c.lat,
            lng: c.lon,
            label: c.city,
            risk: c.risk,
            score: c.score,
            lastUpdated: new Date(c.updated).toLocaleTimeString(),
          }));
          setMarkers(updated);
        }
      } catch (e) {
        console.error("Failed to fetch cities risk:", e);
      }
    };

    fetchCitiesRisk();
    const interval = setInterval(fetchCitiesRisk, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch telemetry for selected city
  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const resp = await fetch(
  `https://rockfall-backend.onrender.com/api/telemetry?lat=${lat}&lon=${lon}`
);
      const data = await resp.json();
      setWeather({
        temp: data.weather?.temperature_c ?? "--",
        rain: data.precipitation_24h_mm ?? "--",
        wind: data.weather?.wind_speed_ms ?? "--",
        risk: data.risk?.level ?? "UNKNOWN",
        soil_moisture_pct: data.soil?.moisture_pct ?? "--",
        humidity_pct: data.weather?.humidity_pct ?? "--",
        seismic_index_pct: data.seismic?.strongest_mag ?? "--",
      });
    } catch (e) {
      console.error("Failed to fetch telemetry:", e);
      setWeather(null);
    }
  }, []);

  // ✅ Auto-detect user location and center map
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
          map.setZoom(10);
        }
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        // fallback Jaipur
        if (map) {
          map.panTo(defaultCenter);
          map.setZoom(6);
        }
        fetchWeather(defaultCenter.lat, defaultCenter.lng);
      }
    );
  }, [map, fetchWeather]);

  const onLoadAuto = (ac) => setAutocomplete(ac);

  const onPlaceChanged = () => {
    if (!autocomplete || !map) return;
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setSelected({ city: place.formatted_address || place.name, lat, lng });
    map.panTo({ lat, lng });
    map.setZoom(10);
    fetchWeather(lat, lng);
  };

  const getColor = (risk) => {
    if (!risk) return "#6b7280";
    if (risk === "HIGH") return "#ef4444";
    if (risk === "MEDIUM") return "#f59e0b";
    if (risk === "LOW") return "#10b981";
    return "#6b7280";
  };

  const resetView = () => {
    if (!map) return;
    map.panTo(defaultCenter);
    map.setZoom(5);
    setSelected(null);
  };

  const handleMarkerClick = (m) => {
    setSelected({ city: m.label, lat: m.lat, lng: m.lng });
    fetchWeather(m.lat, m.lng);
  };

  if (!isLoaded) return <div className="p-6">Loading map…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">MineMinds</h2>

      {/* Status bar */}
      <div className="bg-blue-50 border rounded p-3 mb-4">
        <div className="font-medium text-blue-700">AI Predictive System Active</div>
        <div className="text-sm text-blue-600">
          ML models are continuously monitoring for potential rockfall events.
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">High Risk Zones</div>
          <div className="text-3xl font-bold text-red-600">
            {markers.filter((m) => m.risk === "HIGH").length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Updated: just now</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Monitoring Points</div>
          <div className="text-3xl font-bold text-yellow-600">{markers.length}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Safe Zones</div>
          <div className="text-3xl font-bold text-green-600">
            {markers.filter((m) => m.risk === "LOW").length}
          </div>
          <div className="text-xs text-gray-400 mt-1">
  Last prediction: {lastPrediction}
</div>
        </div>
      </div>

      {/* Search + Reset */}
      <div className="flex items-center gap-3 mb-3">
        <Autocomplete onLoad={onLoadAuto} onPlaceChanged={onPlaceChanged}>
          <input
            className="p-2 border rounded w-80"
            placeholder="Search a city or place..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Autocomplete>
        <button
          onClick={resetView}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reset View
        </button>
        <div className="ml-auto text-sm text-gray-600">
          Markers: <span className="font-medium">{markers.length}</span>
        </div>
      </div>

      {/* Map + Right Panel */}
      <div className="flex gap-6">
        {/* Map */}
        <div className="flex-1">
          <div className="rounded overflow-hidden shadow-sm border">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coords}
              zoom={6}
              onLoad={(m) => setMap(m)}
            >
              {markers.map((m) => (
                <Marker
                  key={m.id}
                  position={{ lat: m.lat, lng: m.lng }}
                  onClick={() => handleMarkerClick(m)}
                  icon={
                    window.google
                      ? {
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 10,
                          fillColor: getColor(m.risk),
                          fillOpacity: 1,
                          strokeWeight: 1,
                          strokeColor: "#ffffff",
                        }
                      : undefined
                  }
                />
              ))}

              {selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ minWidth: 180 }}>
                    <div className="font-semibold">{selected.city}</div>
                    <div style={{ fontSize: 13, color: "#444" }}>
                      Temp: {weather?.temp ?? "—"}°C • Rain: {weather?.rain ?? "—"} mm
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <b>Risk:</b> {weather?.risk ?? "—"}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="w-96">
          {/* Selected City Mines */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">
              Mines in {selected?.city || "—"}
            </h3>
            {selected ? (
              selected.mines && selected.mines.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {selected.mines.map((mine, i) => (
                    <li key={i} className="p-3 border rounded">
                      <div className="font-medium">{mine.name}</div>
                      <div className="text-xs text-gray-500">
                        Mineral: {mine.type} • Status: {mine.status}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">No mines found</div>
              )
            ) : (
              <div className="text-gray-500 text-sm">Select a city to view mines</div>
            )}
          </div>

          {/* Risk Color Codes */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Risk Color Codes</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 inline-block"></span>
                High Risk (Danger Zone)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block"></span>
                Medium Risk (Caution Zone)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-600 inline-block"></span>
                Low Risk (Safe Zone)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-400 inline-block"></span>
                Unknown (No Data)
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}  