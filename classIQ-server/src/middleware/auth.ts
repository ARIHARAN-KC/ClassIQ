import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized. Token missing."));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized. Token missing."));
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized. Invalid or expired token."));
  }
};