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
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password_hash: {
    type: String,
    required: true,
    select: false // Never include password_hash in queries by default
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
userSchema.index({ email: 1 });

// Method to safely convert user to JSON (never expose password_hash)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password_hash;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
