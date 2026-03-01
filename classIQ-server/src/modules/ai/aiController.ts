import fs from "fs";
import mammoth from "mammoth"; // DOC/DOCX
import type { Request, Response } from "express";
import * as ai from "./aiService.js";
import PDFParser from "pdf2json";

// Safe decode helper
function safeDecodeURIComponent(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch (err) {
    // If malformed, just return original string
    return text;
  }
}

// Extract text from PDF using pdf2json
async function extractTextFromPDF(filePath: string): Promise<string> {
  // Dynamic import outside Promise
  const PDFParserModule = await import("pdf2json");
  const PDFParser = PDFParserModule.default;

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", err => reject(err));

    pdfParser.on("pdfParser_dataReady", pdfData => {
      let text = "";

      if (pdfData?.Pages) {
        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((t: any) => {
            t.R.forEach((r: any) => {
              text += safeDecodeURIComponent(r.T) + " ";
            });
          });
          text += "\n";
        });
      }

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}
// Extract text from any supported file
async function extractTextFromFile(filePath: string, mimetype: string): Promise<string> {
  if (mimetype === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error("Unsupported file type for text extraction");
  }
}

// Ai chat
export const chat = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.chatService(req.body.message) });

// Ai classSummary
export const classSummary = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.classSummaryService(req.body.data) });

// Ai generative assigment
export const generateAssignment = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.generateAssignmentService(req.body.topic, req.body.grade, req.body.difficulty) });

// Ai explain assignment
export const explainAssignment = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.explainAssignmentService(req.body.text) });

// ai submission summary
export const submissionSummary = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.submissionSummaryService(req.body.text) });

// ai generate notes
export const generateNotes = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    // Extract text
    const text = await extractTextFromFile(filePath, mimetype);

    // Call AI service
    const notes = await ai.generateNotesService(text);

    res.json({ success: true, data: notes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ai summarize text
export const summarizeText = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.summarizeTextService(req.body.text) });

// ai analyze difficulty
export const analyzeDifficulty = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.analyzeDifficultyService(req.body.text) });

//  ai plagiarism check
export const plagiarismCheck = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.plagiarismCheckService(req.body.text) });

// ai study planner
export const studyPlanner = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.studyPlannerService(req.body.subjects, req.body.hours, req.body.examDate) });

// ai generate quiz
export const generateQuiz = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.generateQuizService(req.body.topic) });

// ai translate
export const translate = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.translateService(req.body.text, req.body.language) });

// ai semantic search
export const semanticSearch = async (req: Request, res: Response) =>
  res.json({ success: true, data: await ai.semanticSearchService(req.body.query, req.body.context) });