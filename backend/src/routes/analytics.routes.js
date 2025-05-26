import express from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { requirePermission, requireOwnership } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../middlewares/permissions.middleware.js";
import { 
  getAdminAnalytics,
  getStudentAnalytics,
  getTeacherAnalytics,
  getSchoolAnalytics
} from '../controllers/analytics.controller.js';

const router = express.Router();

// Apply authentication to all routes
router.use(verifyJWT);

// Student analytics - student can view own, teachers can view their students, admins can view all
router.get('/student/:studentId', 
  checkRole(['student', 'teacher', 'classTeacher', 'schoolAdmin', 'superAdmin']),
  requireOwnership('studentId'), // Students can only view their own data
  requirePermission(PERMISSIONS.STUDENT_VIEW_OWN_REPORTS),
  getStudentAnalytics
);

// Teacher analytics - teachers can view own, admins can view all
router.get('/teacher/:teacherId',
  checkRole(['teacher', 'classTeacher', 'schoolAdmin', 'superAdmin']),
  getTeacherAnalytics
);

// School analytics - only admins
router.get('/school',
  checkRole(['schoolAdmin', 'superAdmin']),
  requirePermission(PERMISSIONS.PRINCIPAL_VIEW_ALL_REPORTS),
  getSchoolAnalytics
);

// Legacy admin analytics endpoint (for backward compatibility)
router.get('/admin',
  checkRole(['schoolAdmin', 'superAdmin']),
  requirePermission(PERMISSIONS.PRINCIPAL_VIEW_ALL_REPORTS),
  getAdminAnalytics
);

// Legacy route for backward compatibility
router.get('/v1/admin/analytics',
  checkRole(['schoolAdmin', 'superAdmin']),
  requirePermission(PERMISSIONS.PRINCIPAL_VIEW_ALL_REPORTS),
  getAdminAnalytics
);

export default router; 