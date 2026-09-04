const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * AUTH CONTROLLER
 * Handles user registration, login, logout, and authentication verification
 */

/**
 * Generate a unique user_id
 * Format: U + timestamp + random
 */
function generateUserId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `U${timestamp}${random}`.toUpperCase();
}

/**
 * Generate JWT token
 */
function generateToken(userId) {
  return jwt.sign(
    { user_id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Set JWT cookie
 */
function setTokenCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, age, occupation, state, language, monthly_expense } = req.body;

    // Validate required fields
    if (!name || !email || !password || !age || !occupation || !state || !monthly_expense) {
      const error = new Error('All required fields must be provided');
      error.statusCode = 400;
      error.code = 'MISSING_FIELDS';
      throw error;
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Please provide a valid email address');
      error.statusCode = 400;
      error.code = 'INVALID_EMAIL';
      throw error;
    }

    // Validate password strength
    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters long');
      error.statusCode = 400;
      error.code = 'WEAK_PASSWORD';
      throw error;
    }

    // Validate age
    if (age < 18 || age > 100) {
      const error = new Error('Age must be between 18 and 100');
      error.statusCode = 400;
      error.code = 'INVALID_AGE';
      throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // Generate unique user_id
    let user_id;
    let isUnique = false;
    while (!isUnique) {
      user_id = generateUserId();
      const existing = await User.findOne({ user_id });
      if (!existing) isUnique = true;
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      user_id,
      name,
      email: email.toLowerCase(),
      password_hash,
      age,
      occupation,
      state,
      language: language || 'English',
      monthly_expense
    });

    // Generate JWT token
    const token = generateToken(user.user_id);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Return safe user data
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: user.toSafeObject()
    });

  } catch (error) {
    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      error.message = `${field} is already registered`;
      error.statusCode = 409;
      error.code = 'DUPLICATE_KEY';
    }
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      error.code = 'MISSING_CREDENTIALS';
      throw error;
    }

    // Find user by email (explicitly select password_hash)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');
    
    if (!user) {
      // Generic error for security (don't reveal if email exists)
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user.user_id);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Return safe user data
    res.json({
      success: true,
      message: 'Login successful',
      user: user.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // Clear auth cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires authentication middleware
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    res.json({
      success: true,
      authenticated: true,
      user: user.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
