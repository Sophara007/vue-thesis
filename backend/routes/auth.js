const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check authentication route
router.get('/check-auth', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    jwt.verify(token, 'secretKey', async (err, decodedToken) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ error: 'Token expired' });
        } else {
          return res.status(401).json({ error: 'Invalid token' });
        }
      }

      // Token is valid, fetch user data from the database based on decodedToken.userId
      try {
        const user = await User.findById(decodedToken.userId);
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }

        // Send user data along with the response
        res.status(200).json({ user });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Perform any necessary cleanup or actions related to logging out here

  res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;
