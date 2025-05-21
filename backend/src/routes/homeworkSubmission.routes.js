import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import {
  submitHomework,
  getStudentSubmission,
  getHomeworkSubmissions,
  gradeHomeworkSubmission,
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
  submitHomework
);

router.get("/:homeworkId/student", 
  checkRole(["student"]), 
  getStudentSubmission
);

// Teacher routes for managing submissions
router.get("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  getHomeworkSubmissions
);

router.put("/:submissionId/grade", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  gradeHomeworkSubmission
);

// AI assessment route for subjective answers
router.post("/assess", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  assessSubjectiveAnswer
);

// Analytics routes
router.get("/analytics/:studentId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin", "student"]), 
  getStudentAnalytics
);

// Personalization settings routes
router.put("/settings", 
  checkRole(["student"]), 
  updatePersonalizationSettings
);

export default router; 