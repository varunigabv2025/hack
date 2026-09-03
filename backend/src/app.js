import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Import Member 1 routes
import profileRoutes from './routes/profileRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import simulatorRoutes from './routes/simulatorRoutes.js';

// Import Member 3/4 routes
import nudgeRouter from './routes/nudge.js';
import demoRouter from './routes/demo.js';
import schemesRouter from './routes/schemes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

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
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint (for Member 4's service info)
app.get('/', (req, res) => {
  res.json({
    service: 'Resilience Engine - Backend API',
    team: 'Team ALCHEMY',
    endpoints: [
      // Member 1 endpoints
      'GET /api/health',
      'POST /api/profile',
      'GET /api/profile/:userId',
      'POST /api/transactions',
      'GET /api/transactions/:userId',
      'GET /api/dashboard/:userId',
      'POST /api/loans',
      'GET /api/loans/:userId',
      'POST /api/expenses',
      'GET /api/expenses/:userId',
      'GET /api/expenses/:userId/summary',
      'POST /api/simulator',
      // Member 4 endpoints
      'POST /nudge',
      'POST /nudge/chat',
      'GET /nudge/health',
      'POST /schemes/analyse',
      'GET /schemes/health',
      'GET /demo/profiles',
      'GET /demo/profiles/:id',
      'GET /demo/preview/:id',
    ],
  });
});

// Member 1 API Routes (with /api prefix)
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/simulator', simulatorRoutes);

// Member 3/4 Routes (no /api prefix for backward compatibility)
app.use('/nudge', nudgeRouter);
app.use('/schemes', schemesRouter);
app.use('/demo', demoRouter);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
