import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import { homeworkUpload } from "../middlewares/fileUpload.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { PERMISSIONS } from "../middlewares/permissions.middleware.js";
import {
  createHomework,
  getTeacherHomework,
  getStudentHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
  createPersonalizedHomework,
  getHomeworkStats,
} from "../controllers/homework.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);
router.use(applyTenantContext);

// Base homework routes for teachers
router.post("/", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]),
  requirePermission(PERMISSIONS.TEACHER_CREATE_HOMEWORK),
  homeworkUpload.array('attachments', 10), // Allow up to 10 attachments
  createHomework
);

router.get("/", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_MANAGE_OWN_CLASSES),
  getTeacherHomework
);

router.get("/student", 
  checkRole(["student"]),
  requirePermission(PERMISSIONS.STUDENT_READ_ASSESSMENTS), 
  getStudentHomework
);

router.get("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin", "student"]), 
  getHomeworkById
);

router.put("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_CREATE_HOMEWORK),
  homeworkUpload.array('attachments', 10), // Allow file updates
  updateHomework
);

router.delete("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_CREATE_HOMEWORK),
  deleteHomework
);

// Personalization routes
router.post("/personalize/:classId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_CREATE_HOMEWORK),
  homeworkUpload.array('attachments', 10),
  createPersonalizedHomework
);

// Statistics routes
router.get("/:homeworkId/stats", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  requirePermission(PERMISSIONS.TEACHER_VIEW_STUDENT_REPORTS),
  getHomeworkStats
);

export default router; 