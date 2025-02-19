// routes/sensorRoutes.js
const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.get("/sensor-data", sensorController.getSensorData);
router.post("/sensor-data", sensorController.postSensorData);

module.exports = router;
