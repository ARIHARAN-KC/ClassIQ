import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/role.js";
import { ROLES } from "../../constants/roles.js";
import * as userController from "./userController.js";

const router = Router();

// Logged-in user routes
router.get("/me", protect, userController.getMe);
router.put("/me", protect, userController.updateMe);

// Dashboards
router.get(
  "/teacher-dashboard",
  protect,
  authorize(ROLES.TEACHER),
  userController.teacherDashboard
);

router.get(
  "/student-dashboard",
  protect,
  authorize(ROLES.STUDENT),
  userController.studentDashboard
);

// Get user by ID
router.get("/:id", protect, userController.getUserById);

export default router;