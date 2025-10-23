require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// -------------------- MongoDB --------------------
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => console.log(error));
database.once("connected", () => console.log("Database Connected"));

// -------------------- HTTP + Socket.IO --------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH"] },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId.toString());
    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// -------------------- Routes --------------------
const routes = [
  { path: "/api/clinic", route: require("./routes/role") },
  { path: "/api/clinic", route: require("./routes/speciality") },
  { path: "/api/clinic", route: require("./routes/availability") },
  { path: "/api/clinic", route: require("./routes/appointment") },
  { path: "/api/clinic", route: require("./routes/consultation") },
  { path: "/api/clinic", route: require("./routes/prescription") },
  { path: "/api/clinic", route: require("./routes/pharmacy") },
  { path: "/api/clinic", route: require("./routes/laboratory") },
  { path: "/api/auth", route: require("./routes/auth/register") },
  { path: "/api/auth", route: require("./routes/auth/login") },
  { path: "/api", route: require("./routes/notification") },
  { path: "/api", route: require("./routes/user") },
];

routes.forEach((r) => app.use(r.path, r.route));

// -------------------- Start server --------------------
server.listen(3000, () => {
  console.log(`Server Started at http://localhost:3000`);
});
