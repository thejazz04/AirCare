import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Activity,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Wifi,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const socket = io("http://localhost:5000");

function App() {
  const [data, setData] = useState([]);

  const [latest, setLatest] = useState({
    airQuality: 0,
    temperature: 0,
    humidity: 0,
    status: "SAFE",
  });

  useEffect(() => {
    socket.on("air-update", (newData) => {
      setLatest(newData);

      setData((prev) => [
        ...prev.slice(-19),
        {
          air: newData.airQuality,
          temp: newData.temperature,
          humidity: newData.humidity,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    });

    return () => socket.off("air-update");
  }, []);

  const getStatus = () => {
    const aqi = latest.airQuality;

    if (aqi <= 80) {
      return {
        label: "SAFE",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    }

    if (aqi <= 140) {
      return {
        label: "MODERATE",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    }

    return {
      label: "CRITICAL",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-slate-800">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AirCare Monitor
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Smart Environmental Health Monitoring System
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <Wifi size={18} />
              LIVE
            </div>

            <div className="text-slate-500 text-sm">
              {new Date().toLocaleDateString()} |{" "}
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* STATUS BANNER */}
        <section
          className={`rounded-3xl border ${status.border} ${status.bg} p-8 mb-8`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className={status.color} size={32} />

                <h2 className={`text-3xl font-bold ${status.color}`}>
                  Environment {status.label}
                </h2>
              </div>

              <p className="text-slate-600 mt-3 text-lg">
                Real-time air quality and environmental conditions are being
                continuously monitored.
              </p>
            </div>

            <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm mb-2">
                Current AQI Reading
              </p>

              <h1 className={`text-5xl font-black ${status.color}`}>
                {latest.airQuality}
              </h1>
            </div>
          </div>
        </section>

        {/* LIVE METRIC CARDS */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* Temperature */}
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">

    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
      <span className="text-xs text-slate-400 font-medium">
        LIVE
      </span>
    </div>

    <div className="bg-orange-100 w-fit p-3 rounded-2xl">
      <Thermometer className="text-orange-600" />
    </div>

    <p className="text-slate-500 mt-6 text-sm uppercase tracking-wide">
      Temperature
    </p>

    <div className="flex items-end gap-2 mt-2">
      <h2 className="text-6xl font-black text-slate-800 transition-all duration-300">
        {latest.temperature}
      </h2>

      <span className="text-2xl text-slate-500 mb-2">
        °C
      </span>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <p className="text-emerald-600 text-sm font-medium">
        Real-time sensor data
      </p>

      <span className="text-xs text-slate-400">
        {new Date().toLocaleTimeString()}
      </span>
    </div>

  </div>

  {/* Humidity */}
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">

    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
      <span className="text-xs text-slate-400 font-medium">
        LIVE
      </span>
    </div>

    <div className="bg-blue-100 w-fit p-3 rounded-2xl">
      <Droplets className="text-blue-600" />
    </div>

    <p className="text-slate-500 mt-6 text-sm uppercase tracking-wide">
      Humidity
    </p>

    <div className="flex items-end gap-2 mt-2">
      <h2 className="text-6xl font-black text-slate-800 transition-all duration-300">
        {latest.humidity}
      </h2>

      <span className="text-2xl text-slate-500 mb-2">
        %
      </span>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <p className="text-blue-600 text-sm font-medium">
        Moisture levels monitored
      </p>

      <span className="text-xs text-slate-400">
        {new Date().toLocaleTimeString()}
      </span>
    </div>

  </div>

  {/* Air Quality */}
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">

    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        latest.airQuality <= 80
          ? "bg-emerald-500"
          : latest.airQuality <= 140
          ? "bg-amber-500"
          : "bg-red-500"
      } animate-ping`}></div>

      <span className="text-xs text-slate-400 font-medium">
        LIVE
      </span>
    </div>

    <div className="bg-cyan-100 w-fit p-3 rounded-2xl">
      <Activity className="text-cyan-600" />
    </div>

    <p className="text-slate-500 mt-6 text-sm uppercase tracking-wide">
      Air Quality Index
    </p>

    <div className="flex items-end gap-3 mt-2">

      <h2 className={`text-6xl font-black transition-all duration-300 ${
        latest.airQuality <= 80
          ? "text-emerald-600"
          : latest.airQuality <= 140
          ? "text-amber-500"
          : "text-red-500"
      }`}>
        {latest.airQuality}
      </h2>

      <span className={`mb-3 px-3 py-1 rounded-full text-xs font-semibold ${
        latest.airQuality <= 80
          ? "bg-emerald-100 text-emerald-700"
          : latest.airQuality <= 140
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700"
      }`}>
        {status.label}
      </span>

    </div>

    <div className="mt-6 flex items-center justify-between">

      <p className="text-cyan-600 text-sm font-medium">
        Environmental health tracking
      </p>

      <span className="text-xs text-slate-400">
        {new Date().toLocaleTimeString()}
      </span>

    </div>

  </div>

</section>

        {/* CHART + ALERTS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* MAIN CHART */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Environmental Trends
                </h2>

                <p className="text-slate-500 mt-1">
                  Real-time monitoring analytics
                </p>
              </div>

              <div className="text-sm text-slate-400">
                Last 20 readings
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="air" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="hum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="time"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />

                <YAxis
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="air"
                  stroke="#06B6D4"
                  fillOpacity={1}
                  fill="url(#air)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#F97316"
                  fillOpacity={1}
                  fill="url(#temp)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#2563EB"
                  fillOpacity={1}
                  fill="url(#hum)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ALERTS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-amber-500" />

              <h2 className="text-2xl font-bold">
                System Alerts
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-4">
                <p className="text-emerald-700 font-semibold">
                  Air Quality Stable
                </p>

                <p className="text-sm text-emerald-600 mt-1">
                  Environment currently within safe thresholds.
                </p>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-2xl p-4">
                <p className="text-blue-700 font-semibold">
                  Humidity Monitoring Active
                </p>

                <p className="text-sm text-blue-600 mt-1">
                  Continuous moisture tracking enabled.
                </p>
              </div>

              {latest.airQuality > 140 && (
                <div className="border border-red-200 bg-red-50 rounded-2xl p-4">
                  <p className="text-red-700 font-semibold">
                    Critical AQI Detected
                  </p>

                  <p className="text-sm text-red-600 mt-1">
                    Unsafe air quality levels detected.
                  </p>
                </div>
              )}
            </div>

            {/* AQI SCALE */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 mb-4">
                AQI SCALE
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">SAFE</span>
                  </div>

                  <span className="text-sm text-slate-500">
                    0 - 80
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">MODERATE</span>
                  </div>

                  <span className="text-sm text-slate-500">
                    81 - 140
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">CRITICAL</span>
                  </div>

                  <span className="text-sm text-slate-500">
                    141+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE LOGS */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Monitoring Logs
              </h2>

              <p className="text-slate-500 mt-1">
                Live environmental activity records
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Updated in real-time
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-4 text-slate-500 font-medium">Status</th>
                  <th className="py-4 text-slate-500 font-medium">AQI</th>
                  <th className="py-4 text-slate-500 font-medium">
                    Temperature
                  </th>
                  <th className="py-4 text-slate-500 font-medium">
                    Humidity
                  </th>
                  <th className="py-4 text-slate-500 font-medium">Time</th>
                </tr>
              </thead>

              <tbody>
                {data
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    let rowStatus = "SAFE";
                    let rowColor = "bg-emerald-500";

                    if (item.air > 80 && item.air <= 140) {
                      rowStatus = "MODERATE";
                      rowColor = "bg-amber-500";
                    }

                    if (item.air > 140) {
                      rowStatus = "CRITICAL";
                      rowColor = "bg-red-500";
                    }

                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${rowColor}`}
                            ></div>

                            <span className="font-medium">
                              {rowStatus}
                            </span>
                          </div>
                        </td>

                        <td className="py-5 font-semibold">
                          {item.air}
                        </td>

                        <td className="py-5">
                          {item.temp}°C
                        </td>

                        <td className="py-5">
                          {item.humidity}%
                        </td>

                        <td className="py-5 text-slate-500">
                          {item.time}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;