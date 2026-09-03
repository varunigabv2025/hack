const User = require('../models/User');

/**
 * PROFILE CONTROLLER
 * Handles user profile creation and retrieval
 */

/**
 * Create a new user profile
 * POST /api/profile
 */
const createProfile = async (req, res, next) => {
  try {
    const { user_id, name, age, occupation, state, language, monthly_expense } = req.body;

    // Validate required fields
    if (!user_id || !name || !age || !occupation || !state || !monthly_expense) {
      const error = new Error('Missing required fields: user_id, name, age, occupation, state, monthly_expense');
      error.statusCode = 400;
      error.code = 'MISSING_FIELDS';
      throw error;
    }

    // Validate age range
    if (age < 18 || age > 100) {
      const error = new Error('Age must be between 18 and 100');
      error.statusCode = 400;
      error.code = 'INVALID_AGE';
      throw error;
    }

    // Validate monthly_expense
    if (monthly_expense < 0) {
      const error = new Error('Monthly expense cannot be negative');
      error.statusCode = 400;
      error.code = 'INVALID_EXPENSE';
      throw error;
    }

    // Create user
    const user = await User.create({
      user_id,
      name,
      age,
      occupation,
      state,
      language: language || 'English',
      monthly_expense
    });

    res.status(201).json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        age: user.age,
        occupation: user.occupation,
        state: user.state,
        language: user.language,
        monthly_expense: user.monthly_expense,
        created_at: user.created_at
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile by user_id
 * GET /api/profile/:userId
 */
const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ user_id: userId });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        age: user.age,
        occupation: user.occupation,
        state: user.state,
        language: user.language,
        monthly_expense: user.monthly_expense,
        created_at: user.created_at
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getProfile
};
