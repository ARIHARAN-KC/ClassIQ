import { Request, Response } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import Class from "./classModel.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../middleware/error.js";
import { logSecurityEvent } from "../../utils/logger.js";

// Utility: Generate Join Code
const generateJoinCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
};

// Utility: Check user exists in populated/non-populated array
const hasUser = (arr: any[], userId: string) => {
  return arr.some((x: any) =>
    (x?._id ? x._id.toString() : x.toString()) === userId
  );
};

// CREATE CLASS (Teacher Only)
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { title, description } = req.body;

  if (!title || title.trim().length < 3) {
    throw new ApiError(400, "Class title must be at least 3 characters");
  }

  if (title.trim().length > 100) {
    throw new ApiError(400, "Class title cannot exceed 100 characters");
  }

  if (description && description.trim().length > 2000) {
    throw new ApiError(400, "Description cannot exceed 2000 characters");
  }

  // collision-safe joinCode generation
  let joinCode = "";
  let tries = 0;

  while (tries < 5) {
    joinCode = generateJoinCode();
    const exists = await Class.findOne({ joinCode });
    if (!exists) break;
    tries++;
  }

  if (!joinCode) {
    throw new ApiError(500, "Failed to generate join code. Try again.");
  }

  const newClass = await Class.create({
    title: title.trim(),
    description: description?.trim(),
    teachers: [new mongoose.Types.ObjectId(req.user.id)],
    joinCode,
  });

  logSecurityEvent("CLASS_CREATED", req.user.id, "Teacher created a new class", {
    classId: newClass._id.toString(),
    joinCode: newClass.joinCode,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Class created successfully", newClass));
});

// JOIN CLASS (Student Only)
export const joinClass = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  let { joinCode } = req.body;

  if (!joinCode) throw new ApiError(400, "Join code is required");

  joinCode = String(joinCode).trim().toUpperCase();

  if (joinCode.length < 4 || joinCode.length > 10) {
    throw new ApiError(400, "Invalid join code format");
  }

  const classData = await Class.findOne({ joinCode });

  if (!classData) throw new ApiError(404, "Invalid join code");

  const alreadyTeacher = hasUser(classData.teachers as any[], req.user.id);
  if (alreadyTeacher) {
    throw new ApiError(400, "You are already a teacher of this class");
  }

  const alreadyJoined = hasUser(classData.students as any[], req.user.id);
  if (alreadyJoined) {
    throw new ApiError(400, "Already joined this class");
  }

  classData.students.push(new mongoose.Types.ObjectId(req.user.id));
  await classData.save();

  logSecurityEvent("CLASS_JOINED", req.user.id, "Student joined a class", {
    classId: classData._id.toString(),
    joinCode,
  });

  res.json(new ApiResponse(200, "Joined class successfully", classData));
});

// GET ALL CLASSES
export const getAllClasses = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  // Admin can view all
  if (req.user.role === "admin") {
    const classes = await Class.find()
      .populate("teachers", "name email role")
      .populate("students", "name email role");

    return res.json(new ApiResponse(200, "Classes fetched successfully", classes));
  }

  let classes;

  if (req.user.role === "teacher") {
    classes = await Class.find({ teachers: req.user.id }).populate(
      "students",
      "name email role"
    );
  } else {
    classes = await Class.find({ students: req.user.id }).populate(
      "teachers",
      "name email role"
    );
  }

  res.json(new ApiResponse(200, "Classes fetched successfully", classes));
});

// GET CLASS BY ID
export const getClassById = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId)
      .populate("teachers", "name email role")
      .populate("students", "name email role");

    if (!classData) throw new ApiError(404, "Class not found");

    if (req.user.role === "admin") {
      return res.json(new ApiResponse(200, "Class fetched successfully", classData));
    }

    const isTeacher = hasUser(classData.teachers as any[], req.user.id);
    const isStudent = hasUser(classData.students as any[], req.user.id);

    if (!isTeacher && !isStudent) {
      throw new ApiError(403, "Forbidden. You are not part of this class.");
    }

    res.json(new ApiResponse(200, "Class fetched successfully", classData));
  }
);

// UPDATE CLASS (Teacher only)
export const updateClass = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId);

    if (!classData) throw new ApiError(404, "Class not found");

    const isTeacher = hasUser(classData.teachers as any[], req.user.id);

    if (!isTeacher) {
      throw new ApiError(403, "You are not allowed to update this class");
    }

    const { title, description } = req.body;

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 100
      ) {
        throw new ApiError(400, "Title must be between 3 and 100 characters");
      }
      classData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        throw new ApiError(400, "Description must be a string");
      }

      if (description.trim().length > 2000) {
        throw new ApiError(400, "Description cannot exceed 2000 characters");
      }

      classData.description = description.trim();
    }

    await classData.save();

    logSecurityEvent("CLASS_UPDATED", req.user.id, "Teacher updated a class", {
      classId,
    });

    res.json(new ApiResponse(200, "Class updated successfully", classData));
  }
);

// DELETE CLASS (Teacher only)
export const deleteClass = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId);

    if (!classData) throw new ApiError(404, "Class not found");

    const isTeacher = hasUser(classData.teachers as any[], req.user.id);

    if (!isTeacher) {
      throw new ApiError(403, "You are not allowed to delete this class");
    }

    await classData.deleteOne();

    logSecurityEvent("CLASS_DELETED", req.user.id, "Teacher deleted a class", {
      classId,
    });

    res.json(new ApiResponse(200, "Class deleted successfully", null));
  }
);