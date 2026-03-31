import express from "express";
import {
  createAssignment,
  getAssignmentsByClass,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "./assignmentController.js";

import { protect } from "../../middleware/auth.js";
import { upload, validateFileSignature } from "../../middleware/upload.js";

const router = express.Router();

// Create Assignment
router.post(
  "/classes/:classId/assignments",
  protect,
  upload.array("files", 5),
  validateFileSignature,
  createAssignment
);

// Get Assignments by Class
router.get("/classes/:classId/assignments", protect, getAssignmentsByClass);

// Get Assignment Detail
router.get("/assignments/:assignmentId", protect, getAssignmentById);

// Update Assignment (no file update now, only details)
router.put("/assignments/:assignmentId", protect, updateAssignment);

// Delete Assignment
router.delete("/assignments/:assignmentId", protect, deleteAssignment);

export default router;