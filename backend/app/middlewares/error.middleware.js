const ApiError = require('../utils/ApiError');

/**
 * Error handling middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Handle ApiError instances
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = 400;
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
    } else if (err.name === 'CastError') {
        // Mongoose cast error (invalid ObjectId)
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.code === 11000) {
        // Mongoose duplicate key error
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `Duplicate value for ${field}`;
    } else {
        // Unknown error
        statusCode = statusCode || 500;
        message = message || 'Internal Server Error';
    }

    const response = {
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
