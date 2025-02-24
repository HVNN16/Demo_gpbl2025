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

let sensorData = [];
const MAX_ENTRIES = 10; // Lưu tối đa 10 lần

let ledState = 0; // 0: Tắt, 1: Bật

// API điều khiển LED
app.get("/toggle-led", (req, res) => {
    res.json({ state: ledState });
});

app.post("/toggle-led", (req, res) => {
    const { state } = req.body;
    if (state === undefined) {
        return res.status(400).send({ success: false, message: "Thiếu trạng thái LED!" });
    }

    ledState = state;
    console.log("💡 LED State: ", ledState);

    io.emit("updateLedState", ledState);
    res.send({ success: true, state: ledState });
});

// Nhận dữ liệu từ Arduino
app.post("/sensor-data", (req, res) => {
    if (sensorData.length >= MAX_ENTRIES) {
        sensorData = []; // Reset dữ liệu nếu đã lưu 10 lần
    }
    
    sensorData.push({ ...req.body, timestamp: new Date() });
    console.log(`🔥 Dữ liệu cảm biến cập nhật (${sensorData.length}/${MAX_ENTRIES}):`, req.body);

    io.emit("updateSensorData", sensorData);
    res.send("Dữ liệu đã nhận!");
});

// API lấy dữ liệu cảm biến
app.get("/sensor-data", (req, res) => {
    res.json(sensorData);
});

// WebSocket
io.on("connection", (socket) => {
    console.log("✅ Client đã kết nối WebSocket");
    socket.emit("updateSensorData", sensorData);
    socket.on("disconnect", () => {
        console.log("❌ Client đã ngắt kết nối WebSocket");
    });
});

// // Khởi động server
// server.listen(3000, () => {
//     console.log("🚀 Server chạy tại http://localhost:3000");
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server chạy tại cổng ${PORT}`);
});

