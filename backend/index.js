import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import apiKeyRoutes from "./routes/apiKeyroutes.js";
import userRoutes from "./routes/UserRouter.js";
import { validateApiKey } from "./controllers/apiKeyController.js";
// import connection from "./connection.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
// connection();

// Routes
app.use("/api/keys", apiKeyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/profile", userRoutes);


app.get("/", (_req, res) => res.send("✅ Socket.IO signaling server running"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// io.use(async (socket, next) => {
//   const apiKey = socket.handshake.auth?.apiKey;

//   if (!apiKey) {
//     return next(new Error("API key missing"));
//   }

//   try {
//     const isValid = await validateApiKey(apiKey);
//     if (!isValid) {
//       return next(new Error("Invalid API key"));
//     }
//     return next();
//   } catch (err) {
//     console.error("Socket auth error:", err);
//     return next(new Error("Authentication failed"));
//   }
// });

io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);

  // ✅ WebRTC signaling handlers
  socket.on("offer", (offer) => {
    console.log("📨 Offer received");
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("📨 Answer received");
    socket.broadcast.emit("answer", answer);
  });

  socket.on("candidate", (candidate) => {
    console.log("📨 ICE candidate received");
    socket.broadcast.emit("candidate", candidate);
  });

  // (Optional) Chat support bhi rehne do
  socket.on("send-message", (data) => {
    console.log("💬 Chat:", data);
    socket.broadcast.emit("rec-message", data);
  });

  // Listen for drawing events
  socket.on("whiteboard-draw", (data) => {
    // broadcast to sab ko except sender
    socket.broadcast.emit("whiteboard-draw", data);
  });

  // Clear whiteboard
  socket.on("whiteboard-clear", () => {
    socket.broadcast.emit("whiteboard-clear");
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
