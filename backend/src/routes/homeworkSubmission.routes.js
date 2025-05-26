import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import { submissionUpload } from "../middlewares/fileUpload.middleware.js";
import { requirePermission, requireOwnership } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../middlewares/permissions.middleware.js";
import {
  submitHomework,
  getStudentSubmission,
  getHomeworkSubmissions,
  gradeHomeworkSubmission,
  batchGradeSubmissions,
  assessSubjectiveAnswer,
  getStudentAnalytics,
  updatePersonalizationSettings
} from "../controllers/homeworkSubmission.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);
router.use(applyTenantContext);

// Student submission routes
router.post("/:homeworkId", 
  checkRole(["student"]),
  requirePermission(PERMISSIONS.STUDENT_WRITE_SUBMISSIONS),
  submissionUpload.array('attachments', 5), // Allow up to 5 submission attachments
  submitHomework
);

router.get("/:homeworkId/student", 
  checkRole(["student"]),
  requirePermission(PERMISSIONS.STUDENT_READ_ASSESSMENTS),
  getStudentSubmission
);

// Teacher routes for managing submissions
router.get("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_VIEW_STUDENT_REPORTS),
  getHomeworkSubmissions
);

router.put("/:submissionId/grade", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_GRADE_SUBMISSIONS),
  gradeHomeworkSubmission
);

// Batch grading route
router.post("/batch-grade", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_GRADE_SUBMISSIONS),
  batchGradeSubmissions
);

// AI assessment route for subjective answers
router.post("/assess", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_GRADE_SUBMISSIONS),
  assessSubjectiveAnswer
);

// Analytics routes
router.get("/analytics/:studentId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin", "student"]), 
  requireOwnership('studentId'), // Students can only view their own analytics
  getStudentAnalytics
);

// Personalization settings routes
router.put("/settings", 
  checkRole(["student"]), 
  updatePersonalizationSettings
);

export default router; 