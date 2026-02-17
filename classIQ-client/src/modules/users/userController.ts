import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getMe = (req: Request, res: Response) => {
  return res.json(
    new ApiResponse(200, "User fetched successfully", req.user)
  );
};

export const teacherDashboard = (_req: Request, res: Response) => {
  return res.json(
    new ApiResponse(200, "Welcome Teacher!!!", null)
  );
};

export const studentDashboard = (_req: Request, res: Response) => {
  return res.json(
    new ApiResponse(200, "Welcome Student!!!", null)
  );
};
