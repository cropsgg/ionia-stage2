import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  updateSchoolStatus,
  addSchoolAdmin,
} from "../controllers/superadmin.controller.js";

const router = Router();

// Protect all super admin routes with authentication and super admin role check
router.use(verifyJWT, checkRole(["superAdmin"]));

// School management routes
router.post("/schools", createSchool);
router.get("/schools", getAllSchools);
router.get("/schools/:schoolId", getSchoolById);
router.put("/schools/:schoolId", updateSchool);
router.patch("/schools/:schoolId/status", updateSchoolStatus);
router.post("/schools/:schoolId/admins", addSchoolAdmin);

export default router; 