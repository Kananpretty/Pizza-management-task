const mongoose = require("mongoose");
const Pizza = require("../models/Pizza");
const seedPizzas = require("./seedData");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    // SEEDING LOGIC
    const count = await Pizza.countDocuments();
    if (count === 0) {
      console.log("Menu empty. Preseeding data...");
      await Pizza.insertMany(seedPizzas);
      console.log("Database seeded successfully!");
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
