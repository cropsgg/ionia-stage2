import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
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
  createHomework
);

router.get("/", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  getTeacherHomework
);

router.get("/student", 
  checkRole(["student"]), 
  getStudentHomework
);

router.get("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin", "student"]), 
  getHomeworkById
);

router.put("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  updateHomework
);

router.delete("/:homeworkId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  deleteHomework
);

// Personalization routes
router.post("/personalize/:classId", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  createPersonalizedHomework
);

// Statistics routes
router.get("/:homeworkId/stats", 
  checkRole(["teacher", "classTeacher", "schoolAdmin"]), 
  getHomeworkStats
);

export default router; 