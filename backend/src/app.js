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

// API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/simulator', simulatorRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
