const orders = require("./order");

let doughWorkers = 0;
let toppingWorkersAvailable = 3;
const toppingWorkerCapacity = 2;
let serversAvailable = 0;

let wsCurrent = null;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Dough Chef ---
async function doughChefPreparation(order) {
  while (doughWorkers >= 2) {
    await delay(100); // wait for a free dough worker
  }

  doughWorkers++;
  updateOrderStatus(order, "Dough Chef");
  await delay(7000);
  doughWorkers--;
}

// --- Topping Chef ---
async function toppingChefPreparation(order) {
  const toppings = order.pizzaToppings;
  const batches = [];

  for (let i = 0; i < toppings.length; i += toppingWorkerCapacity) {
    batches.push(toppings.slice(i, i + toppingWorkerCapacity));
  }

  for (const batch of batches) {
    while (toppingWorkersAvailable <= 0) {
      await delay(100); // wait for a free topping worker
    }

    toppingWorkersAvailable--;

    await Promise.all(
      batch.map(async () => {
        updateOrderStatus(order, "Topping Chef");
        await delay(4000);
      })
    );

    toppingWorkersAvailable++;
  }
}

// --- Oven ---
async function cookPizza(order) {
  updateOrderStatus(order, "Oven");
  await delay(10000);
  order.timeTaken = Date.now();
}

// --- Serving ---
async function servePizza(order) {
  while (serversAvailable >= 2) {
    await delay(100); // wait for a free server
  }

  serversAvailable++;
  updateOrderStatus(order, "Serving");
  await delay(5000);
  serversAvailable--;
}

// --- Update status & notify client ---
function updateOrderStatus(order, status) {
  const targetOrder = orders.find((o) => o.id === order.id);
  if (!targetOrder) return;

  targetOrder.status = status;

  if (wsCurrent?.readyState === 1) {
    wsCurrent.send(JSON.stringify({ message: "order_updated", orders }));
  }
}

// --- Main process ---
async function processOrders(order, wsRef) {
  wsCurrent = wsRef;

  await doughChefPreparation(order);
  await toppingChefPreparation(order);
  await cookPizza(order);
  await servePizza(order);

  updateOrderStatus(order, "Done");
  console.log(`Order ${order.id} is complete`);
}

module.exports = processOrders;
