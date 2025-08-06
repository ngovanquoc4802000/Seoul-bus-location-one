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

const socketIo = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

socketIo.on("connection", (socket) => {
  console.log("Một client đã kết nối:", socket.id);
});

connectAndListen();

app.use("/bus", busRoutes);

app.set("socketio", socketIo);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("<h1> Đã thành công Kết nối Firebase</h1>");
});

server.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`Truy cập: http://localhost:${PORT}`);
});
