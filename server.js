const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let sensorData = { temperature: 0, humidity: 0, light: 0, distance: 0 };
let count = 0;

// Handle POST request to update sensor data
app.post("/sensor-data", (req, res) => {
    count++;

    // Cập nhật dữ liệu mới
    sensorData = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light: req.body.light,
        distance: req.body.distance
    };

    console.log("Dữ liệu nhận được:", sensorData);

    // Khi nhận được 5 lần dữ liệu, xóa tất cả dữ liệu và ghi dữ liệu mới
    if (count >= 5) {
        console.log("Đã nhận đủ 5 lần dữ liệu, xóa dữ liệu cũ và ghi dữ liệu mới!");
        sensorData = { temperature: 0, humidity: 0, light: 0, distance: 0 }; // Xóa dữ liệu
        count = 0; // Reset lại số lần nhận dữ liệu
    }

    res.send("Dữ liệu đã nhận!");
});

// Handle GET request to send the current sensor data
app.get("/sensor-data", (req, res) => {
    res.json(sensorData);
});

app.listen(3000, () => {
    console.log("Server chạy tại http://localhost:3000");
});
