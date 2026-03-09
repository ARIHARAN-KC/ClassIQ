import { API } from "./auth";

export const sendChatMessage = (message: string) => {
    return API.post("/ai/chat", {
        message: message,
    });
};

export const getClassSummary = (classNotes: string) => {
    return API.post("/ai/class-summary", {
        classNotes: classNotes,
    });
};