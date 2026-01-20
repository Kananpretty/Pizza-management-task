const { v4: uuidv4 } = require("uuid");
const orders = require("../data/order");
const processOrder = require("../services/processOrder");

const initWebSocket = (wss) => {
  wss.on("connection", (ws) => {
    console.log("Client connected");

    // inside socketHandler.js
    ws.on("message", (message) => {
      const payload = JSON.parse(message);

      if (payload.message === "New_Order") {
        const now = new Date().toISOString();

        const newOrder = {
          ...payload,
          id: uuidv4(),
          status: "New",
          createdAt: now,
          updatedAt: now,
        };
        orders.push(newOrder);

        // Pass the WHOLE wss so the kitchen can talk to everyone
        processOrder(newOrder, wss);
      }
    });
  });
};

module.exports = { initWebSocket };
