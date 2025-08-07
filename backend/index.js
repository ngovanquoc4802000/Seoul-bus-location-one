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

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

app.use("/bus", busRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1> Đã thành công Kết nối Firebase</h1>");
});

server.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
