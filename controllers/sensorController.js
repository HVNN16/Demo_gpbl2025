// controllers/sensorController.js
const SensorModel = require("../models/sensorModel");

exports.getSensorData = (req, res) => {
    res.json(SensorModel.getSensorData());
};

exports.postSensorData = (req, res) => {
    SensorModel.updateSensorData(req.body);
    res.send("Dữ liệu đã nhận!");
};
