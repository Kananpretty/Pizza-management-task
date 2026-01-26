const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const { initWebSocket } = require("./socket/socketHandler");
const menuRoutes = require("./routes/menuRoute");
const orderRoutes = require("./routes/orderRoute");
const authRoutes = require("./routes/authRoute");
const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
const corsOptions = {
  // Use the env variable, but fall back to localhost if it's missing
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Required if you are sending cookies (refresh tokens)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/auth", authRoutes);

// Initialize WebSockets
const wss = new WebSocket.Server({
  server,
  verifyClient: (info, callback) => {
    const origin = info.origin;
    const allowedOrigin = process.env.FRONTEND_URL;

    // Check if the request is coming from your React app
    if (origin !== allowedOrigin) {
      console.log("Blocked connection from unauthorized origin:", origin);
      return callback(false, 401, "Unauthorized Origin");
    }

    callback(true);
  },
});
connectDB();
initWebSocket(wss);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
