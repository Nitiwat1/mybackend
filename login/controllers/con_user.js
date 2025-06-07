const bcrypt = require("bcrypt");
const User = require("../models/model_user");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Please provide username, password, and email." });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      let message = "User already exists.";
      if (existingUser.username === username && existingUser.email === email) {
        message = "Username and Email already exist.";
      } else if (existingUser.username === username) {
        message = "Username already exists.";
      } else {
        message = "Email already exists.";
      }
      return res.status(409).json({ message });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: savedUser.toJSON(),
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      user: user.toJSON(),
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

exports.logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

exports.getSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Server error retrieving session" });
  }
};
