import { callOpenRouter } from "./openRouterClient.js";
import { systemPrompt, structuredPrompt } from "./promptTemplates.js";

const preparePrompt = (content: string) => structuredPrompt(content).trim();

// AI Chat
export const chatService = async (message: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: message.trim() },
    ],
    { maxTokens: 700 }
  );

// Class Summary
export const classSummaryService = async (classData: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Summarize this class activity clearly:\n\n${classData}`
        ),
      },
    ],
    { maxTokens: 900 }
  );

// Generate Assignment
export const generateAssignmentService = async (
  topic: string,
  grade: number,
  difficulty: string
) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Create a ${difficulty} assignment for grade ${grade} on topic "${topic}".
Include:
- Title
- Description
- Instructions
- Questions (if needed)
- Evaluation criteria / rubric`
        ),
      },
    ],
    { maxTokens: 1300 }
  );

// Explain Assignment
export const explainAssignmentService = async (text: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Explain this assignment in simple student-friendly terms:\n\n${text}`
        ),
      },
    ],
    { maxTokens: 1000 }
  );

// Submission Summary
export const submissionSummaryService = async (submission: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Summarize this student submission clearly:\n\n${submission}`
        ),
      },
    ],
    { maxTokens: 900 }
  );

// Generate Notes
export const generateNotesService = async (text: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Convert the following content into structured study notes:\n\n${text}`
        ),
      },
    ],
    { maxTokens: 1400 }
  );

// Summarize Text
export const summarizeTextService = async (text: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: preparePrompt(`Summarize:\n\n${text}`) },
    ],
    { maxTokens: 900 }
  );

// Difficulty Analysis
export const analyzeDifficultyService = async (text: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Analyze difficulty level (Easy/Medium/Hard) and explain reasoning:\n\n${text}`
        ),
      },
    ],
    { maxTokens: 800 }
  );

// Plagiarism Check
export const plagiarismCheckService = async (text: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Check plagiarism risk and provide:
- similarity estimate (percentage)
- key suspicious parts
- recommendation

Text:
${text}`
        ),
      },
    ],
    { maxTokens: 1100 }
  );

// Study Planner
export const studyPlannerService = async (
  subjects: string[],
  hours: number,
  examDate: string
) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Create a daily study plan until exam date (${examDate}).
Subjects: ${subjects.join(", ")}
Available hours per day: ${hours}

Return output as a day-by-day plan.`
        ),
      },
    ],
    { maxTokens: 1400 }
  );

// Quiz Generator
export const generateQuizService = async (topic: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Generate 5 MCQs for topic "${topic}".
Return format:
Q1..Q5 with 4 options and highlight correct answer.`
        ),
      },
    ],
    { maxTokens: 900 }
  );

// Translation
export const translateService = async (text: string, language: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Translate into ${language}.\n\nText:\n${text}`
        ),
      },
    ],
    { maxTokens: 1000 }
  );

// Semantic Search
export const semanticSearchService = async (query: string, context: string) =>
  callOpenRouter(
    [
      { role: "system", content: systemPrompt.trim() },
      {
        role: "user",
        content: preparePrompt(
          `Find the most relevant information for query: "${query}"
from the context below.

Context:
${context}

Return:
- Best matching answer
- Supporting points
- Mention which part of context it came from`
        ),
      },
    ],
    { maxTokens: 1100 }
  );