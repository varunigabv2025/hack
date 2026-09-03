const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const profileRoutes = require('./routes/profileRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const loanRoutes = require('./routes/loanRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const goalRoutes = require('./routes/goalRoutes');
const nudgeRoutes = require('./routes/nudge');
const schemesRoutes = require('./routes/schemes');
const demoRoutes = require('./routes/demo');
const voiceRoutes = require('./routes/voice');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes (Member 1 pipeline)
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/goals', goalRoutes);
app.use('/goals', goalRoutes);

// Member 4 AI nudge / schemes / demo (paths match frontend Vite proxy)
app.use('/nudge', nudgeRoutes);
app.use('/schemes', schemesRoutes);
app.use('/demo', demoRoutes);
app.use('/voice', voiceRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
