# AirCare Monitor - Smart Environmental Health Monitoring System

An end-to-end IoT and real-time environmental monitoring platform that tracks indoor air quality, ambient temperature, and humidity levels. Equipped with an Express & Socket.IO backend and a modern React dashboard, it processes real-time telemetry from IoT microcontrollers (e.g., ESP8266 / ESP32) and visualizes actionable health insights.

---

## Features

- ** Real-Time Data Streaming**: Instant updates powered by WebSockets (Socket.IO) whenever new sensor telemetry is received.
- ** Interactive Analytics & Trends**: Dynamic area charts (powered by Recharts) depicting the last 20 readings for Air Quality Index (AQI), Temperature (°C), and Humidity (%).
- ** Intelligent Health Alerts & Recommendations**: Automatic classification of environmental health status (`SAFE`, `MODERATE`, `CRITICAL` / `POOR`) with context-aware recommendations (e.g., ventilation triggers, cooling alerts).
- ** Live Telemetry Log**: Chronological records of recent sensor readings, complete with timestamps and color-coded status badges.
- ** Clean, Modern Dashboard**: Responsive UI crafted with React 19, Tailwind CSS v4, and Lucide React icons.
- ** Hardware-Agnostic Ingestion**: Simple HTTP REST endpoint (`POST /sensor-data`) compatible with ESP8266, ESP32, Arduino WiFi, Raspberry Pi, or simulated telemetry scripts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **WebSocket Client**: [Socket.IO Client](https://socket.io/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-Time Engine**: [Socket.IO](https://socket.io/)
- **CORS Support**: `cors` middleware

### Hardware / IoT (Supported)
- **Microcontrollers**: ESP8266 (NodeMCU / Wemos D1 Mini), ESP32, Arduino WiFi
- **Sensors**: MQ-135 / MQ-2 (Air Quality / Gas), DHT11 / DHT22 (Temperature & Humidity)

---

## 📐 System Architecture

```text
  +--------------------------------+
  |  IoT Node (ESP8266 / ESP32)    |
  |  - MQ-135 (Air Quality Sensor) |
  |  - DHT11 / DHT22 (Temp & Hum)  |
  +---------------+----------------+
                  |
                  | HTTP POST (/sensor-data)
                  v
  +--------------------------------+
  |         Node.js Backend        |
  |  - Express REST API (:5000)    |
  |  - Threshold & Health Analysis |
  |  - Socket.IO Server            |
  +---------------+----------------+
                  |
                  | WebSocket (air-update event)
                  v
  +--------------------------------+
  |        React + Vite Frontend   |
  |  - Real-time Gauge & Metrics   |
  |  - Trend Charts & Live Logs    |
  |  - Contextual Advisory Alerts  |
  +--------------------------------+
```

---

## 📂 Project Structure

```text
air-quality-monitor/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js            # Express server, Socket.IO setup, and alert thresholds
├── frontend/
│   ├── package.json
│   ├── vite.config.js       # Vite build configuration
│   ├── index.html
│   └── src/
│       ├── App.jsx          # Main dashboard view, charts, and live socket listener
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── .gitignore
└── README.md
```

---

## 🚦 AQI Thresholds & Advisory Matrix

| AQI Range | Classification | Status Badge | Recommended Action |
| :--- | :--- | :--- | :--- |
| **0 – 80** | Good / Safe | 🟢 `SAFE` | Environment is safe. |
| **81 – 140** | Moderate | 🟡 `MODERATE` | Avoid crowded areas; monitor ventilation. |
| **141 – 200** | Unhealthy | 🟠 `WARNING` | Turn ON ventilation and air filtration. |
| **201+** | Hazardous / Critical | 🔴 `DANGEROUS` | Open windows immediately & evacuate area. |

*Additional environmental checks trigger cooling recommendations if Temperature > 35°C and dehumidification advice if Humidity > 75%.*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (bundled with Node.js)

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   The backend server will start on port `5000` (e.g., `http://localhost:5000`).

---

### 2. Frontend Setup

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser to view the live dashboard.

---

## 📡 API Reference

### Receive Sensor Telemetry
- **Endpoint**: `POST /sensor-data`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "airQuality": 65,
    "temperature": 27.5,
    "humidity": 55.0
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Sensor data received",
    "sensorData": {
      "airQuality": 65,
      "temperature": 27.5,
      "humidity": 55.0,
      "status": "GOOD",
      "severity": "SAFE",
      "recommendation": "Environment is safe"
    }
  }
  ```

### Get Latest Telemetry
- **Endpoint**: `GET /sensor-data`
- **Response**: Returns the latest `sensorData` object.

### WebSocket Events
- **`air-update`**: Emitted to all connected clients upon client connection and whenever new sensor data is posted.

---

## 🤖 ESP8266 / IoT Quick Code Snippet

To send readings from an ESP8266 microcontroller over WiFi:

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://<YOUR_SERVER_IP>:5000/sensor-data";

void sendSensorData(int aqi, float temp, float hum) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"airQuality\":" + String(aqi) +
                     ",\"temperature\":" + String(temp) +
                     ",\"humidity\":" + String(hum) + "}";

    int httpResponseCode = http.POST(payload);
    http.end();
  }
}
```

---

## 👤 Author

- GitHub: [@thejazz04](https://github.com/thejazz04)

---

## 📄 License

This project is licensed under the ISC License.
