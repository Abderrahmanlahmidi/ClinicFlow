import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());


// ------------------ Cors ------------------
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));
// ------------------ HTTP + Socket.IO ------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH"] },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ------------------ MongoDB ------------------
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", console.log);
db.once("connected", () => console.log("Database Connected"));

// ------------------ Socket.IO Events ------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("joinRoom", (userId) => socket.join(userId.toString()));
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// ------------------ Routes ------------------
for (const r of routes) {
  app.use(r.path, r.route);
}
// ------------------ Start Server ------------------
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
