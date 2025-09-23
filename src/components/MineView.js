import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 20.5937, lng: 78.9629 }; // India default

export default function MineView() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA0gut8gcApERPgeexXxhUU71i1L-5odno", // ✅ tumhari key
    libraries: ["places"], // Autocomplete ke liye
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (lat, lon) => {
    const res = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    setWeather(data);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setSelected({ city: place.formatted_address, lat, lng });
      map.panTo({ lat, lng });
      map.setZoom(10);

      fetchWeather(lat, lng);
    }
  };

  const getColor = (risk) => {
    if (risk === "HIGH") return "red";
    if (risk === "MEDIUM") return "orange";
    return "green";
  };

  return isLoaded ? (
    <div className="flex">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">3D Mine View & Risk Analysis</h2>

        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Enter a city..."
            className="p-2 border rounded w-80 mb-3"
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          onLoad={setMap}
        >
          {selected && (
            <Marker
              position={{ lat: selected.lat, lng: selected.lng }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: getColor(weather?.risk),
                fillOpacity: 1,
                strokeWeight: 1,
              }}
            />
          )}

          {selected && weather && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h4>{selected.city}</h4>
                <p>🌡 Temp: {weather.temp}°C</p>
                <p>🌧 Rain: {weather.rain} mm</p>
                <p>💨 Wind: {weather.wind} m/s</p>
                <p><b>Risk Level:</b> {weather.risk}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Right Panel */}
      <div className="w-96 bg-white p-4 shadow-lg">
        <h3 className="font-bold mb-2">System Status</h3>
        {weather ? (
          <ul>
            <li>Risk Level: <b>{weather.risk}</b></li>
            <li>Temperature: {weather.temp}°C</li>
            <li>Rain: {weather.rain} mm</li>
            <li>Wind: {weather.wind} m/s</li>
          </ul>
        ) : (
          <p>Select a city to view data</p>
        )}
      </div>
    </div>
  ) : <p>Loading...</p>;
}