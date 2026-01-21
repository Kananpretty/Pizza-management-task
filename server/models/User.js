const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "customer"],
    default: "customer",
  },
  refreshToken: { type: String, unique: true, sparse: true },
  refreshExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
