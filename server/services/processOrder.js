const Orders = require("../models/Orders");

// Kitchen Resources
let doughWorkers = 0;
let toppingWorkersAvailable = 3;
const toppingWorkerCapacity = 2;
let serversAvailable = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Update status & Broadcast to ALL clients ---
async function updateOrderStatus(orderId, status, wss) {
  const updatedOrder = await Orders.findByIdAndUpdate(
    orderId,
    { status: status, updatedAt: new Date().toISOString() },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) return;

  // BROADCAST: Send the update to every single person connected
  const payload = JSON.stringify({ message: "order_updated", updatedOrder });

  wss.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      (client.userRole === "admin" ||
        client.userId === updatedOrder.customerId.toString())
    ) {
      client.send(payload);
    }
  });
}

// --- Kitchen Steps ---
async function doughChefPreparation(orderId, wss) {
  while (doughWorkers >= 2) await delay(100);
  doughWorkers++;
  updateOrderStatus(orderId, "Dough Chef", wss);
  await delay(7000);
  doughWorkers--;
}

async function toppingChefPreparation(orderId, wss, toppings) {
  const batches = [];
  for (let i = 0; i < toppings.length; i += toppingWorkerCapacity) {
    batches.push(toppings.slice(i, i + toppingWorkerCapacity));
  }

  for (const batch of batches) {
    while (toppingWorkersAvailable <= 0) await delay(100);
    toppingWorkersAvailable--;
    updateOrderStatus(orderId, "Topping Chef", wss);
    await Promise.all(batch.map(() => delay(4000)));
    toppingWorkersAvailable++;
  }
}

async function cookPizza(orderId, wss) {
  updateOrderStatus(orderId, "Oven", wss);
  await delay(10000);
}

async function servePizza(orderId, wss) {
  while (serversAvailable >= 2) await delay(100);
  serversAvailable++;
  updateOrderStatus(orderId, "Serving", wss);
  await delay(5000);
  serversAvailable--;
}

// --- Main Process ---
async function processOrder(wss, orderId, toppings) {
  console.log(`Order ${orderId} received. Starting processing...`);

  await doughChefPreparation(orderId, wss);
  await toppingChefPreparation(orderId, wss, toppings);
  await cookPizza(orderId, wss);
  await servePizza(orderId, wss);

  updateOrderStatus(orderId, "Done", wss);
  console.log(`Order ${orderId} is complete`);
}

module.exports = processOrder;
