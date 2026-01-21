const express = require("express");
const Pizza = require("../models/Pizza");
const router = express.Router();

// GET /api/menu
router.get("/", async (req, res) => {
  const menuItems = await Pizza.find();
  res.status(200).json(menuItems);
});

module.exports = router;
