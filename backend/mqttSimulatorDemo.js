import mqtt from "mqtt";
import moment from "moment";

const mqttUrl ="mqtt://www.mjccp.kr"; 
const topic = "/138-81-54417/01222580211/regular/gps/";
const client = mqtt.connect(mqttUrl, { 
    username:"mijuit", 
    password:"admin@123", 
});

const startPoint = { lat: 37.5665, lon: 126.9780 }; 
const endPoint = { lat: 37.5005, lon: 126.9000 }; 

let currentLat = startPoint.lat;
let currentLon = startPoint.lon;

const simulateMovement = () => {
    const latStep = (endPoint.lat - startPoint.lat) / 100;
    const lonStep = (endPoint.lon - startPoint.lon) / 100;

    currentLat += latStep;
    currentLon += lonStep;

    const latInt = Math.floor(currentLat * 1000000); 
    const lonInt = Math.floor(currentLon * 1000000);
    const speed = 60; 

    const messagePayload = {
        yymmdd: moment().format('YYMMDD'),
        hhnnss: moment().format('HHmmss'),
        lat: latInt,
        lon: lonInt,
        speed: speed,
    };
    
    const messageString = JSON.stringify(messagePayload);

    client.publish(topic, messageString);
    console.log(`Published location update: Lat ${currentLat.toFixed(4)}, Lon ${currentLon.toFixed(4)}`);
    
    if (Math.abs(currentLat - endPoint.lat) < Math.abs(latStep) && 
        Math.abs(currentLon - endPoint.lon) < Math.abs(lonStep)) {
        console.log("Reached destination!");
        client.end();
        return;
    }

    setTimeout(simulateMovement, 5000); 
};

client.on("connect", () => {
    console.log("MQTT simulator connected. Starting to publish...");
    simulateMovement();
});

client.on("error", (err) => {
    console.error("MQTT simulator error:", err);
});