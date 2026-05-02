import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import apiKeyRoutes from "./routes/apiKeyroutes.js";
import userRoutes from "./routes/UserRouter.js";
import { validateApiKey } from "./controllers/apiKeyController.js";
import connection from "./connection.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connection();

import adminRoutes from "./routes/adminRoutes.js";

// Routes
app.use("/api/keys", apiKeyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/whiteboards", whiteboardRoutes);


app.get("/", (_req, res) => res.send("✅ Socket.IO signaling server running"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  const apiKey = socket.handshake.auth.apiKey;

  if (!apiKey) {
    return next(new Error("API key missing"));
  }

  const isValid = await validateApiKey(apiKey);

  if (!isValid) {
    return next(new Error("Invalid API key"));
  }

  next();
});

io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);

  // We can join room explicitly on `join-room`.
  socket.on("join-room", ({ roomId, userId, name }) => {
    console.log(`👤 ${name} (${userId}) joined room ${roomId}`);
    socket.join(roomId);
    socket.roomId = roomId; // store roomId on socket for convenience
  });

  // ✅ WebRTC signaling handlers
  socket.on("offer", (offer) => {
    console.log("📨 Offer received in room", socket.roomId);
    if (socket.roomId) {
       socket.to(socket.roomId).emit("offer", offer);
    } else {
       socket.broadcast.emit("offer", offer);
    }
  });

  socket.on("answer", (answer) => {
    console.log("📨 Answer received in room", socket.roomId);
    if (socket.roomId) {
       socket.to(socket.roomId).emit("answer", answer);
    } else {
       socket.broadcast.emit("answer", answer);
    }
  });

  socket.on("candidate", (candidate) => {
    console.log("📨 ICE candidate received in room", socket.roomId);
    if (socket.roomId) {
       socket.to(socket.roomId).emit("candidate", candidate);
    } else {
       socket.broadcast.emit("candidate", candidate);
    }
  });

  // Chat support
  socket.on("send-message", (data) => {
    console.log("💬 Chat:", data);
    if (socket.roomId) {
       socket.to(socket.roomId).emit("rec-message", data);
    } else {
       socket.broadcast.emit("rec-message", data);
    }
  });

  // Listen for drawing events
  socket.on("whiteboard-draw", (data) => {
    if (socket.roomId) {
       socket.to(socket.roomId).emit("whiteboard-draw", data);
    } else {
       socket.broadcast.emit("whiteboard-draw", data);
    }
  });

  // Clear whiteboard
  socket.on("whiteboard-clear", () => {
    if (socket.roomId) {
       socket.to(socket.roomId).emit("whiteboard-clear");
    } else {
       socket.broadcast.emit("whiteboard-clear");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});
