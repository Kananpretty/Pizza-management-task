const express = require("express");
const router = express.Router();
const orders = require("../data/order"); // Path to your centralized data

/**
 * @route   GET /api/orders
 * @desc    Fetch all current orders
 * @access  Public
 */
router.get("/", (req, res) => {
  try {
    // We send a 200 status explicitly for clarity
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

module.exports = router;
