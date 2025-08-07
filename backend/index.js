import "dotenv/config";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { connectAndListen } from "./parse/mqttClient.js";
import busRoutes from "./router/bus.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8001;
const server = http.createServer(app);

// 1. ✅ Bật CORS TRƯỚC tiên
app.use(cors({
  origin: "http://localhost:5173", // hoặc "*" nếu bạn dev
  methods: ["GET", "POST"],
  credentials: true,
}));

// 2. ✅ Middleware cơ bản
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 3. ✅ Socket.io
const socketIo = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
socketIo.on("connection", (socket) => {
  console.log("Một client đã kết nối:", socket.id);
});
connectAndListen(socketIo);
app.set("socketio", socketIo);

// 4. ✅ Route sau middleware
app.use("/bus", busRoutes);

// 5. ✅ Route test
app.get("/", (req, res) => {
  res.status(200).send("<h1> Đã thành công Kết nối Firebase</h1>");
});

// 6. ✅ Khởi chạy server
server.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
