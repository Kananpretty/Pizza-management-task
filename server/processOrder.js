let doughWorkers = 0;
let toppingWorkersCount = 3;
let toppingWorkerCapacity = 2;
let servers = 0;
let orders = require("./order");
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
  updateOrderStatus(order, "Oven");
  await delay(10000);
  order.timeTaken = Date.now();
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
  order.timeTaken = Date.now();

  servers--;
}

async function processOrders(order, wsRef) {
  wsCurrent = wsRef;
  await doughChefPreparation(order);
  await toppingChefPreparation(order);
  await cookPizza(order);
  await servePizza(order);
  updateOrderStatus(order, "Done");
  console.log(`Order ${order.id} is complete`);
}

updateOrderStatus = (order, statusTobeUpdated) => {
  const orderTobeUpdated = orders.filter((ord) => order.id === ord.id);
  orderTobeUpdated[0].status = statusTobeUpdated;
  wsCurrent.send(JSON.stringify({ message: "order_updated", orders }));
};

module.exports = processOrders;
