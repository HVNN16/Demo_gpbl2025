// server.js
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
app.use(express.static("views")); // Phục vụ file HTML từ thư mục views

let sensorData = { temperature: 0, humidity: 0, light: 0, distance: 0 };

app.post("/sensor-data", (req, res) => {
    sensorData = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light: req.body.light,
        distance: req.body.distance
    };

    console.log("🔥 Dữ liệu cảm biến cập nhật:", sensorData);

    // Gửi dữ liệu mới đến tất cả client ngay lập tức
    io.emit("updateSensorData", sensorData);

    res.send("Dữ liệu đã nhận!");
});

app.get("/sensor-data", (req, res) => {
    res.json(sensorData);
});

// Khi client kết nối WebSocket
io.on("connection", (socket) => {
    console.log("✅ Client đã kết nối WebSocket");

    // Gửi dữ liệu hiện tại ngay khi client kết nối
    socket.emit("updateSensorData", sensorData);

    socket.on("disconnect", () => {
        console.log("❌ Client đã ngắt kết nối WebSocket");
    });
});

// Khởi động server
server.listen(3000, () => {
    console.log("🚀 Server chạy tại http://localhost:3000");
});
