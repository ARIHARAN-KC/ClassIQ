import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import User from "../users/userModel.js";

export const getMe = (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return res.json(
    new ApiResponse(200, "User fetched successfully", req.user)
  );
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.json(
      new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.json(
      new ApiResponse(200, "User fetched successfully", user)
    );
  } catch (error) {
    next(error);
  }
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
