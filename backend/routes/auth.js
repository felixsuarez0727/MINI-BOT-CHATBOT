const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginUser, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .escape(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // Attempt login
    const result = await loginUser(username, password);
    
    res.json({
      success: true,
              data: {
          user: result.user,
          token: result.token,
          message: 'Login successful'
        }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
          data: {
        user: req.user,
        message: 'Valid token'
      }
  });
});

// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router; 