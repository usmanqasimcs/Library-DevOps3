
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password 
    });
    
    await user.save();
    console.log('User created successfully:', user.email);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful:', user.email);

    // Generate token
    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
