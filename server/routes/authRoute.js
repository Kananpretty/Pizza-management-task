const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  try {
    const { username, password, emailId, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ emailId });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 2. Check if user already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res
        .status(400)
        .json({ message: "Username already taken, choose another one" });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user (default to 'customer' unless specified)
    const user = await User.create({
      username,
      password: hashedPassword,
      emailId,
      role: role || "customer",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");

    // 3. Save to DB with 7-day expiration
    user.refreshToken = refreshToken;
    user.refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    // 4. Set httpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh", // Limit cookie to the refresh route for security
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        emailId: user.emailId,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // 1. Get the refresh token from the cookie
    const token = req.cookies.refreshToken;

    if (token) {
      // 2. Remove the token from the Database
      // This ensures that even if the cookie isn't cleared, the token is dead
      await User.findOneAndUpdate(
        { refreshToken: token },
        {
          $set: { refreshToken: null, refreshExpiry: null },
        }
      );
    }

    // 3. Clear the cookie from the browser
    // You MUST use the same options (path, domain) used when setting it
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/api/auth/refresh",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({
      refreshToken: incomingToken,
      refreshExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
