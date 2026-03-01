import express from "express";
import {
    createAssignment,
    getAssignmentsByClass,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
} from "../assignment/assignmentColltroller.js";
import { protect } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

// Create Assignment with file upload
router.post("/classes/:classId/assignments", protect,upload.array("files", 5), createAssignment);

// Get Assignments by Class
router.get("/classes/:classId/assignments", protect, getAssignmentsByClass);

// Get Assignment Detail
router.get("/assignments/:assignmentId", protect, getAssignmentById);

// Update Assignment
router.put("/assignments/:assignmentId", protect, updateAssignment);

// Delete Assignment
router.delete("/assignments/:assignmentId",protect,deleteAssignment);

export default router;