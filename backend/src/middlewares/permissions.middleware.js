/**
 * Comprehensive Permission System
 * Implements exact role-based permissions as specified
 */

// Define all possible permissions in the system
export const PERMISSIONS = {
  // Student Permissions
  STUDENT_READ_ASSESSMENTS: 'student:read:assessments',
  STUDENT_WRITE_SUBMISSIONS: 'student:write:submissions',
  STUDENT_TAKE_QUIZZES: 'student:take:quizzes',
  STUDENT_READ_ANNOUNCEMENTS: 'student:read:announcements',
  STUDENT_VIEW_OWN_REPORTS: 'student:view:own-reports',
  
  // Student Quiz Permissions
  STUDENT_VIEW_AVAILABLE_QUIZZES: 'student:view:available-quizzes',
  STUDENT_TAKE_QUIZ: 'student:take:quiz',
  STUDENT_SUBMIT_QUIZ_ANSWER: 'student:submit:quiz-answer',
  STUDENT_SUBMIT_QUIZ: 'student:submit:quiz',
  STUDENT_VIEW_OWN_ATTEMPTS: 'student:view:own-attempts',
  
  // Teacher Permissions
  TEACHER_CREATE_HOMEWORK: 'teacher:create:homework',
  TEACHER_CREATE_QUIZ: 'teacher:create:quiz',
  TEACHER_CREATE_ASSESSMENT: 'teacher:create:assessment',
  TEACHER_VIEW_STUDENT_REPORTS: 'teacher:view:student-reports',
  TEACHER_IDENTIFY_AT_RISK: 'teacher:identify:at-risk-students',
  TEACHER_CREATE_CLASS_ANNOUNCEMENTS: 'teacher:create:class-announcements',
  TEACHER_GRADE_SUBMISSIONS: 'teacher:grade:submissions',
  TEACHER_MANAGE_OWN_CLASSES: 'teacher:manage:own-classes',
  
  // Teacher Quiz Permissions
  TEACHER_VIEW_OWN_QUIZZES: 'teacher:view:own-quizzes',
  TEACHER_UPDATE_QUIZ: 'teacher:update:quiz',
  TEACHER_DELETE_QUIZ: 'teacher:delete:quiz',
  TEACHER_PUBLISH_QUIZ: 'teacher:publish:quiz',
  TEACHER_VIEW_QUIZ_ATTEMPTS: 'teacher:view:quiz-attempts',
  TEACHER_GRADE_QUIZ: 'teacher:grade:quiz',
  
  // Common Quiz Permissions
  VIEW_QUIZ_DETAILS: 'view:quiz-details',
  VIEW_QUIZ_ATTEMPT: 'view:quiz-attempt',
  
  // Class Teacher Additional Permissions
  CLASS_TEACHER_VIEW_ALL_CLASS_REPORTS: 'classTeacher:view:all-class-reports',
  CLASS_TEACHER_VIEW_CROSS_SUBJECT_REPORTS: 'classTeacher:view:cross-subject-reports',
  CLASS_TEACHER_MANAGE_CLASS_MATERIALS: 'classTeacher:manage:class-materials',
  CLASS_TEACHER_READ_ONLY_REPORTS: 'classTeacher:readonly:reports',
  
  // Principal (School Admin) Permissions
  PRINCIPAL_ACCESS_ALL_CLASSES: 'principal:access:all-classes',
  PRINCIPAL_ACCESS_ALL_STUDENTS: 'principal:access:all-students',
  PRINCIPAL_ACCESS_ALL_TEACHERS: 'principal:access:all-teachers',
  PRINCIPAL_VIEW_ALL_REPORTS: 'principal:view:all-reports',
  PRINCIPAL_VIEW_ALL_AT_RISK: 'principal:view:all-at-risk',
  PRINCIPAL_CREATE_SCHOOL_ANNOUNCEMENTS: 'principal:create:school-announcements',
  PRINCIPAL_MANAGE_USERS: 'principal:manage:users',
  PRINCIPAL_MANAGE_CLASSES: 'principal:manage:classes',
  PRINCIPAL_MANAGE_SUBJECTS: 'principal:manage:subjects',
  
  // Super Admin Permissions
  SUPER_ADMIN_ALL_ACCESS: 'superAdmin:all:access',
  SUPER_ADMIN_MANAGE_SCHOOLS: 'superAdmin:manage:schools',
  SUPER_ADMIN_MANAGE_ANY_USER: 'superAdmin:manage:any-user',
  SUPER_ADMIN_ACCESS_ANY_DATA: 'superAdmin:access:any-data',
};

