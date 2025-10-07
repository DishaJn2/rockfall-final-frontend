// src/components/FieldWorkerDashboard.js

import React, { useState, useMemo } from "react";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import { Link } from "react-router-dom";



/**

 * Simple Field Worker dashboard that combines Overview, Sensors, AI, Personnel, Risk, Alerts

 * Minimal dependencies (uses recharts which you already have). Pure client-side placeholder UI.

 * This is standalone and won't remove any old files.

 */



const TopStat = ({ title, value, subtitle }) => (

  <div className="bg-white p-4 shadow rounded text-center">

    <p className="text-gray-600">{title}</p>

    <p className="font-bold text-xl my-2">{value}</p>

    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

  </div>

);



const DummyLine = ({ data }) => (

  <ResponsiveContainer width="100%" height={220}>

    <LineChart data={data}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="time" />

      <YAxis />

      <Tooltip />

      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot />

    </LineChart>

  </ResponsiveContainer>

);



export default function FieldWorkerDashboard() {

  const [tab, setTab] = useState("overview");



  // Dummy data (can be replaced by backend telemetry easily)

  const now = new Date();

  const chartData = useMemo(() => {

    // generate last 8 points

    return Array.from({ length: 8 }).map((_, I) => {

      const t = new Date(now.getTime() - (7 - I) * 60 * 60 * 1000);

      return { time: t.toTimeString().slice(0,5), value: Math.round(30 + Math.sin(I/2)*15 + Math.random()*6) };

    });

  }, [now]);



  // simple "meters" values (placeholders)

  const weather = { temp: 22.3, wind: 3.6, humidity: 68 };

  const soil = { moisture: 44 };

  const river = { flow: 120.5 }; // m3/s

  const seismic = { mag: 1.2 };



  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar (keeps same width as existing sidebar) */}

      <aside className="w-64 bg-white shadow-md flex flex-col">

        <div className="p-6">

          <div className="text-2xl font-extrabold text-green-700">MineSafety Dashboard</div>

          <div className="text-sm text-gray-500 mt-1">Field Worker View</div>

        </div>



        <nav className="flex-1 px-3 space-y-1">

          <button onClick={() => setTab("overview")} className={`w-full text-left px-3 py-2 rounded ${tab==="overview" ? "bg-green-100" : "hover:bg-gray-100"}`}>Overview</button>

          <button onClick={() => setTab("sensors")} className={`w-full text-left px-3 py-2 rounded ${tab==="sensors" ? "bg-green-100" : "hover:bg-gray-100"}`}>Sensor Network</button>

          <button onClick={() => setTab("ai")} className={`w-full text-left px-3 py-2 rounded ${tab==="ai" ? "bg-green-100" : "hover:bg-gray-100"}`}>AI Predictive</button>

          <button onClick={() => setTab("personnel")} className={`w-full text-left px-3 py-2 rounded ${tab==="personnel" ? "bg-green-100" : "hover:bg-gray-100"}`}>Personnel</button>

          <button onClick={() => setTab("risk")} className={`w-full text-left px-3 py-2 rounded ${tab==="risk" ? "bg-green-100" : "hover:bg-gray-100"}`}>Risk Analysis</button>

          <button onClick={() => setTab("alerts")} className={`w-full text-left px-3 py-2 rounded ${tab==="alerts" ? "bg-green-100" : "hover:bg-gray-100"}`}>Alerts</button>

        </nav>



        <div className="p-4 text-xs text-gray-500 border-t">Version 1.0 • RockGuard</div>

      </aside>



      {/* Main */}

      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header row as requested: left big "MineMinds" + "Rockfall Prediction System" */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <div className="text-3xl font-extrabold text-indigo-700">MineMinds</div>

            <div className="text-sm text-gray-600">Rockfall Prediction System</div>

          </div>



          <div className="text-right">

            <div className="text-sm text-gray-500">Live @ {navigator.geolocation ? "browser location" : "unknown"}</div>

            <div className="mt-1 text-xs text-gray-400">Status: ● System Online</div>

          </div>

        </div>



        {/* Tabs content */}

        {tab === "overview" && (

          <>

            {/* Top stats: Overall Risk Level, AI Prediction, Active Alerts, Last Prediction */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

              <TopStat title="Overall Risk Level" value="MEDIUM" subtitle="Score: 54" />

              <TopStat title="AI Prediction" value="24%" subtitle="48–72 hours" />

              <TopStat title="Active Alerts" value="3" subtitle="1 critical, 2 warnings" />

              <TopStat title="Last Prediction" value="2025-09-21 14:00" subtitle="Model v1.2" />

            </div>



            {/* Main area: graph (left) + meters (right) */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="md:col-span-2 bg-white p-4 rounded shadow">

                <h3 className="font-semibold mb-2">Real-Time Risk Analysis</h3>

                <DummyLine data={chartData} />

                <p className="text-sm text-gray-500 mt-2">Live telemetry from sensors (placeholder). Will update from backend when connected.</p>

              </div>



              <div className="bg-white p-4 rounded shadow space-y-4">

                <h3 className="font-semibold">Live Meters</h3>



                <div>

                  <div className="flex justify-between text-sm mb-1"><span>Weather (Temp)</span><span>{weather.temp}°C</span></div>

                  <div className="w-full bg-gray-200 h-2 rounded"><div className="h-2 bg-blue-500 rounded" style={{ width: `${Math.min(100, (weather.temp/50)*100)}%` }} /></div>

                </div>



                <div>

                  <div className="flex justify-between text-sm mb-1"><span>Soil Moisture</span><span>{soil.moisture}%</span></div>

                  <div className="w-full bg-gray-200 h-2 rounded"><div className="h-2 bg-green-500 rounded" style={{ width: `${soil.moisture}%` }} /></div>

                </div>



                <div>

                  <div className="flex justify-between text-sm mb-1"><span>River Flow</span><span>{river.flow} m³/s</span></div>

                  <div className="w-full bg-gray-200 h-2 rounded"><div className="h-2 bg-indigo-500 rounded" style={{ width: `${Math.min(100, river.flow/5)}%` }} /></div>

                </div>



                <div>

                  <div className="flex justify-between text-sm mb-1"><span>Seismic Activity</span><span>{seismic.mag} M</span></div>

                  <div className="w-full bg-gray-200 h-2 rounded"><div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min(100, (seismic.mag/6)*100)}%` }} /></div>

                </div>

              </div>

            </div>

          </>

        )}



        {tab === "sensors" && (

          <div className="space-y-4">

            <h2 className="text-2xl font-bold">Sensor Network</h2>

            <p className="text-gray-500">Overview of all deployed sensors and quick health metrics.</p>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-white p-4 rounded shadow">

                <h3 className="font-semibold">Sensor Coverage</h3>

                <p className="text-sm text-gray-500 mt-2">127 / 130 active</p>

              </div>

              <div className="bg-white p-4 rounded shadow">

                <h3 className="font-semibold">Recent Faults</h3>

                <p className="text-sm text-gray-500 mt-2">3 sensors reported issues in last 24h</p>

              </div>

              <div className="bg-white p-4 rounded shadow">

                <h3 className="font-semibold">Network Health</h3>

                <p className="text-sm text-gray-500 mt-2">Latency: 120ms · Uptime: 99.7%</p>

              </div>

            </div>

          </div>

        )}



        {tab === "ai" && (

          <div>

            <h2 className="text-2xl font-bold">AI Predictive</h2>

            <p className="text-gray-500">Model predictions and recommended actions.</p>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

              <div className="bg-white p-4 rounded shadow">

                <h4 className="font-semibold">Rockfall Probability</h4>

                <div className="text-3xl font-bold text-orange-600 mt-2">24%</div>

                <p className="text-sm text-gray-500 mt-2">Next 48–72 hours</p>

              </div>



              <div className="bg-white p-4 rounded shadow">

                <h4 className="font-semibold">Recommendations</h4>

                <ul className="list-disc pl-5 mt-2 text-sm">

                  <li>Increase monitoring frequency in Sector C</li>

                  <li>Limit heavy machinery near north slope</li>

                  <li>Prepare evacuation protocol</li>

                </ul>

              </div>

            </div>

          </div>

        )}



        {tab === "personnel" && (

          <div>

            <h2 className="text-2xl font-bold">Personnel Tracking</h2>

            <p className="text-gray-500">Quick view of on-site workers</p>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

              <div className="bg-white p-4 rounded shadow">

                <p className="font-medium">Total on-site</p>

                <div className="text-2xl font-bold mt-2">47</div>

              </div>

              <div className="bg-white p-4 rounded shadow">

                <p className="font-medium">Safe</p>

                <div className="text-2xl font-bold mt-2 text-green-600">44</div>

              </div>

              <div className="bg-white p-4 rounded shadow">

                <p className="font-medium">Alerts</p>

                <div className="text-2xl font-bold mt-2 text-red-600">3</div>

              </div>

            </div>

          </div>

        )}



        {tab === "risk" && (

          <div>

            <h2 className="text-2xl font-bold">Risk Analysis</h2>

            <p className="text-gray-500">Breakdown of current risk factors</p>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

              <div className="bg-white p-4 rounded shadow">

                <h4 className="font-semibold">Ground Displacement</h4>

                <div className="mt-2">85% — High</div>

              </div>

              <div className="bg-white p-4 rounded shadow">

                <h4 className="font-semibold">Groundwater Pressure</h4>

                <div className="mt-2">72% — Medium</div>

              </div>

            </div>

          </div>

        )}



        {tab === "alerts" && (

          <div>

            <h2 className="text-2xl font-bold">Live Alerts</h2>

            <p className="text-gray-500">Active system alerts and recommended actions</p>



            <div className="mt-4 space-y-3">

              <div className="bg-white p-4 rounded shadow flex justify-between items-start">

                <div>

                  <div className="font-semibold">Crackmeter Threshold Exceeded (Sector 7)</div>

                  <div className="text-sm text-gray-500 mt-1">CM-07 shows 4.2mm displacement</div>

                </div>

                <div className="text-right">

                  <div className="text-xs text-red-600 font-semibold">CRITICAL</div>

                </div>

              </div>



              <div className="bg-white p-4 rounded shadow flex justify-between items-start">

                <div>

                  <div className="font-semibold">Piezometer Pressure Rising (Sector 5)</div>

                  <div className="text-sm text-gray-500 mt-1">PZ-05 trending upward</div>

                </div>

                <div className="text-right">

                  <div className="text-xs text-yellow-700 font-semibold">WARNING</div>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}