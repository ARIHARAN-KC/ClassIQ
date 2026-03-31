import axios from "axios";
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import { logError } from "../../utils/logger.js";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export const callOpenRouter = async (
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) => {
  try {
    if (!env.OPENROUTER_API_KEY) {
      throw new ApiError(500, "Missing OpenRouter API key");
    }

    const model = env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 800,
      },
      {
        timeout: 30000,
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",

          // recommended headers
          "HTTP-Referer": env.FRONTEND_URL,
          "X-Title": "ClassIQ AI Service",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new ApiError(500, "AI response is empty");
    }

    return content.trim();
  } catch (error: any) {
    const status = error?.response?.status;
    const errorData = error?.response?.data;

    logError("OpenRouter API Error", {
      status,
      message: error?.message,
      response: errorData,
    });

    if (status === 401) {
      throw new ApiError(500, "AI service authentication failed");
    }

    if (status === 429) {
      throw new ApiError(429, "AI rate limit exceeded. Try again later.");
    }

    if (status === 400) {
      throw new ApiError(400, "Bad AI request. Check prompt format.");
    }

    throw new ApiError(500, "AI service failed. Please try again later.");
  }
};