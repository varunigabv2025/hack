const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loan_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User',
    trim: true
  },
  loan_name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  monthly_payment: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
loanSchema.index({ user_id: 1, status: 1 });
loanSchema.index({ loan_id: 1 });

module.exports = mongoose.model('Loan', loanSchema);
