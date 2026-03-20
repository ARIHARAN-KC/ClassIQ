import { API } from "./auth";

// Chat API
export const sendChatMessage = (message: string) => {
    return API.post("/ai/chat", { message });
};

// Summary API
export const getClassSummary = (classNotes: string) => {
    return API.post("/ai/class-summary", { classNotes });
};

// Assignment API
export const getStudyPlan = (data: {
    topic: string;
    difficulty: string;
    classLevel: string;
}) => {
    return API.post("/ai/generate-assignment", data);
};

// Explain Assignment API
export const explainAssignment = (assignmentText: string) => {
    return API.post("/ai/explain-assignment", {
        assignmentText,
    });
};

export const generateNotes = (file: File, instructions: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("instructions", instructions);

    return API.post("/ai/generate-notes", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const checkPlagiarism = (text: string) => {
    return API.post("/ai/plagiarism-check", {
        text,
    });
};

export const generateStudyPlan = (data: {
    subjects: string[];
    examDate: string;
    hoursPerDay: number;
}) => {
    return API.post("/ai/study-planner", data);
};

export const generateQuiz = (data: {
    topic: string;
    numberOfQuestions: number;
    difficulty: string;
}) => {
    return API.post("/ai/generate-quiz", data);
};
