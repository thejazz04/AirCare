const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// STORE LATEST SENSOR DATA

let sensorData = {
  airQuality: 0,
  temperature: 0,
  humidity: 0,
  status: "GOOD",
  recommendation: "Environment is safe",
  severity: "SAFE",
};

// RECEIVE SENSOR DATA FROM ESP8266

app.post("/sensor-data", (req, res) => {

  const {
    airQuality,
    temperature,
    humidity,
  } = req.body;

  let status = "GOOD";

  let severity = "SAFE";

  let recommendation =
    "Environment is safe";

  // AIR QUALITY CHECK

  if (airQuality > 300) {

    status = "POOR";

    severity = "DANGEROUS";

    recommendation =
      "Open windows immediately";

  }
  else if (airQuality > 200) {

    status = "MEDIUM";

    severity = "WARNING";

    recommendation =
      "Turn ON ventilation";

  }
  else if (airQuality > 100) {

    status = "MODERATE";

    severity = "MODERATE";

    recommendation =
      "Avoid crowded waiting area";
  }

  // TEMPERATURE CHECK

  if (temperature > 35) {

    recommendation =
      "Use cooling system";
  }

  // HUMIDITY CHECK

  if (humidity > 75) {

    recommendation =
      "Reduce humidity and improve airflow";
  }

  // STORE FINAL DATA

  sensorData = {
    airQuality,
    temperature,
    humidity,
    status,
    severity,
    recommendation,
  };

  console.log(
    "Received Data:",
    sensorData
  );

  // SEND LIVE UPDATE TO FRONTEND

  io.emit(
    "air-update",
    sensorData
  );

  res.json({
    success: true,
    message: "Sensor data received",
    sensorData,
  });
});

// GET CURRENT SENSOR DATA

app.get("/sensor-data", (req, res) => {

  res.json(sensorData);
});

// SOCKET CONNECTION

io.on("connection", (socket) => {

  console.log(
    "Client Connected"
  );

  // SEND CURRENT DATA IMMEDIATELY

  socket.emit(
    "air-update",
    sensorData
  );

  socket.on("disconnect", () => {

    console.log(
      "Client Disconnected"
    );
  });
});

// START SERVER

server.listen(5000, "0.0.0.0", () => {

  console.log(
    "Server Running on:"
  );

  console.log(
    "http://10.76.228.240:5000"
  );
});