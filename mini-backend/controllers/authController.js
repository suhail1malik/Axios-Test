// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(200)
      .json({
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
