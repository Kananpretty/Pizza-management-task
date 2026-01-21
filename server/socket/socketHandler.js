const { v4: uuidv4 } = require("uuid");
const processOrder = require("../services/processOrder");
const Orders = require("../models/Orders");
const Pizza = require("../models/Pizza");
const jwt = require("jsonwebtoken");

const initWebSocket = (wss) => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(4001, "No token provided");
      return;
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user info directly on the socket object
    ws.userId = decoded.id;
    ws.userRole = decoded.role;

    console.log(`User connected: ${ws.userId} as ${ws.userRole}`);

    // inside socketHandler.js
    ws.on("message", async (message) => {
      const payload = JSON.parse(message);

      if (payload.message === "New_Order") {
        try {
          // 3. Create order using ws.userId (Secure!)
          const pizza = await Pizza.findById(payload.pizzaId);

          if (!pizza) {
            ws.send(
              JSON.stringify({ type: "ERROR", message: "Pizza not found" })
            );
            return;
          }

          const newOrder = await Orders.create({
            customerId: ws.userId, // From the token
            pizzaId: pizza._id,
            status: "New Order",
          });

          // 4. Send confirmation to the sender
          ws.send(
            JSON.stringify({
              type: "ORDER_CONFIRMED",
              order: newOrder,
            })
          );

          // 5. Broadcast to Admins only
          wss.clients.forEach((client) => {
            if (client.userRole === "admin" && client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({
                  type: "NEW_ORDER_RECEIVED",
                  order: newOrder,
                })
              );
            }
          });

          processOrder(wss, newOrder._id, pizza.toppings);
        } catch (err) {
          console.error("Orders.create failed:", err);
          ws.send(JSON.stringify({ type: "ERROR", message: err.message }));
        }
      }
    });
  });
};

module.exports = { initWebSocket };
