import { Router } from "express";
import {
  registerSchool,
  approveSchool,
  getAllSchools,
  getSchoolDetails,
  updateSchool,
} from "../controllers/school.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// School registration (only super-admin can register schools)
router.post(
  "/register",
  authorizeRoles(["superadmin"]),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  registerSchool
);

// Approve school registration (only super-admin)
router.patch(
  "/approve/:schoolId",
  authorizeRoles(["superadmin"]),
  approveSchool
);

// Get all schools (only super-admin)
router.get(
  "/all",
  authorizeRoles(["superadmin"]),
  getAllSchools
);

// Get school details (super-admin and school-admin)
router.get(
  "/:identifier",
  authorizeRoles(["superadmin", "SCHOOL_ADMIN"]),
  getSchoolDetails
);

// Update school (super-admin and school-admin of that school)
router.patch(
  "/:schoolId",
  authorizeRoles(["superadmin", "SCHOOL_ADMIN"]),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateSchool
);

export default router; 