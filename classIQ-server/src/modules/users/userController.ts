import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import User from "./userModel.js";
import Class from "../classes/classModel.js";
import { ROLES } from "../../constants/roles.js";
import { asyncHandler } from "../../middleware/error.js";
import { logSecurityEvent } from "../../utils/logger.js";

// ================= GET LOGGED-IN USER =================
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const user = await User.findById(req.user.id).select("-password").lean();

  if (!user) throw new ApiError(404, "User not found");

  return res.json(new ApiResponse(200, "User fetched successfully", user));
});

// ================= UPDATE LOGGED-IN USER =================
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { name } = req.body;

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Name is required");
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    throw new ApiError(400, "Name must be between 2 and 50 characters");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: name.trim() },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

  if (!updatedUser) throw new ApiError(404, "User not found");

  logSecurityEvent("PROFILE_UPDATED", req.user.id, "User updated profile");

  return res.json(
    new ApiResponse(200, "Profile updated successfully", updatedUser)
  );
});

// ================= GET USER BY ID (ACCESS CONTROL) =================
export const getUserById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(id).select("-password").lean();
    if (!user) throw new ApiError(404, "User not found");

    // Self or Admin
    if (req.user.id === id || req.user.role === ROLES.ADMIN) {
      return res.json(new ApiResponse(200, "User fetched successfully", user));
    }

    // Shared class access (teacher/student)
    const sharedClass = await Class.findOne({
      $and: [
        { $or: [{ teachers: req.user.id }, { students: req.user.id }] },
        { $or: [{ teachers: id }, { students: id }] },
      ],
    }).lean();

    if (!sharedClass) {
      throw new ApiError(403, "Forbidden. No shared class access.");
    }

    return res.json(new ApiResponse(200, "User fetched successfully", user));
  }
);

// ================= DASHBOARDS =================
export const teacherDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    return res.json(new ApiResponse(200, "Welcome Teacher!!!", null));
  }
);

export const studentDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    return res.json(new ApiResponse(200, "Welcome Student!!!", null));
  }
);