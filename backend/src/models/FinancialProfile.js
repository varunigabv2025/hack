import mongoose from 'mongoose';

const financialProfileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'User',
    trim: true
  },
  
  // Income Profile (calculated by Member 2's finance engine)
  baseline: {
    type: Number,
    default: 0
  },
  volatility: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  consistency: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  trend: {
    type: String,
    enum: ['increasing', 'stable', 'declining'],
    default: 'stable'
  },
  prediction: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Savings Pocket
  surplus: {
    type: Number,
    default: 0
  },
  suggested_amount: {
    type: Number,
    default: 0
  },
  savings_streak: {
    type: Number,
    default: 0
  },
  rainy_day: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Resilience Score
  resilience_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  previous_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  score_change: {
    type: Number,
    default: 0
  },
  score_factors: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Loan Risk
  loan_risk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
financialProfileSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Indexes for faster queries
financialProfileSchema.index({ user_id: 1 });

export default mongoose.model('FinancialProfile', financialProfileSchema);

