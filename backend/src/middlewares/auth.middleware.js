import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { CONFIG } from "../config/index.js";

/**
 * Enhanced Authentication middleware with proper configuration
 * Verifies JWT tokens and attaches the user to the request object
 * Includes multi-tenancy support and proper error handling
 */

// Middleware to verify token and attach user to request
export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookies (preferred) or authorization header
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
        code: "NO_TOKEN"
      });
    }

    // Verify the token using configuration
    const decodedToken = jwt.verify(token, CONFIG.JWT.ACCESS_TOKEN.SECRET);

    // Find the user in the database
    const user = await User.findById(decodedToken._id)
      .select("-password -refreshToken -resetPasswordToken -emailVerificationToken");
      
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact administrator.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    // Add user to request object for later use
    req.user = {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      schoolId: user.schoolId,
      isEmailVerified: user.isEmailVerified,
      assignedClasses: user.assignedClasses || [],
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    // For any other errors
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      code: "AUTH_ERROR"
    });
  }
};

// Role verification middleware with hierarchy support
export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    const userRole = req.user.role;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Role hierarchy: superAdmin > schoolAdmin > classTeacher > teacher > student
    const roleHierarchy = {
      'superAdmin': 5,
      'schoolAdmin': 4,
      'classTeacher': 3,
      'teacher': 2,
      'student': 1
    };
    
    const userRoleLevel = roleHierarchy[userRole] || 0;
    
    // Check if user's role is in the allowed roles
    if (rolesArray.includes(userRole)) {
      return next();
    }
    
    // Check role hierarchy - higher roles can access lower role routes
    const allowedRoleLevels = rolesArray.map(role => roleHierarchy[role] || 0);
    const maxAllowedLevel = Math.max(...allowedRoleLevels);
    
    if (userRoleLevel > maxAllowedLevel) {
      return next(); // Higher role can access
    }
    
    // Special case: classTeacher can access teacher routes
    if (userRole === 'classTeacher' && rolesArray.includes('teacher')) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: `Insufficient permissions. Required roles: ${rolesArray.join(', ')}`,
      code: "INSUFFICIENT_PERMISSIONS",
      userRole,
      requiredRoles: rolesArray
    });
  };
};

// Optional middleware for routes that work with or without authentication
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(); // Continue without user
    }

    try {
      const decodedToken = jwt.verify(token, CONFIG.JWT.ACCESS_TOKEN.SECRET);
      const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken -resetPasswordToken -emailVerificationToken");
        
      if (user && user.isActive !== false) {
        req.user = {
          _id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          schoolId: user.schoolId,
          isEmailVerified: user.isEmailVerified,
          assignedClasses: user.assignedClasses || [],
        };
      }
    } catch (error) {
      // Token validation failed, but we'll continue without user
      console.log("Optional auth token validation failed:", error.message);
    }
    
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue without user on error
  }
};

// Middleware to refresh access token using refresh token
export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided",
        code: "NO_REFRESH_TOKEN"
      });
    }

    // Verify refresh token
    const decodedToken = jwt.verify(refreshToken, CONFIG.JWT.REFRESH_TOKEN.SECRET);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decodedToken._id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { _id: user._id },
      CONFIG.JWT.ACCESS_TOKEN.SECRET,
      { expiresIn: CONFIG.JWT.ACCESS_TOKEN.EXPIRY }
    );

    // Set new access token in cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: CONFIG.COOKIE.HTTP_ONLY,
      secure: CONFIG.COOKIE.SECURE,
      sameSite: CONFIG.COOKIE.SAME_SITE,
      maxAge: CONFIG.COOKIE.MAX_AGE,
      domain: CONFIG.COOKIE.DOMAIN
    });

    // Add user to request
    req.user = {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      schoolId: user.schoolId,
      isEmailVerified: user.isEmailVerified,
      assignedClasses: user.assignedClasses || [],
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    console.error("Refresh token middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Token refresh error",
      code: "REFRESH_ERROR"
    });
  }
};


