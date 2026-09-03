/**
 * Global error handler middleware
 * Catches all errors and returns standardized JSON response
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    code = 'VALIDATION_ERROR';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    code = 'DUPLICATE_KEY';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
