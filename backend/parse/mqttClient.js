// Lắng nghe và kết nối tin nhắn từ mqtt Client;

import mqtt from "mqtt";

import moment from "moment";

import { parseMQTTMessage } from "./dataParse.js";

import { saveCarData } from "./firebaseService.js";

import { carStatus } from "../controllers/busStatus.js";

const connectAndListen = () => {
  const mqttUrl = process.env.MQTT_URL || "mqtt://localhost:1883";

  const client = mqtt.connect(mqttUrl, {
    username: "mijuit",
    password: "admin@123",
  });

  client.on("connect", () => {
    console.log("MQTT client connected");
    client.subscribe("/138-81-54417/#");
  });

  client.on("message", async (topic, message) => {
    const carData = parseMQTTMessage(topic, message);

    if (carData) {
      const { carId, speed } = carData;

      if (!carId || !speed) {
        console.error("Invalid car data received:", carData);
        return;
      }
      if (speed > 0 && !carStatus[carId].isMoving) {
        // Xe bắt đầu chạy
        carStatus[carId].isMoving = true;

        carStatus[carId].stopStartTime = null;

        console.log(`Car ${carId} is now moving.`);
      } else if (speed === 0 && carStatus[carId].isMoving) {
        // Xe bắt đầu dừng
        carStatus[carId].isMoving = false;

        carStatus[carId].stopStartTime = new Date();

        console.log(`Car ${carId} has stopped.`);
      } else if (speed === 0 && carStatus[carId].stopStartTime) {
        // Xe tiếp tục dừng, tính thời gian dừng
        const stopDuration = moment().diff(
          carStatus[carId].stopStartTime,
          "minutes"
        );

        console.log(`Xe ${carId} đã dừng được ${stopDuration} phút.`);
      }
      carStatus[carId].lastLat = latitude;
      carStatus[carId].lastLon = longitude;
      carStatus[carId].lastSpeed = speed;
      await saveCarData(carData);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT client error:", err);
  });
};

export { connectAndListen };
