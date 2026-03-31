import type { Request, Response, NextFunction } from "express";

import * as ai from "./aiService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middleware/error.js";
import { logSecurityEvent } from "../../utils/logger.js";
import { extractTextFromFileBuffer } from "./aiHelpers.js";

export const chat = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    throw new ApiError(400, "Message is required");
  }

  if (message.trim().length < 2) {
    throw new ApiError(400, "Message must be at least 2 characters");
  }

  if (message.trim().length > 5000) {
    throw new ApiError(400, "Message exceeds maximum length (5000 chars)");
  }

  const result = await ai.chatService(message.trim());

  logSecurityEvent("AI_CHAT", req.user.id, "User used AI chat", {
    length: message.trim().length,
  });

  res.json(new ApiResponse(200, "Chat response generated", result));
});

export const classSummary = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { data } = req.body;

  if (!data || typeof data !== "string") {
    throw new ApiError(400, "Class data is required");
  }

  if (data.trim().length < 5) {
    throw new ApiError(400, "Class data must be at least 5 characters");
  }

  if (data.trim().length > 10000) {
    throw new ApiError(400, "Class data exceeds maximum length (10000 chars)");
  }

  const result = await ai.classSummaryService(data.trim());

  logSecurityEvent("AI_CLASS_SUMMARY", req.user.id, "Generated class summary", {
    length: data.trim().length,
  });

  res.json(new ApiResponse(200, "Class summary generated", result));
});

export const generateAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { topic, grade, difficulty } = req.body;

    if (!topic || !grade || !difficulty) {
      throw new ApiError(400, "Topic, grade, and difficulty are required");
    }

    if (typeof topic !== "string") {
      throw new ApiError(400, "Topic must be a string");
    }

    const trimmedTopic = topic.trim();

    if (trimmedTopic.length < 3 || trimmedTopic.length > 200) {
      throw new ApiError(400, "Topic must be between 3 and 200 characters");
    }

    const parsedGrade = parseInt(String(grade));
    const validGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    if (!validGrades.includes(parsedGrade)) {
      throw new ApiError(400, "Invalid grade level");
    }

    const validDifficulties = ["easy", "medium", "hard"];
    const normalizedDifficulty = String(difficulty).toLowerCase().trim();

    if (!validDifficulties.includes(normalizedDifficulty)) {
      throw new ApiError(400, "Difficulty must be: easy, medium, or hard");
    }

    const result = await ai.generateAssignmentService(
      trimmedTopic,
      parsedGrade,
      normalizedDifficulty
    );

    logSecurityEvent(
      "AI_ASSIGNMENT_GENERATED",
      req.user.id,
      "Generated assignment",
      {
        topic: trimmedTopic,
        grade: parsedGrade,
        difficulty: normalizedDifficulty,
      }
    );

    res.json(new ApiResponse(200, "Assignment generated", result));
  }
);

export const explainAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      throw new ApiError(400, "Text is required");
    }

    if (text.trim().length < 5) {
      throw new ApiError(400, "Text must be at least 5 characters");
    }

    if (text.trim().length > 10000) {
      throw new ApiError(400, "Text exceeds maximum length (10000 chars)");
    }

    const result = await ai.explainAssignmentService(text.trim());

    res.json(new ApiResponse(200, "Assignment explained", result));
  }
);

export const submissionSummary = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      throw new ApiError(400, "Submission text is required");
    }

    if (text.trim().length < 5) {
      throw new ApiError(400, "Submission text must be at least 5 characters");
    }

    if (text.trim().length > 10000) {
      throw new ApiError(400, "Text exceeds maximum length (10000 chars)");
    }

    const result = await ai.submissionSummaryService(text.trim());

    res.json(new ApiResponse(200, "Submission summary generated", result));
  }
);

export const generateNotes = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const { buffer, mimetype, originalname } = req.file;

    if (!buffer || buffer.length === 0) {
      throw new ApiError(400, "File is empty");
    }

    const extractedText = await extractTextFromFileBuffer(buffer, mimetype);

    if (!extractedText || extractedText.trim().length < 5) {
      throw new ApiError(400, "Not enough readable text in uploaded file");
    }

    if (extractedText.length > 50000) {
      throw new ApiError(
        400,
        "File contains too much text (limit 50000 characters)"
      );
    }

    logSecurityEvent(
      "AI_NOTES_FILE_PROCESSED",
      req.user.id,
      "File processed for notes generation",
      {
        fileName: originalname,
        mimeType: mimetype,
        extractedLength: extractedText.length,
      }
    );

    const notes = await ai.generateNotesService(extractedText.trim());

    res.json(new ApiResponse(200, "Notes generated successfully", notes));
  }
);

