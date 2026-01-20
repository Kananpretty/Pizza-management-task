const express = require("express");
const router = express.Router();
const menuData = require("../data/menu");

// GET /api/menu
router.get("/", (req, res) => {
  console.log(menuData);
  res.json(menuData);
});

module.exports = router;
