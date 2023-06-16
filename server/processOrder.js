let doughWorkers = 0;
let toppingWorkersCount = 3;
let toppingWorkerCapacity = 2;
let ovenProcessor = 0;
let servers = 0;

const { getOrder, getOrders } = require("./mongodb/getOrders.js");
const updateOrder = require("./mongodb/updateOrder.js");
let wsCurrent;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function doughChefPreparation(order) {
  if (doughWorkers >= 2) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (doughWorkers < 2) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  doughWorkers++;
  updateOrderStatus(order, "Dough Chef");
  await delay(7000);

  doughWorkers--;
}

async function toppingChefPreparation(order) {
  const toppings = order.pizzaToppings;
  const batches = [];
  let currentBatch = [];

  for (const topping of toppings) {
    currentBatch.push(topping);

    if (currentBatch.length === toppingWorkerCapacity) {
      batches.push(currentBatch);
      currentBatch = [];
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  for (const batch of batches) {
    if (toppingWorkersCount <= 0) {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (toppingWorkersCount > 0) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    toppingWorkersCount--;

    await Promise.all(
      batch.map(async (topping) => {
        updateOrderStatus(order, "Topping Chef");
        await delay(4000);
      })
    );

    toppingWorkersCount++;
  }
}

async function cookPizza(order) {
  if (ovenProcessor >= 1) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (ovenProcessor < 1) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  ovenProcessor++;
  updateOrderStatus(order, "Oven");
  await delay(10000);
  ovenProcessor--;
}

async function servePizza(order) {
  if (servers >= 2) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (servers < 2) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  servers++;

  updateOrderStatus(order, "Serving");
  await delay(5000);

  servers--;
}

async function processOrders(order, wsRef) {
  console.log("processOrders");
  wsCurrent = wsRef;
  await doughChefPreparation(order);
  await toppingChefPreparation(order);
  await cookPizza(order);
  await servePizza(order);
  updateOrderStatus(order, "Done");
  console.log(`Order ${order.orderId} is complete`);
}

const updateOrderStatus = async (order, status) => {
  const orderTobeUpdated = await getOrder(order.orderId);
  updateOrder(orderTobeUpdated, status);
  const allOrders = await getOrders();
  console.log(typeof allOrders);
  wsCurrent.send(JSON.stringify({ message: "order_updated", allOrders }));
};

module.exports = processOrders;
