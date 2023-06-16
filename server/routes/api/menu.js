const router = require("express").Router();
const PizzaMenu = [
  {
    pizzaId: 1,
    name: "MARGHERITA",
    description: "a cheesy pizza",
    imgPath: "/static/images/margherita.jpg",
    toppings: ["mozzarella"],
  },
  {
    pizzaId: 2,
    name: "HAWAIIAN",
    description: "a hawaiian pizza",
    imgPath: "/static/images/ham.jpg",
    toppings: ["mozzarella", "ham", "pineapple"],
  },
  {
    pizzaId: 3,
    name: "PEPPERONI",
    description: "a pepporoni pizza",
    imgPath: "/static/images/pepporini.jpg",
    toppings: ["mozzarella", "pepperoni"],
  },
  {
    pizzaId: 4,
    name: "SUPREME",
    description: "a supreme pizza",
    imgPath: "/static/images/supreme.jpg",
    toppings: [
      "mozzarella",
      "bacon",
      "onion",
      "beef mince",
      "capsicum",
      "pepperoni",
      "mushroom",
      "olives",
    ],
  },
  {
    pizzaId: 5,
    name: "BBQ MEATLOVERS",
    description: "a BBQ meaty pizza",
    imgPath: "/static/images/ham.jpg",
    toppings: [
      "mozzarella",
      "pepperoni",
      "bacon",
      "cabanossi",
      "beef mince",
      "ham",
    ],
  },
  {
    pizzaId: 6,
    name: "GARLIC BUTTER PRAWNS AND CHILLI",
    description: "a buttry prawn and spicy pizza",
    imgPath: "/static/images/prawn.jpg",
    toppings: [
      "mozzarella",
      "garlic butter prawns",
      "capsicum",
      "onion",
      "chilli",
      "rocket",
    ],
  },
  {
    pizzaId: 7,
    name: "SAUSAGE & KALE",
    description: "a sausage pizza",
    imgPath: "/static/images/sausage.jpg",
    toppings: ["mozzarella", "sausage", "kale"],
  },
  {
    pizzaId: 8,
    name: "HOT N' SPICY",
    description: "a spicy pizza",
    imgPath: "/static/images/supreme.jpg",
    toppings: [
      "spicy salami",
      "capsicum",
      "sliced jalapenos",
      "onions",
      "hot sauce",
    ],
  },
  {
    pizzaId: 9,
    name: "SEAFOOD PIZZA",
    description: "a seafood pizza",
    imgPath: "/static/images/meatlovers.jpg",
    toppings: ["mozzarella", "precooked squid", "mussels", "clams", "prawns"],
  },
  {
    pizzaId: 10,
    name: "VEGGIE DELIGHT",
    description: "a veggie pizza",
    imgPath: "/static/images/margherita.jpg",
    toppings: [
      "mozzarella",
      "zucchini",
      "artichoke",
      "asparagus",
      "spinach",
      "pesto",
      "onion",
      "tomatoes",
      "capcsicum",
    ],
  },
];

router.get("/menu", (req, res) => {
  return res.json(PizzaMenu);
});

module.exports = router;
