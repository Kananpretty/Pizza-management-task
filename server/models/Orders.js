const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ordersSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pizzaId: { type: Schema.Types.ObjectId, ref: "Pizza", required: true },
  status: {
    type: String,
    enum: [
      "New Order",
      "Dough Chef",
      "Topping Chef",
      "Oven",
      "Serving",
      "Done",
    ],
    default: "New Order",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("Orders", ordersSchema);
