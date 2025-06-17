import { ApiError } from "../utils/ApiError.js";
import { RolePermission } from "../models/permission.model.js";

/**
 * Middleware for role-based access control
 * @param {Array} roles - Array of roles allowed to access the endpoint
 * @returns {Function} Express middleware
 */
export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role: ${req.user.role} is not allowed to access this resource`
        )
      );
    }

    next();
  };
};

/**
 * Middleware for permission-based access control
 * @param {String} permission - Permission name required to access the endpoint
 * @returns {Function} Express middleware
 */
export const hasPermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    try {
      // Check if user role has the required permission
      // For school-specific roles, check if permission exists for their school
      const query = {
        role: req.user.role,
        permission,
      };

      // For school-specific permissions, add schoolId to the query
      if (req.user.schoolId && req.user.role !== "superadmin") {
        query.schoolId = req.user.schoolId;
      }

      const rolePermission = await RolePermission.findOne(query);

      if (!rolePermission && req.user.role !== "superadmin") {
        // Superadmin has all permissions by default
        return next(
          new ApiError(
            403,
            `You don't have permission to access this resource`
          )
        );
      }

      next();
    } catch (error) {
      return next(new ApiError(500, "Error checking permissions"));
    }
  };
};

/**
 * Middleware to check if user belongs to a specific school
 * @param {Boolean} allowSuperAdmin - Whether to allow superadmins to bypass the check
 * @returns {Function} Express middleware
 */
export const belongsToSchool = (allowSuperAdmin = true) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    // Allow superadmins to bypass if the flag is true
    if (allowSuperAdmin && req.user.role === "superadmin") {
      return next();
    }

    // Check if school ID in token matches requested school ID
    const requestedSchoolId = req.params.schoolId || req.body.schoolId;
    
    if (!requestedSchoolId) {
      return next(new ApiError(400, "School ID is required"));
    }

    if (!req.user.schoolId) {
      return next(new ApiError(403, "You don't belong to any school"));
    }

    if (req.user.schoolId.toString() !== requestedSchoolId.toString()) {
      return next(new ApiError(403, "You can only access your own school's resources"));
    }

    next();
  };
};

/**
 * Middleware to enforce tenant isolation (row-level security)
 * Ensures users can only access data from their own school/tenant
 */
export const enforceTenantIsolation = () => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    // Skip isolation for superadmin (can access all tenants)
    if (req.user.role === "superadmin") {
      return next();
    }

    // For other roles, enforce tenant isolation
    if (!req.user.schoolId && !["LEGACY_USER", "admin", "user"].includes(req.user.role)) {
      return next(new ApiError(403, "School ID is required for this operation"));
    }

    // Add schoolId filter to query params for database operations
    if (req.user.schoolId) {
      req.tenantFilter = { schoolId: req.user.schoolId };
    }

    next();
  };
}; 