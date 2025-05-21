/**
 * Global error handling middleware
 */

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle different error types
  if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    const validationErrors = {};
    
    // Extract validation error messages for each field
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        validationErrors[key] = err.errors[key].message;
      });
    }
    
    return res.status(statusCode).json({
      success: false,
      message: "Validation Error",
      errors: validationErrors
    });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 400;
    message = "Duplicate key error";
    
    // Try to extract the duplicate field
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      message = `The ${field} already exists`;
    }
  }

  if (err.name === "JsonWebTokenError") {
    // JWT error
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    // JWT expired
    statusCode = 401;
    message = "Token expired";
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
}; 