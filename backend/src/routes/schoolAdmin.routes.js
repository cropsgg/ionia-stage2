import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { applyTenantContext } from "../middlewares/tenancy.middleware.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  importUsers,
} from "../controllers/schoolAdmin.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);
router.use(checkRole(["schoolAdmin"]));
router.use(applyTenantContext);

// User management routes
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser);
router.post("/users/:userId/reset-password", resetUserPassword);
router.post("/users/import", importUsers);

export default router; 