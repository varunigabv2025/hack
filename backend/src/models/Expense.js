import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  expense_id: {
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
    min: [0, 'Amount must be positive']
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Food',
      'Transport',
      'Housing',
      'Healthcare',
      'Education',
      'Entertainment',
      'Utilities',
      'Insurance',
      'Shopping',
      'Debt Payment',
      'Savings',
      'Other'
    ]
  },
  essential: {
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
expenseSchema.index({ user_id: 1, date: -1 });
expenseSchema.index({ expense_id: 1 });
expenseSchema.index({ user_id: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);

