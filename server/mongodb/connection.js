const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://kanan:2Rhq7Nj5MLDbGDqx@clusterkanan.hyzfzhx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const database = client.db("PizzaOrderManager");
const ordersCollections = database.collection("OrdersHistory");

module.exports = ordersCollections;
