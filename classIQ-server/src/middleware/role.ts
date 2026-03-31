import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden. You don't have permission."));
    }

    next();
  };