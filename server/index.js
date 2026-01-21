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
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/auth", authRoutes);

// Initialize WebSockets
const wss = new WebSocket.Server({ server });
connectDB();
initWebSocket(wss);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
