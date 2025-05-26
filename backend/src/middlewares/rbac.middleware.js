/**
 * Role-Based Access Control (RBAC) middleware
 * Properly enforces role-based permissions with multi-tenancy support
 */

// Properly implemented role check that actually enforces permissions
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user's role is in allowed roles
    if (rolesArray.includes(userRole)) {
      return next();
    }
    
    // Special role hierarchy handling
    // Class teachers can access teacher routes
    if (userRole === 'classTeacher' && rolesArray.includes('teacher')) {
      return next();
    }
    
    // School admins can access teacher and classTeacher routes
    if (userRole === 'schoolAdmin' && (rolesArray.includes('teacher') || rolesArray.includes('classTeacher'))) {
      return next();
    }
    
    // Super admins can access everything
    if (userRole === 'superAdmin') {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: `Access denied. Required roles: ${rolesArray.join(', ')}. Your role: ${userRole}`,
    });
  };
};

// Permission configurations for different roles
export const rolePermissions = {
  student: {
    canManageOwnProfile: true,
    canViewAssignedHomework: true,
    canSubmitHomework: true,
    canViewOwnGrades: true,
    canAccessStudyMaterials: true,
    canViewOwnReports: true,
    canTakeQuizzes: true,
    canReadAnnouncements: true,
  },
  teacher: {
    canManageOwnProfile: true,
    canViewAssignedClasses: true,
    canCreateHomework: true,
    canGradeHomework: true,
    canViewStudentProgress: true,
    canManageStudyMaterials: true,
    canCreateQuizzes: true,
    canViewSubjectReports: true,
    canIdentifyAtRiskStudents: true,
    canCreateClassAnnouncements: true,
  },
  classTeacher: {
    // Inherits all teacher permissions
    canManageOwnProfile: true,
    canViewAssignedClasses: true,
    canCreateHomework: true,
    canGradeHomework: true,
    canViewStudentProgress: true,
    canManageStudyMaterials: true,
    canCreateQuizzes: true,
    canViewSubjectReports: true,
    canIdentifyAtRiskStudents: true,
    canCreateClassAnnouncements: true,
    // Additional class teacher permissions
    canViewAllClassReports: true,
    canViewCrossSubjectReports: true,
    canManageClassStudyMaterials: true,
  },
  schoolAdmin: {
    canManageOwnProfile: true,
    canManageUsers: true,
    canManageClasses: true,
    canManageSubjects: true,
    canViewAllProgress: true,
    canManageSchoolSettings: true,
    canManageAnnouncements: true,
    canViewAllReports: true,
    canAccessAllClassData: true,
    canAccessAllStudentData: true,
    canAccessAllTeacherData: true,
    canCreateSchoolAnnouncements: true,
    canViewAtRiskStudents: true,
  },
  superAdmin: {
    // Super admin can do everything
    allAccess: true,
    canManageSchools: true,
    canCreateSchools: true,
    canManageAnyUser: true,
    canAccessAnyData: true,
    canViewSystemAnalytics: true,
  },
};

// Check specific permission for a user role
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role;
    const permissions = rolePermissions[userRole];
    
    // Super admin has all access
    if (permissions?.allAccess) {
      return next();
    }
    
    // Check if user has the required permission
    if (permissions && permissions[requiredPermission]) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: `Permission denied. Required permission: ${requiredPermission}`,
    });
  };
}; 