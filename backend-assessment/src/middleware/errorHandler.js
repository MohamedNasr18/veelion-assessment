const HttpError = require('../utils/httpError');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  const response = {
    error: {
      message,
    },
  };

  if (error instanceof HttpError && error.details) {
    response.error.details = error.details;
  }

  if (statusCode >= 500) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      console.error('Error details:', error);
    } else {
      console.error('Internal error occurred:', {
        message: error.message,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
