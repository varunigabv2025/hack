const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  occupation: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    enum: ['English', 'Tamil'],
    default: 'English'
  },
  monthly_expense: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
userSchema.index({ user_id: 1 });

module.exports = mongoose.model('User', userSchema);
