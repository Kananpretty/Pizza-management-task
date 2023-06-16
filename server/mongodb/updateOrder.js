const orderCollection = require("./connection.js");

const updateOrder = (order, status) => {
  try {
    const myquery = { orderId: order.orderId };
    const newvalues = {
      $set: { status: status, timeTaken: Date.now() },
    };
    orderCollection.updateOne(myquery, newvalues);
  } catch (e) {
    console.log(e);
  }
};

module.exports = updateOrder;
