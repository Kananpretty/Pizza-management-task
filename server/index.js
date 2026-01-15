const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");

const processOrder = require("./processOrder");
const orders = require("./order");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/menu", require("./routes/api/menu"));

app.get("/", (req, res) => {
  res.json(orders);
});

app.listen(6000, () => {
  console.log("HTTP server started on port 6000");
});

/* ---------------- WebSocket Server ---------------- */

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    let payload;

    try {
      payload = JSON.parse(message);
    } catch (err) {
      console.error("Invalid JSON received");
      return;
    }

    const { message: messageType } = payload;

    if (messageType === "All_Orders") {
      ws.send(
        JSON.stringify({
          message: "all orders",
          orders,
        })
      );
      return;
    }

    if (messageType === "New_Order") {
      const newOrder = {
        ...payload,
        id: uuidv4(),
        status: "New",
        timeOrder: Date.now(),
      };

      orders.push(newOrder);
      processOrder(newOrder, ws);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});
