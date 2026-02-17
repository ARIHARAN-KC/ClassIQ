import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized. No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
};
