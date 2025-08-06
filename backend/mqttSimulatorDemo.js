import mqtt from "mqtt";
import moment from "moment";

// Cấu hình MQTT giống với file mqttClient.js
const mqttUrl = "mqtt://www.mjccp.kr"; // Sử dụng địa chỉ IP thực
const topic = "/138-81-54417/01222580211/regular/gps/"; // Đổi YOUR_CAR_ID thành một ID cụ thể
const client = mqtt.connect(mqttUrl, { 
    username: "mijuit", 
    password: "admin@123" 
});

const startPoint = { lat: 37.5665, lon: 126.9780 }; // Ví dụ: Điểm A (Seoul)
const endPoint = { lat: 33.4996, lon: 126.5312 }; // Ví dụ: Điểm B (Jeju Island)

let currentLat = startPoint.lat;
let currentLon = startPoint.lon;

const simulateMovement = () => {
    // Tăng/giảm tọa độ để mô phỏng di chuyển
    const latStep = (endPoint.lat - startPoint.lat) / 100;
    const lonStep = (endPoint.lon - startPoint.lon) / 100;

    currentLat += latStep;
    currentLon += lonStep;

    // Chuyển đổi tọa độ thành các giá trị hex/decimal mà backend của bạn có thể parse
    const latInt = Math.floor(currentLat * 1000000); // Ví dụ: chuyển đổi thành số nguyên
    const lonInt = Math.floor(currentLon * 1000000);
    const speed = 60; // Tốc độ giả lập

    // Tạo payload tin nhắn giả lập
    const messagePayload = {
        // Đây chỉ là ví dụ đơn giản. Payload thực tế của bạn có thể là chuỗi hex
        // hoặc các trường dữ liệu được phân tách bằng dấu ';' như trong `dataParse.js`.
        // Dựa vào logic parsing của bạn, bạn cần tạo payload tương ứng.
        yymmdd: moment().format('YYMMDD'),
        hhnnss: moment().format('HHmmss'),
        lat: latInt,
        lon: lonInt,
        speed: speed,
    };
    
    // Convert payload to string or hex before publishing
    const messageString = JSON.stringify(messagePayload);

    client.publish(topic, messageString);
    console.log(`Published location update: Lat ${currentLat.toFixed(4)}, Lon ${currentLon.toFixed(4)}`);
    
    // Kiểm tra nếu đã đến gần điểm B
    if (Math.abs(currentLat - endPoint.lat) < Math.abs(latStep) && 
        Math.abs(currentLon - endPoint.lon) < Math.abs(lonStep)) {
        console.log("Reached destination!");
        client.end();
        return;
    }

    // Lặp lại việc gửi tin nhắn sau mỗi 5 giây
    setTimeout(simulateMovement, 5000); 
};

client.on("connect", () => {
    console.log("MQTT simulator connected. Starting to publish...");
    simulateMovement();
});

client.on("error", (err) => {
    console.error("MQTT simulator error:", err);
});