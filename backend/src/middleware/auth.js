const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tokenBlacklist } = require('../utils/tokenBlacklist');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  // Check if token has been invalidated (logged out)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Not authorized, token has been invalidated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach raw token so logout can blacklist it
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
