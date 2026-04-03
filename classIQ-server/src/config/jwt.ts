import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { ApiError } from "../utils/ApiError.js";
import type { RoleType } from "../constants/roles.js";

export interface JWTPayload {
  id: string;
  role: RoleType;
}

export const signToken = (payload: JWTPayload) => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is missing");
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is missing");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

  // Validate role is one of allowed values
  const validRoles: RoleType[] = ["teacher", "student", "admin"];
  if (!validRoles.includes(decoded.role)) {
    throw new ApiError(401, "Invalid role in token");
  }

  return decoded;
};