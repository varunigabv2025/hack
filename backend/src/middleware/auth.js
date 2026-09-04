const jwt = require('jsonwebtoken');

/**
 * AUTH MIDDLEWARE
 * Verifies JWT token and attaches authenticated user to request
 */

/**
 * Authenticate user via JWT token in cookie
 * Extracts user_id from token and attaches to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.auth_token;

    if (!token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'NO_TOKEN';
      throw error;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to request
      req.user = {
        user_id: decoded.user_id
      };
      
      next();
    } catch (jwtError) {
      // Token is invalid or expired
      const error = new Error('Invalid or expired authentication token');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication
 * Like authenticate, but doesn't fail if no token present
 * Useful for routes that work with or without auth
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          user_id: decoded.user_id
        };
      } catch (jwtError) {
        // Invalid token, but we don't fail - just continue without auth
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
