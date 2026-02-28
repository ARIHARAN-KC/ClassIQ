import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { authorize } from "../../middleware/role.js";
import { ROLES } from "../../constants/roles.js";
import * as userController from "./userController.js";

const router = Router();

// Logged-in user
router.get("/me", protect, userController.getMe);
router.put("/me", protect, userController.updateMe);

// Get user by ID (any logged-in user for now)
router.get("/:id", protect, userController.getUserById);

// Only teacher
router.get(
  "/teacher-dashboard",
  protect,
  authorize(ROLES.TEACHER),
  userController.teacherDashboard
);

// Only student
router.get(
  "/student-dashboard",
  protect,
  authorize(ROLES.STUDENT),
  userController.studentDashboard
);

export default router;
