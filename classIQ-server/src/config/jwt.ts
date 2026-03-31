import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

export const signToken = (payload: { id: string; role: string }) => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is missing");
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is missing");
  }

  return jwt.verify(token, env.JWT_SECRET) as {
    id: string;
    role: string;
  };
};