const orderCollection = require("./connection.js");

async function getOrders() {
  try {
    console.log("getOrders");
    const orders = await orderCollection.find({}).toArray();
    return orders;
  } catch (e) {
    console.error(e.message);
  }
}

async function getOrder(orderId) {
  try {
    console.log("getOrder");
    const order = await orderCollection.findOne({ orderId: orderId });
    return order;
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = {
  getOrders,
  getOrder,
};
