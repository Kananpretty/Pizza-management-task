const WebSocket = require("ws");
const { getOrders } = require("../mongodb/getOrders.js");
const addOrder = require("../mongodb/addOrder.js");
const uuid = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });

console.log("in websocket");

wss.on("connection", (ws) => {
  console.log("Client connected.");

  // Handle incoming messages from the client
  ws.on("message", async (event) => {
    orderEvent = JSON.parse(event);
    messageType = orderEvent.message;
    if (messageType === "All_Orders") {
      const allOrders = await getOrders();
      ws.send(JSON.stringify({ message: "all orders", allOrders }));
    }
    if (messageType === "New_Order") {
      orderEvent.orderId = uuid.v4();
      orderEvent.status = "New";
      orderEvent.timeOrder = Date.now();
      addOrder(orderEvent, ws);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

module.exports = wss;
