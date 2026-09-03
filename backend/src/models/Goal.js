const mongoose = require('mongoose');

/**
 * GOAL MODEL
 * Savings / resilience goals for gig workers.
 * Deterministic progress tracking — no AI.
 */
const goalSchema = new mongoose.Schema({
  goal_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User',
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  target: {
    type: Number,
    required: true,
    min: [1, 'Target must be at least 1'],
  },
  current: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
  },
  icon: {
    type: String,
    trim: true,
    maxlength: 8,
    default: '🎯',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

goalSchema.index({ user_id: 1, status: 1, created_at: -1 });

goalSchema.pre('save', function updateTimestamp(next) {
  this.updated_at = new Date();
  if (this.current >= this.target && this.status === 'active') {
    this.status = 'completed';
    this.current = this.target;
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
