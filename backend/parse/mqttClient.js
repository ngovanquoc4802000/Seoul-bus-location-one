// backend/parse/mqttClient.js

import mqtt from "mqtt";
import { parseMQTTMessage } from "./dataParse.js";
import  {saveCarData} from "./firebaseService.js"; 

const connectAndListen = () => {
    const mqttUrl = process.env.MQTT_URL || "mqtt://localhost:1883";
    const client = mqtt.connect(mqttUrl, {
        username: process.env.MQTT_USERNAME || "mijuit", 
        password: process.env.MQTT_PASSWORD || "admin@123",
    });

    client.on("connect", () => {
        console.log("MQTT client connected");
       
        client.subscribe("/138-81-54417/#");
    });

    client.on("message", async (topic, message) => {
        const carData = parseMQTTMessage(topic, message);
        if (carData && carData.carId) {
            await saveCarData(carData);
            console.log(`Dữ liệu xe ${carData.carId} đã được lưu vào Firebase.`);
        }
    });

    client.on("error", (err) => {
        console.error("MQTT client error:", err);
    });
};

export { connectAndListen };