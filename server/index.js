const express = require("express");
const cors = require("cors");
const app = express();
const processFunction = require("./processOrder.js");
const uuid = require("uuid");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const WebSocket = require("ws");
const orders = require("./order.js");

app.use("/api/menu", require("./routes/api/menu"));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

app.get("/", function (req, res) {
  res.send(orders);
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected.");

  // Handle incoming messages from the client
  ws.on("message", (event) => {
    newOrder = JSON.parse(event);
    messageType = newOrder.message;
    if (messageType === "All_Orders") {
      ws.send(JSON.stringify({ message: "all orders", orders }));
    }
    if (messageType === "New_Order") {
      newOrder.id = uuid.v4();
      newOrder.status = "New";
      newOrder.timeOrder = Date.now();
      orders.push(newOrder);
      processFunction(newOrder, ws);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});
