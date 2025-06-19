const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, address, gender, dateOfBirth, withdrawalMethods } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      address,
      gender,
      dateOfBirth,
      withdrawalMethods
    });
    await user.save();
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    // For demo: return user info except password (no JWT)
    const { password: _, ...userData } = user.toObject();
    res.json({ message: 'Login successful', user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all users (for admin/testing)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};