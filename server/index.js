const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
require("dotenv").config();

const { initWebSocket } = require("./socket/socketHandler");
const menuRoutes = require("./routes/menuRoute");
const orderRoutes = require("./routes/orderRoute");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Initialize WebSockets
const wss = new WebSocket.Server({ server });
initWebSocket(wss);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
