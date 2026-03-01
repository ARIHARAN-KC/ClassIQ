import express from "express";
import * as ai from "./aiController.js";
import { protect } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

router.post("/chat", protect, ai.chat);
router.post("/class-summary", protect, ai.classSummary);
router.post("/generate-assignment", protect, ai.generateAssignment);
router.post("/explain-assignment", protect, ai.explainAssignment);
router.post("/submission-summary", protect, ai.submissionSummary);
router.post("/generate-notes", protect,upload.single("file"), ai.generateNotes);
router.post("/voice-to-text", protect); // integrate speech service
router.post("/summarize-text", protect, ai.summarizeText);
router.post("/analyze-difficulty", protect, ai.analyzeDifficulty);
router.post("/plagiarism-check", protect, ai.plagiarismCheck);
router.post("/study-planner", protect, ai.studyPlanner);
router.post("/generate-quiz", protect, ai.generateQuiz);
router.post("/translate", protect, ai.translate);
router.post("/semantic-search", protect, ai.semanticSearch);

export default router;