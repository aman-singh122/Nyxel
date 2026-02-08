// src/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// App
const app = express();

// DB & Redis
const main = require("./config/db");
const redisClient = require("./config/redis");

// Routers
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");
const contestRouter = require("./routes/contestRoute");
const discussRouter = require("./routes/discussRoute");

// ---------------- CORS ----------------
// ---------------- CORS ----------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL, // https://nyxel-five.vercel.app
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json());              // ✅ FIRST parse body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* 🔥 DEBUG LOGGER — AFTER body parser */
app.use((req, res, next) => {
  console.log("🔥 API HIT:", req.method, req.url);
  console.log("📦 BODY:", req.body);
  next();
});




// ---------------- ROUTES ----------------
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/contest", contestRouter);
app.use("/discuss", discussRouter);

// Health check
app.get("/", (req, res) => {
  res.json({
    activeStatus: true,
    error: false,
  });
});

// ---------------- HTTP + SOCKET SERVER ----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ---------------- SOCKET.IO ----------------
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ---------------- START SERVER ----------------
const initializeConnection = async () => {
  try {
    await Promise.all([
      main(),
      redisClient.connect(),
    ]);

    console.log("✅ Connected to DB and Redis");

    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
  }
};

initializeConnection();
