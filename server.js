// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static("views"));

// let sensorData = [];
// const MAX_ENTRIES = 10; 
// let ledState = 0; 

// // API điều khiển LED
// app.get("/toggle-led", (req, res) => {
//     res.json({ state: ledState });
// });

// app.post("/toggle-led", (req, res) => {
//     const { state } = req.body;
//     if (state === undefined) {
//         return res.status(400).send({ success: false, message: "Thiếu trạng thái LED!" });
//     }

//     ledState = state;
//     console.log("💡 LED State: ", ledState);

//     io.emit("updateLedState", ledState);
//     res.send({ success: true, state: ledState });
// });

// // Nhận dữ liệu từ Arduino
// app.post("/sensor-data", (req, res) => {
//     if (sensorData.length >= MAX_ENTRIES) {
//         sensorData = []; // Reset dữ liệu nếu đã lưu 10 lần
//     }
    
//     sensorData.push({ ...req.body, timestamp: new Date() });
//     console.log(`🔥 Dữ liệu cảm biến cập nhật (${sensorData.length}/${MAX_ENTRIES}):`, req.body);

//     io.emit("updateSensorData", sensorData);
//     res.send("Dữ liệu đã nhận!");
// });

// // API lấy dữ liệu cảm biến
// app.get("/sensor-data", (req, res) => {
//     res.json(sensorData);
// });

// // WebSocket
// io.on("connection", (socket) => {
//     console.log("✅ Client đã kết nối WebSocket");
//     socket.emit("updateSensorData", sensorData);
//     socket.on("disconnect", () => {
//         console.log("❌ Client đã ngắt kết nối WebSocket");
//     });
// });

// // // Khởi động server
// // server.listen(3000, () => {
// //     console.log("🚀 Server chạy tại http://localhost:3000");
// // });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`🚀 Server chạy tại cổng ${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("views"));

// Array to store sensor data
let sensorData = [];
const MAX_ENTRIES = 10; // Maximum number of sensor data entries to store
let ledState = 0; // Variable to store LED state (0: OFF, 1: ON)

// API to get the current LED state
app.get("/toggle-led", (req, res) => {
    res.json({ state: ledState });
});

// API to update the LED state
app.post("/toggle-led", (req, res) => {
    const { state } = req.body;
    if (state === undefined) {
        return res.status(400).send({ success: false, message: "Missing LED state!" });
    }

    ledState = state;
    console.log("💡 LED State: ", ledState);

    // Notify all clients via WebSocket about the LED state change
    io.emit("updateLedState", ledState);
    res.send({ success: true, state: ledState });
});

// API to receive sensor data from Arduino
app.post("/sensor-data", (req, res) => {
    if (sensorData.length >= MAX_ENTRIES) {
        sensorData = []; // Reset data if it reaches the maximum limit
    }
    
    sensorData.push({ ...req.body, timestamp: new Date() }); // Store sensor data with a timestamp
    console.log(`🔥 Sensor data updated (${sensorData.length}/${MAX_ENTRIES}):`, req.body);

    // Notify all clients via WebSocket with the updated sensor data
    io.emit("updateSensorData", sensorData);
    res.send("Data received!");
});

// API to retrieve stored sensor data
app.get("/sensor-data", (req, res) => {
    res.json(sensorData);
});

// WebSocket connection setup
io.on("connection", (socket) => {
    console.log("✅ Client connected to WebSocket");
    socket.emit("updateSensorData", sensorData); // Send current sensor data to the newly connected client
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected from WebSocket");
    });
});

// Start the server on the specified port or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