export const summarizeText = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      throw new ApiError(400, "Text is required");
    }

    if (text.trim().length < 5) {
      throw new ApiError(400, "Text must be at least 5 characters");
    }

    if (text.trim().length > 20000) {
      throw new ApiError(400, "Text exceeds maximum length (20000 chars)");
    }

    const result = await ai.summarizeTextService(text.trim());

    res.json(new ApiResponse(200, "Text summarized", result));
  }
);

export const analyzeDifficulty = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      throw new ApiError(400, "Text is required");
    }

    if (text.trim().length < 5) {
      throw new ApiError(400, "Text must be at least 5 characters");
    }

    if (text.trim().length > 10000) {
      throw new ApiError(400, "Text exceeds maximum length (10000 chars)");
    }

    const result = await ai.analyzeDifficultyService(text.trim());

    res.json(new ApiResponse(200, "Difficulty analyzed", result));
  }
);

export const plagiarismCheck = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      throw new ApiError(400, "Text is required");
    }

    if (text.trim().length < 5) {
      throw new ApiError(400, "Text must be at least 5 characters");
    }

    if (text.trim().length > 20000) {
      throw new ApiError(400, "Text exceeds maximum length (20000 chars)");
    }

    const result = await ai.plagiarismCheckService(text.trim());

    res.json(new ApiResponse(200, "Plagiarism check complete", result));
  }
);

export const studyPlanner = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { subjects, hours, examDate } = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      throw new ApiError(400, "Subjects must be a non-empty array");
    }

    if (subjects.length > 10) {
      throw new ApiError(400, "Maximum 10 subjects allowed");
    }

    const cleanedSubjects = subjects.map((s) => String(s).trim());

    for (const s of cleanedSubjects) {
      if (!s || s.length < 2 || s.length > 100) {
        throw new ApiError(
          400,
          "Each subject must be between 2 and 100 characters"
        );
      }
    }

    const parsedHours = Number(hours);

    if (!parsedHours || isNaN(parsedHours) || parsedHours <= 0) {
      throw new ApiError(400, "Hours must be a positive number");
    }

    if (parsedHours > 24) {
      throw new ApiError(400, "Hours cannot exceed 24");
    }

    if (!examDate) {
      throw new ApiError(400, "Exam date is required");
    }

    const examDateTime = new Date(examDate);

    if (isNaN(examDateTime.getTime())) {
      throw new ApiError(400, "Invalid exam date format");
    }

    if (examDateTime <= new Date()) {
      throw new ApiError(400, "Exam date must be in the future");
    }

    const result = await ai.studyPlannerService(
      cleanedSubjects,
      parsedHours,
      examDate
    );

    res.json(new ApiResponse(200, "Study planner generated", result));
  }
);

export const generateQuiz = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      throw new ApiError(400, "Topic is required");
    }

    if (topic.trim().length < 2 || topic.trim().length > 200) {
      throw new ApiError(400, "Topic must be between 2 and 200 characters");
    }

    const result = await ai.generateQuizService(topic.trim());

    res.json(new ApiResponse(200, "Quiz generated", result));
  }
);

export const translate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { text, language } = req.body;

  if (!text || !language) {
    throw new ApiError(400, "Text and language are required");
  }

  if (typeof text !== "string" || typeof language !== "string") {
    throw new ApiError(400, "Text and language must be strings");
  }

  if (text.trim().length < 2 || text.trim().length > 10000) {
    throw new ApiError(400, "Text must be between 2 and 10000 characters");
  }

  if (language.trim().length < 2 || language.trim().length > 50) {
    throw new ApiError(400, "Invalid language specified");
  }

  const result = await ai.translateService(text.trim(), language.trim());

  res.json(new ApiResponse(200, "Translation completed", result));
});

export const semanticSearch = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { query, context } = req.body;

    if (!query || !context) {
      throw new ApiError(400, "Query and context are required");
    }

    if (typeof query !== "string" || typeof context !== "string") {
      throw new ApiError(400, "Query and context must be strings");
    }

    if (query.trim().length < 2 || query.trim().length > 500) {
      throw new ApiError(400, "Query must be between 2 and 500 characters");
    }

    if (context.trim().length < 10 || context.trim().length > 20000) {
      throw new ApiError(400, "Context must be between 10 and 20000 characters");
    }

    const result = await ai.semanticSearchService(
      query.trim(),
      context.trim()
    );

    res.json(new ApiResponse(200, "Semantic search complete", result));
  }
);