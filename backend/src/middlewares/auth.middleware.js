import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * Simplified Authentication middleware
 * Verifies JWT tokens and attaches the user to the request object
 * Multi-tenant aspects have been removed while maintaining Stage 2 functionality
 */

// Middleware to verify token and attach user to request
export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from authorization header
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user in the database
    const user = await User.findById(decodedToken._id)
      .select("-password -refreshToken");
      
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact administrator.",
      });
    }

    // Add user to request object for later use - simplified without tenant aspects
    req.user = {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token expired",
      });
    }

    // For any other errors
    next(error);
  }
};

// Optional middleware - simplified without tenant aspects
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(); // Continue without user
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");
        
      if (user && user.isActive !== false) {
        req.user = {
          _id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        };
      }
    } catch (error) {
      // Token validation failed, but we'll continue without user
    }
    
    next();
  } catch (error) {
    next(error);
  }
};


