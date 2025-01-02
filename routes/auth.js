const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, isAdmin } = req.body;

    if (!(firstname, lastname, email, password)) {
      return res.status(400).json({ message: "Please enter all the details" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = isAdmin ? 'admin' : 'user';

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign(
      { id: user._id, email, role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    user.token = token;
    user.password = undefined;

    res.status(201).json({
      message: "You have successfully registered!",
      user,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "Please enter all the information" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
