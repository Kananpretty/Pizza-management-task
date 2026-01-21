const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const pizzaSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imgPath: { type: String, required: true },
  toppings: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("Pizza", pizzaSchema);
