const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'placeholder_secret_change_me_in_production');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed', errorCode: 'AUTH_FAILED' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token', errorCode: 'NO_TOKEN' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this route', 
        errorCode: 'FORBIDDEN' 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
