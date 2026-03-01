import express from "express";
import {
    uploadSubmission,
    getSubmissionsByAssignment,
    gradeSubmission,
    getSubmissionById,
} from "./submissionController.js";
import { protect } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

// Upload Submission
router.post("/assignments/:assignmentId/submissions", protect, upload.array("files", 5), uploadSubmission);

// Get All Submissions (Teacher)
router.get("/assignments/:assignmentId/submissions", protect, getSubmissionsByAssignment);

// Grade
router.put("/submissions/:submissionId/grade", protect, gradeSubmission);

// Get Single
router.get("/submissions/:submissionId", protect, getSubmissionById);

export default router;