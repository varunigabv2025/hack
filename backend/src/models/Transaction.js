const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: {
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
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
transactionSchema.index({ user_id: 1, date: -1 });
transactionSchema.index({ transaction_id: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
