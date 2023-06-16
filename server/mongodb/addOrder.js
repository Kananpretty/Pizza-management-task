const orderCollection = require("./connection.js");
const processOrder = require("../processOrder.js");

async function addOrder(order, wsRef) {
  try {
    console.log("addOrder");
    await orderCollection.insertOne(order);
    processOrder(order, wsRef);
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = addOrder;
