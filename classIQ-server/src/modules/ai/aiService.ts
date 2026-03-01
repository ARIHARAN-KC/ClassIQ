import { callOpenRouter } from "./openRouterClient.js";
import { systemPrompt, structuredPrompt } from "./promptTemplates.js";

//AI Chat
export const chatService = async (message: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ]);

//Class Summary
export const classSummaryService = async (classData: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: structuredPrompt(`Summarize this class activity:\n${classData}`) },
  ]);

// Generate Assignment
export const generateAssignmentService = async (topic: string, grade: string, difficulty: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: structuredPrompt(`Create a ${difficulty} assignment for grade ${grade} on ${topic}. Include title, description, instructions, evaluation criteria.`) },
  ]);

//Explain Assignment
export const explainAssignmentService = async (text: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Explain this assignment in simple terms:\n${text}` },
  ]);

//Submission Summary
export const submissionSummaryService = async (submission: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Summarize this student submission:\n${submission}` },
  ]);

//Generate Notes
export const generateNotesService = async (text: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Convert this into structured study notes:\n${text}` },
  ]);

//Voice → Text handled externally
/* Summarize Text */
export const summarizeTextService = async (text: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Summarize:\n${text}` },
  ]);

//Difficulty Analysis
export const analyzeDifficultyService = async (text: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Analyze difficulty level (Easy/Medium/Hard) and explain:\n${text}` },
  ]);

//Plagiarism Check
export const plagiarismCheckService = async (text: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Check plagiarism risk and give similarity estimate:\n${text}` },
  ]);

//Study Planner
export const studyPlannerService = async (subjects: string[], hours: number, examDate: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Create daily study plan for subjects ${subjects.join(", ")} with ${hours} hours/day until ${examDate}.` },
  ]);

//Quiz Generator
export const generateQuizService = async (topic: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Generate 5 MCQs with answers for topic: ${topic}` },
  ]);

//Translation
export const translateService = async (text: string, language: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Translate into ${language}:\n${text}` },
  ]);

// Semantic Search
export const semanticSearchService = async (query: string, context: string) =>
  callOpenRouter([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Search relevant information for: "${query}" from:\n${context}` },
  ]);