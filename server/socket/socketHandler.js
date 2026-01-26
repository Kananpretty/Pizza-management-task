const jwt = require("jsonwebtoken");
const Orders = require("../models/Orders");
const Pizza = require("../models/Pizza");
const processOrder = require("../services/processOrder");

function heartbeat() {
  this.isAlive = true;
}

const initWebSocket = (wss) => {
  // 1. Heartbeat Interval (Ping all clients every 30s)
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("Terminating inactive connection");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  // Clear interval when server closes
  wss.on("close", () => clearInterval(interval));

  // 2. Main Connection Handler
  wss.on("connection", async (ws, req) => {
    // Initialize Heartbeat
    ws.isAlive = true;
    ws.on("pong", heartbeat);

    // 3. Authenticate via Token in URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(4001, "No token provided");
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;
      ws.userRole = decoded.role;
      console.log(`User connected: ${ws.userId} (${ws.userRole})`);
    } catch (err) {
      console.error("WS Auth Error:", err.message);
      ws.send(
        JSON.stringify({
          message: "unauthorized",
          error:
            err.name === "TokenExpiredError"
              ? "Token Expired"
              : "Invalid Token",
        })
      );
      ws.close(1008, "Auth Failed");
      return;
    }

    // 4. Message Handler
    ws.on("message", async (message) => {
      try {
        const payload = JSON.parse(message);

        if (payload.message === "New_Order") {
          const pizza = await Pizza.findById(payload.pizzaId);

          if (!pizza) {
            return ws.send(
              JSON.stringify({ type: "ERROR", message: "Pizza not found" })
            );
          }

          // Create order and populate so the frontend has names immediately
          let newOrder = await Orders.create({
            customerId: ws.userId,
            pizzaId: pizza._id,
            status: "New Order",
          });

          // Re-fetch with population for broadcasting
          newOrder = await Orders.findById(newOrder._id)
            .populate("customerId", "username")
            .populate("pizzaId", "name toppings");

          // Confirmation to the person who ordered
          ws.send(JSON.stringify({ type: "ORDER_CONFIRMED", order: newOrder }));

          // 5. Broadcast to Admins
          wss.clients.forEach((client) => {
            if (client.userRole === "admin" && client.readyState === 1) {
              // 1 = OPEN
              client.send(
                JSON.stringify({
                  type: "NEW_ORDER_RECEIVED",
                  order: newOrder,
                })
              );
            }
          });

          // Start the automated status updates (Baking -> Out for Delivery -> Done)
          processOrder(wss, newOrder._id, pizza.toppings);
        }
      } catch (err) {
        console.error("Message Error:", err);
        ws.send(
          JSON.stringify({ type: "ERROR", message: "Invalid message format" })
        );
      }
    });

    ws.on("error", (error) => console.error("Socket Error:", error));
  });
};

module.exports = { initWebSocket };
