const ApiError = require('../utils/ApiError');

/**
 * Middleware to handle 404 - Not Found errors
 * This should be placed after all routes
 */
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

module.exports = notFound;
