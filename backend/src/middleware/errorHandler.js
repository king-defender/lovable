/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    error: 'Internal server error',
    message: err.message
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = {
      success: false,
      error: 'Validation Error',
      message: messages.join(', ')
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      success: false,
      error: 'Duplicate Error',
      message: `${field} already exists`
    };
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      error: 'Invalid Token',
      message: 'Please provide a valid token'
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      error: 'Token Expired',
      message: 'Token has expired'
    };
    return res.status(401).json(error);
  }

  // Supabase errors
  if (err.code && err.code.startsWith('PGRST')) {
    switch (err.code) {
      case 'PGRST116':
        error = {
          success: false,
          error: 'Not Found',
          message: 'Resource not found'
        };
        return res.status(404).json(error);
      default:
        error = {
          success: false,
          error: 'Database Error',
          message: err.message
        };
        return res.status(400).json(error);
    }
  }

  // OpenAI API errors
  if (err.status && err.type === 'invalid_request_error') {
    error = {
      success: false,
      error: 'AI Service Error',
      message: 'Invalid request to AI service'
    };
    return res.status(400).json(error);
  }

  if (err.status === 429) {
    error = {
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.'
    };
    return res.status(429).json(error);
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete error.message;
  }

  res.status(statusCode).json(error);
};