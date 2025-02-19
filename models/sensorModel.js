// models/sensorModel.js
let sensorData = { temperature: 0, humidity: 0, light: 0, distance: 0 };
let count = 0;
let io = null;

module.exports = {
    setSocket: (socketIo) => {
        io = socketIo;
    },
    getSensorData: () => sensorData,
    updateSensorData: (newData) => {
        count++;
        sensorData = { ...newData };

        if (count >= 5) {
            console.log("Đã nhận đủ 5 lần dữ liệu, reset dữ liệu!");
            sensorData = { temperature: 0, humidity: 0, light: 0, distance: 0 };
            count = 0;
        }

        if (io) {
            io.emit("updateSensorData", sensorData);
        }
    }
};
