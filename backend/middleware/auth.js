const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../setup/database');

const JWT_SECRET = process.env.JWT_SECRET || 'xumtech-chatbot-secret-key-2024';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Login user
const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          reject(err);
        } else if (!user) {
          reject(new Error('User not found'));
        } else {
          try {
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (isValidPassword) {
              const token = generateToken(user);
              resolve({
                success: true,
                user: {
                  id: user.id,
                  username: user.username,
                  role: user.role
                },
                token
              });
            } else {
              reject(new Error('Incorrect password'));
            }
          } catch (error) {
            reject(error);
          }
        }
      }
    );
  });
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Administrator permissions required.'
    });
  }
};

module.exports = {
  authenticateToken,
  loginUser,
  requireAdmin,
  generateToken
}; 