import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function ScenarioComparison() {
  const [mode, setMode] = useState("scenario"); // scenario | replay
  const [scenario, setScenario] = useState("normal");
  const [rawData, setRawData] = useState(null);
  const [historicData, setHistoricData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [year, setYear] = useState("2022");
  const [month, setMonth] = useState("07");

  // ✅ Real-time risk fetch
  useEffect(() => {
    if (mode === "scenario") {
      async function fetchData() {
        try {
          const res = await axios.get(
            "http://localhost:8000/api/risk?lat=26.9124&lon=75.7873"
          );
          const d = res.data;
          setRawData({
            temperature: d.weather?.temperature_c ?? 0,
            rainfall: d.openMeteo?.precipitation_24h_mm ?? 0,
            soil: d.openMeteo?.soil_moisture_pct ?? 0,
            seismic: d.seismic?.strongest_mag ?? 0,
            humidity: d.weather?.humidity_pct ?? 0,
            wind: d.weather?.wind_speed_ms ?? 0,
          });
        } catch (err) {
          console.error("Error fetching AI risk data:", err);
        }
      }
      fetchData();
    }
  }, [mode]);

  // ✅ Historic replay fetch
  useEffect(() => {
    if (mode === "replay") {
      async function fetchReplay() {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/historic-replay?year=${year}&month=${month}`
          );
          setHistoricData(res.data.replay || []);
          setSummary(res.data.summary || null);
        } catch (err) {
          console.error("Error fetching historic replay:", err);
        }
      }
      fetchReplay();
    }
  }, [mode, year, month]);

  if (mode === "scenario" && !rawData) {
    return <p className="p-4">Loading real-time data...</p>;
  }

  // Multipliers for scenarios
  const multipliers = {
    normal: { temperature: 1, rainfall: 1, soil: 1, seismic: 1, humidity: 1, wind: 1 },
    heavyRainfall: { temperature: 1, rainfall: 1.5, soil: 1.4, seismic: 1, humidity: 1.3, wind: 1 },
    seismicShock: { temperature: 1, rainfall: 1.1, soil: 1.2, seismic: 1.6, humidity: 1, wind: 1 },
  };

  // Units
  const units = {
    temperature: "°C",
    rainfall: "mm",
    soil: "%",
    seismic: "Nm",
    humidity: "%",
    wind: "km/h",
  };

  // Adjusted Factors
  const adjustedFactors =
    rawData &&
    Object.keys(rawData).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round(rawData[key] * (multipliers[scenario]?.[key] ?? 1)),
      unit: units[key],
    }));

  // Weights
  const weights = {
    temperature: 0.1,
    rainfall: 0.25,
    soil: 0.2,
    seismic: 0.25,
    humidity: 0.1,
    wind: 0.1,
  };

  // Risk Score
  let riskScore = 0;
  if (
    rawData &&
    ["temperature", "rainfall", "soil", "seismic", "humidity", "wind"].includes(scenario)
  ) {
    const f = adjustedFactors.find((f) => f.name.toLowerCase() === scenario);
    if (f) riskScore = f.value * weights[scenario];
  } else if (rawData) {
    riskScore = adjustedFactors.reduce(
      (acc, f) => acc + f.value * weights[f.name.toLowerCase()],
      0
    );
  }

  // Projection Data (for scenario mode)
  const baseData =
    mode === "scenario"
      ? [
          { day: "Day 1", risk: riskScore * 0.8 },
          { day: "Day 2", risk: riskScore * 0.9 },
          { day: "Day 3", risk: riskScore },
          { day: "Day 4", risk: riskScore * 1.1 },
          { day: "Day 5", risk: riskScore * 0.95 },
          { day: "Day 6", risk: riskScore * 1.2 },
          { day: "Day 7", risk: riskScore * 1.05 },
        ].map((d) => ({ ...d, risk: Math.min(100, Math.round(d.risk)) }))
      : [];

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">AI Predictive Analysis</h2>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode("scenario")}
          className={`px-4 py-2 rounded ${mode === "scenario" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Scenario/Factor Analysis
        </button>
        <button
          onClick={() => setMode("replay")}
          className={`px-4 py-2 rounded ${mode === "replay" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Historic Replay Mode
        </button>
      </div>

      {mode === "scenario" && (
        <>
          {/* Scenario Selector */}
          <label className="block mb-2 font-semibold">Select Scenario/Factor:</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="border px-3 py-2 rounded mb-4"
          >
            <option value="normal">Normal Day</option>
            <option value="heavyRainfall">Heavy Rainfall</option>
            <option value="seismicShock">Seismic Shock</option>
            <option value="temperature">Temperature</option>
            <option value="rainfall">Rainfall</option>
            <option value="soil">Soil Moisture</option>
            <option value="seismic">Seismic</option>
            <option value="humidity">Humidity</option>
            <option value="wind">Wind</option>
          </select>

          {/* Factor Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {adjustedFactors.map((factor, idx) => (
              <div key={idx} className="p-3 bg-gray-100 rounded-xl shadow text-center">
                <h3 className="font-semibold">{factor.name}</h3>
                <p className="text-lg">
                  {factor.value} {factor.unit}
                </p>
              </div>
            ))}
          </div>

          {/* Graph */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={baseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day">
                <Label value="Days (Future Projection)" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label value="Risk Score (%)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-700">
            Scenario/Factor:{" "}
            <span className="font-semibold capitalize">{scenario}</span> → Predicted Risk Score:{" "}
            <span className="font-bold">{Math.round(riskScore)}</span> %
          </p>
        </>
      )}

      {mode === "replay" && (
        <>
          {/* Year & Month Selectors */}
          <div className="flex gap-4 mb-4">
            <select value={year} onChange={(e) => setYear(e.target.value)} className="border px-3 py-2 rounded">
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="border px-3 py-2 rounded">
              <option value="01">Jan</option>
              <option value="02">Feb</option>
              <option value="03">Mar</option>
              <option value="04">Apr</option>
              <option value="05">May</option>
              <option value="06">Jun</option>
              <option value="07">Jul</option>
              <option value="08">Aug</option>
              <option value="09">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
          </div>

          {/* Replay Graph */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date">
                <Label value="Date" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Risk Factors (All Metrics)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Line type="monotone" dataKey="temperature_c" stroke="#f59e0b" />
<Line type="monotone" dataKey="rainfall_mm" stroke="#3b82f6" />
<Line type="monotone" dataKey="soil_moist" stroke="#10b981" />
<Line type="monotone" dataKey="seismic_m" stroke="#ef4444" />
<Line type="monotone" dataKey="humidity_r" stroke="#6366f1" />
<Line type="monotone" dataKey="wind_speed" stroke="#06b6d4" />
<Line type="monotone" dataKey="rockfall_occurred" stroke="#000" dot={{ stroke: "red", r: 5 }} />

              {/* Rockfall Occurrence as markers */}
              <Line
                type="monotone"
                dataKey="rockfall"
                stroke="#000"
                strokeWidth={0}
                dot={{ stroke: "red", strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-gray-700">
            📊 Replay for {month}/{year}: {historicData.length} records loaded.
          </p>

          {summary && (
            <p className="mt-2 text-sm text-gray-600">
              Avg Temp: {summary.avg_temp}°C • Avg Rainfall: {summary.avg_rainfall} mm • Avg Seismic:{" "}
              {summary.avg_seismic} • Avg Soil: {summary.avg_soil}% • Rockfalls: {summary.total_rockfalls}
            </p>
          )}
        </>
      )}
    </div>
  );
}








