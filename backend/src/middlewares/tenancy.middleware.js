/**
 * Multi-Tenancy Middleware
 * Ensures data isolation between different schools
 * Only super admins can access cross-school data
 */

export const applyTenantContext = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required for tenant context",
    });
  }

  const userRole = req.user.role;
  const userSchoolId = req.user.schoolId;

  // Super admins can access all schools
  if (userRole === 'superAdmin') {
    // For super admin, schoolId might come from query params or body for cross-school operations
    const targetSchoolId = req.query.schoolId || req.body.schoolId;
    
    if (targetSchoolId) {
      // Super admin accessing specific school
      req.tenantFilter = { schoolId: targetSchoolId };
      req.targetSchoolId = targetSchoolId;
    } else {
      // Super admin accessing all schools (no filter)
      req.tenantFilter = {};
      req.targetSchoolId = null;
    }
  } else {
    // Regular users can only access their own school's data
    if (!userSchoolId) {
      return res.status(403).json({
        success: false,
        message: "User must be assigned to a school",
      });
    }
    
    req.tenantFilter = { schoolId: userSchoolId };
    req.userSchoolId = userSchoolId;
    req.targetSchoolId = userSchoolId;
  }
  
  next();
};

// Middleware to validate school access for operations
export const validateSchoolAccess = (req, res, next) => {
  const userRole = req.user?.role;
  const userSchoolId = req.user?.schoolId;
  
  // Super admins can access any school
  if (userRole === 'superAdmin') {
    return next();
  }
  
  // For other users, check if they're trying to access their own school's data
  const targetSchoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;
  
  if (targetSchoolId && targetSchoolId !== userSchoolId?.toString()) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own school's data",
    });
  }
  
  next();
};

// Helper function to add tenant filter to mongoose queries
export const addTenantFilter = (query, req) => {
  if (req.tenantFilter && Object.keys(req.tenantFilter).length > 0) {
    return { ...query, ...req.tenantFilter };
  }
  return query;
};

// Middleware to ensure created documents have correct schoolId
export const ensureSchoolId = (req, res, next) => {
  const userRole = req.user?.role;
  const userSchoolId = req.user?.schoolId;
  
  // Super admins must specify schoolId for creation
  if (userRole === 'superAdmin') {
    const schoolId = req.body.schoolId || req.query.schoolId;
    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: "Super admin must specify schoolId for data creation",
      });
    }
    req.body.schoolId = schoolId;
  } else {
    // Regular users create data in their own school
    if (!userSchoolId) {
      return res.status(403).json({
        success: false,
        message: "User must be assigned to a school",
      });
    }
    req.body.schoolId = userSchoolId;
  }
  
  next();
};

// Helper function that maintains API compatibility but no longer injects tenant context
export const injectTenantContext = (query, req) => {
  // Simply return the original query without modification
  return query;
};

// Simplified protection - no longer restricts access based on tenant
export const protectTenant = (req, res, next) => {
  // Simply proceed - no tenant restriction
  next();
}; 