// Define student permissions first
const STUDENT_PERMISSIONS = [
  PERMISSIONS.STUDENT_READ_ASSESSMENTS,
  PERMISSIONS.STUDENT_WRITE_SUBMISSIONS,
  PERMISSIONS.STUDENT_TAKE_QUIZZES,
  PERMISSIONS.STUDENT_READ_ANNOUNCEMENTS,
  PERMISSIONS.STUDENT_VIEW_OWN_REPORTS,
  // Quiz permissions
  PERMISSIONS.STUDENT_VIEW_AVAILABLE_QUIZZES,
  PERMISSIONS.STUDENT_TAKE_QUIZ,
  PERMISSIONS.STUDENT_SUBMIT_QUIZ_ANSWER,
  PERMISSIONS.STUDENT_SUBMIT_QUIZ,
  PERMISSIONS.STUDENT_VIEW_OWN_ATTEMPTS,
  PERMISSIONS.VIEW_QUIZ_DETAILS,
  PERMISSIONS.VIEW_QUIZ_ATTEMPT,
];

/**
 * Role-based permission mapping
 * Each role inherits permissions from lower roles
 */
export const ROLE_PERMISSIONS = {
  student: STUDENT_PERMISSIONS,
  
  teacher: [
    // All student permissions for testing/preview
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.TEACHER_CREATE_HOMEWORK,
    PERMISSIONS.TEACHER_CREATE_QUIZ,
    PERMISSIONS.TEACHER_CREATE_ASSESSMENT,
    PERMISSIONS.TEACHER_VIEW_STUDENT_REPORTS,
    PERMISSIONS.TEACHER_IDENTIFY_AT_RISK,
    PERMISSIONS.TEACHER_CREATE_CLASS_ANNOUNCEMENTS,
    PERMISSIONS.TEACHER_GRADE_SUBMISSIONS,
    PERMISSIONS.TEACHER_MANAGE_OWN_CLASSES,
    // Teacher quiz permissions
    PERMISSIONS.TEACHER_VIEW_OWN_QUIZZES,
    PERMISSIONS.TEACHER_UPDATE_QUIZ,
    PERMISSIONS.TEACHER_DELETE_QUIZ,
    PERMISSIONS.TEACHER_PUBLISH_QUIZ,
    PERMISSIONS.TEACHER_VIEW_QUIZ_ATTEMPTS,
    PERMISSIONS.TEACHER_GRADE_QUIZ,
  ],
  
  classTeacher: [
    // All teacher permissions
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.TEACHER_CREATE_HOMEWORK,
    PERMISSIONS.TEACHER_CREATE_QUIZ,
    PERMISSIONS.TEACHER_CREATE_ASSESSMENT,
    PERMISSIONS.TEACHER_VIEW_STUDENT_REPORTS,
    PERMISSIONS.TEACHER_IDENTIFY_AT_RISK,
    PERMISSIONS.TEACHER_CREATE_CLASS_ANNOUNCEMENTS,
    PERMISSIONS.TEACHER_GRADE_SUBMISSIONS,
    PERMISSIONS.TEACHER_MANAGE_OWN_CLASSES,
    // Teacher quiz permissions
    PERMISSIONS.TEACHER_VIEW_OWN_QUIZZES,
    PERMISSIONS.TEACHER_UPDATE_QUIZ,
    PERMISSIONS.TEACHER_DELETE_QUIZ,
    PERMISSIONS.TEACHER_PUBLISH_QUIZ,
    PERMISSIONS.TEACHER_VIEW_QUIZ_ATTEMPTS,
    PERMISSIONS.TEACHER_GRADE_QUIZ,
    // Additional class teacher permissions
    PERMISSIONS.CLASS_TEACHER_VIEW_ALL_CLASS_REPORTS,
    PERMISSIONS.CLASS_TEACHER_VIEW_CROSS_SUBJECT_REPORTS,
    PERMISSIONS.CLASS_TEACHER_MANAGE_CLASS_MATERIALS,
    PERMISSIONS.CLASS_TEACHER_READ_ONLY_REPORTS,
  ],
  
  schoolAdmin: [
    // All teacher and class teacher permissions
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.TEACHER_CREATE_HOMEWORK,
    PERMISSIONS.TEACHER_CREATE_QUIZ,
    PERMISSIONS.TEACHER_CREATE_ASSESSMENT,
    PERMISSIONS.TEACHER_VIEW_STUDENT_REPORTS,
    PERMISSIONS.TEACHER_IDENTIFY_AT_RISK,
    PERMISSIONS.TEACHER_CREATE_CLASS_ANNOUNCEMENTS,
    PERMISSIONS.TEACHER_GRADE_SUBMISSIONS,
    PERMISSIONS.TEACHER_MANAGE_OWN_CLASSES,
    // Teacher quiz permissions
    PERMISSIONS.TEACHER_VIEW_OWN_QUIZZES,
    PERMISSIONS.TEACHER_UPDATE_QUIZ,
    PERMISSIONS.TEACHER_DELETE_QUIZ,
    PERMISSIONS.TEACHER_PUBLISH_QUIZ,
    PERMISSIONS.TEACHER_VIEW_QUIZ_ATTEMPTS,
    PERMISSIONS.TEACHER_GRADE_QUIZ,
    PERMISSIONS.CLASS_TEACHER_VIEW_ALL_CLASS_REPORTS,
    PERMISSIONS.CLASS_TEACHER_VIEW_CROSS_SUBJECT_REPORTS,
    PERMISSIONS.CLASS_TEACHER_MANAGE_CLASS_MATERIALS,
    PERMISSIONS.CLASS_TEACHER_READ_ONLY_REPORTS,
    // Principal specific permissions
    PERMISSIONS.PRINCIPAL_ACCESS_ALL_CLASSES,
    PERMISSIONS.PRINCIPAL_ACCESS_ALL_STUDENTS,
    PERMISSIONS.PRINCIPAL_ACCESS_ALL_TEACHERS,
    PERMISSIONS.PRINCIPAL_VIEW_ALL_REPORTS,
    PERMISSIONS.PRINCIPAL_VIEW_ALL_AT_RISK,
    PERMISSIONS.PRINCIPAL_CREATE_SCHOOL_ANNOUNCEMENTS,
    PERMISSIONS.PRINCIPAL_MANAGE_USERS,
    PERMISSIONS.PRINCIPAL_MANAGE_CLASSES,
    PERMISSIONS.PRINCIPAL_MANAGE_SUBJECTS,
  ],
  
  superAdmin: [
    PERMISSIONS.SUPER_ADMIN_ALL_ACCESS,
    PERMISSIONS.SUPER_ADMIN_MANAGE_SCHOOLS,
    PERMISSIONS.SUPER_ADMIN_MANAGE_ANY_USER,
    PERMISSIONS.SUPER_ADMIN_ACCESS_ANY_DATA,
  ],
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (userRole, requiredPermission) => {
  // Super admin has all permissions
  if (userRole === 'superAdmin') {
    return true;
  }
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (userRole, requiredPermissions) => {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (userRole, requiredPermissions) => {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Middleware to check specific permission
 */
export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.role;
    
    if (!hasPermission(userRole, requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${requiredPermission}`,
        userRole,
        requiredPermission,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 */
export const requireAnyPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.role;
    
    if (!hasAnyPermission(userRole, requiredPermissions)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
        userRole,
        requiredPermissions,
      });
    }

    next();
  };
};

/**
 * Middleware to check resource ownership for students
 * Students can only access their own data
 */
export const requireOwnership = (resourceField = 'studentId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = req.user.role;
    const userId = req.user._id;

    // Super admin and school admin can access any resource
    if (userRole === 'superAdmin' || userRole === 'schoolAdmin') {
      return next();
    }

    // For students, check ownership
    if (userRole === 'student') {
      const resourceUserId = req.params[resourceField] || req.body[resourceField] || req.query[resourceField];
      
      if (resourceUserId && resourceUserId !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own data",
        });
      }
    }

    next();
  };
};