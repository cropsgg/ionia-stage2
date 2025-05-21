import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);
router.use(applyTenantContext);

// Subject management routes
router.post("/", 
  checkRole(["schoolAdmin"]), 
  createSubject
);

router.get("/", 
  checkRole(["schoolAdmin", "teacher", "classTeacher"]), 
  getAllSubjects
);

router.get("/:subjectId", 
  checkRole(["schoolAdmin", "teacher", "classTeacher"]), 
  getSubjectById
);

router.put("/:subjectId", 
  checkRole(["schoolAdmin"]), 
  updateSubject
);

router.delete("/:subjectId", 
  checkRole(["schoolAdmin"]), 
  deleteSubject
);

export default router; 