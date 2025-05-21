import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole, checkPermission } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignSubjectsToClass,
  assignClassTeacher,
  assignTeachersToClass,
  enrollStudentsInClass,
  removeStudentsFromClass,
} from "../controllers/class.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);
router.use(applyTenantContext);

// Base class routes
router.post("/", 
  checkRole(["schoolAdmin"]), 
  createClass
);

router.get("/", 
  checkRole(["schoolAdmin", "teacher", "classTeacher"]), 
  getAllClasses
);

router.get("/:classId", 
  checkRole(["schoolAdmin", "teacher", "classTeacher"]), 
  getClassById
);

router.put("/:classId", 
  checkRole(["schoolAdmin"]), 
  updateClass
);

router.delete("/:classId", 
  checkRole(["schoolAdmin"]), 
  deleteClass
);

// Subject assignment routes
router.post("/:classId/subjects", 
  checkRole(["schoolAdmin"]), 
  assignSubjectsToClass
);

// Teacher assignment routes
router.post("/:classId/class-teacher", 
  checkRole(["schoolAdmin"]), 
  assignClassTeacher
);

router.post("/:classId/teachers", 
  checkRole(["schoolAdmin"]), 
  assignTeachersToClass
);

// Student enrollment routes
router.post("/:classId/students", 
  checkRole(["schoolAdmin", "classTeacher"]), 
  enrollStudentsInClass
);

router.delete("/:classId/students", 
  checkRole(["schoolAdmin", "classTeacher"]), 
  removeStudentsFromClass
);

export default router; 