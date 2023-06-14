//const processFunction = require("../../processOrder.js");
const router = require("express").Router();
//const uuid = require("uuid");
let menu = require("../../order");

router.get("/", (req, res) => {
  return res.json(menu);
});

// router.post("/", (req, res) => {
//   const newOrder = {
//     id: uuid.v4(),
//     userName: req.body.userName,
//     pizzaType: req.body.pizzaType,
//     pizzaToppings: req.body.pizzaToppings,
//     status: "New",
//     orderTime: Date.now(),
//   };

//   if (!newOrder.userName || !newOrder.pizzaType || !newOrder.pizzaToppings) {
//     return res.sendStatus(400);
//   }

//   orders.push(newOrder);
//   processFunction();

//   return res.json(orders);
// });

module.exports = router;
