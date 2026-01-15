const router = require("express").Router();
const menu = require("../../order");

// --- GET /api/menu ---
// Returns all menu items
router.get("/", (req, res) => {
  return res.json(menu);
});

/* --- POST /api/menu ---
// Uncomment and use if you want to allow creating new orders

const processFunction = require("../../processOrder");
const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const { userName, pizzaType, pizzaToppings } = req.body;

  if (!userName || !pizzaType || !pizzaToppings) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newOrder = {
    id: uuidv4(),
    userName,
    pizzaType,
    pizzaToppings,
    status: "New",
    timeOrder: Date.now(),
  };

  menu.push(newOrder);

  // Optionally start processing order
  processFunction(newOrder);

  return res.status(201).json(newOrder);
});
*/

module.exports = router;
