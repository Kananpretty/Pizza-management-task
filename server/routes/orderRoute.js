const express = require("express");
const Orders = require("../models/Orders");
const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    Fetch all current orders
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    if (req.user && req.user.role === "admin") {
      const allOrders = await Orders.find()
        .populate("customerId", "username")
        .populate("pizzaId", "name toppings");
      return res.status(200).json(allOrders);
    } else {
      const myOrders = await Orders.find({ customerId: req.user.id })
        .populate("customerId", "username")
        .populate("pizzaId", "name toppings");
      return res.status(200).json(myOrders);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

module.exports = router;
