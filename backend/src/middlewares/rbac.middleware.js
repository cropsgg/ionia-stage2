/**
 * Simplified Role-Based Access Control (RBAC) middleware
 * This version maintains API compatibility but removes actual role enforcement
 * as we are removing Stage 1 code while preserving Stage 2 functionality
 */

// Simplified role check - now allows all authenticated users
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Allow any authenticated user
    return next();
  };
};

// Permission configurations are kept for compatibility
export const rolePermissions = {
  student: {
    canManageOwnProfile: true,
    canViewAssignedHomework: true,
    canSubmitHomework: true,
    canViewOwnGrades: true,
    canAccessStudyMaterials: true,
  },
  teacher: {
    canManageOwnProfile: true,
    canViewAssignedClasses: true,
    canCreateHomework: true,
    canGradeHomework: true,
    canViewStudentProgress: true,
    canManageStudyMaterials: true,
  },
  classTeacher: {
    canManageOwnProfile: true,
    canViewAssignedClasses: true,
    canCreateHomework: true,
    canGradeHomework: true,
    canViewStudentProgress: true,
    canManageStudyMaterials: true,
    canViewClassOverview: true,
  },
  schoolAdmin: {
    canManageOwnProfile: true,
    canManageUsers: true,
    canManageClasses: true,
    canManageSubjects: true,
    canViewAllProgress: true,
    canManageSchoolSettings: true,
    canManageAnnouncemnts: true,
  },
  superAdmin: {
    // superAdmin can do everything
    allAccess: true,
  },
};

// Simplified permission check - now allows all authenticated users
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Allow any authenticated user
    return next();
  };
}; 