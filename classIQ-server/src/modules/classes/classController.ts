import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import Class from "./classModel.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Utility: Generate Join Code
const generateJoinCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Create Class (Teacher Only)
export const createClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { title, description } = req.body;

    if (!title) {
      throw new ApiError(400, "Class title is required");
    }

    const joinCode = generateJoinCode();

    const newClass = await Class.create({
      title,
      description,
      teachers: [req.user.id],
      joinCode,
    });

    return res.status(201).json(
      new ApiResponse(201, "Class created successfully", newClass)
    );
  } catch (error) {
    next(error);
  }
};

// Join Class (Student Only via joinCode)
export const joinClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { joinCode } = req.body;

    if (!joinCode) {
      throw new ApiError(400, "Join code is required");
    }

    const classData = await Class.findOne({ joinCode });

    if (!classData) {
      throw new ApiError(404, "Invalid join code");
    }

    const alreadyJoined = classData.students.some(
      (studentId) => studentId.toString() === req.user!.id
    );

    if (alreadyJoined) {
      throw new ApiError(400, "Already joined this class");
    }

    classData.students.push(
      new mongoose.Types.ObjectId(req.user.id)
    );

    await classData.save();

    return res.json(
      new ApiResponse(200, "Joined class successfully", classData)
    );
  } catch (error) {
    next(error);
  }
};

// Get All Classes (Dashboard Based on Role)
export const getAllClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    let classes;

    if (req.user.role === "teacher") {
      classes = await Class.find({
        teachers: req.user.id,
      })
        .populate("students", "name email");
    } else {
      classes = await Class.find({
        students: req.user.id,
      })
        .populate("teachers", "name email");
    }

    return res.json(
      new ApiResponse(200, "Classes fetched successfully", classes)
    );
  } catch (error) {
    next(error);
  }
};

//Get Single Class
export const getClassById = async (
  req: Request<{ classId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId)
      .populate("teachers", "name email")
      .populate("students", "name email");

    if (!classData) {
      throw new ApiError(404, "Class not found");
    }

    return res.json(
      new ApiResponse(200, "Class fetched successfully", classData)
    );
  } catch (error) {
    next(error);
  }
};

// Utility: Check Teacher Ownership
const isTeacherOfClass = (classData: any, userId: string) => {
  return classData.teachers.some(
    (teacherId: mongoose.Types.ObjectId) =>
      teacherId.toString() === userId
  );
};

// Update Class (Teacher & Owner Only)
export const updateClass = async (
  req: Request<{ classId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      throw new ApiError(404, "Class not found");
    }

    if (!isTeacherOfClass(classData, req.user.id)) {
      throw new ApiError(403, "You are not allowed to update this class");
    }

    const { title, description } = req.body;

    if (title) classData.title = title;
    if (description) classData.description = description;

    await classData.save();

    return res.json(
      new ApiResponse(200, "Class updated successfully", classData)
    );
  } catch (error) {
    next(error);
  }
};

// Delete Class (Teacher & Owner Only)
export const deleteClass = async (
  req: Request<{ classId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      throw new ApiError(404, "Class not found");
    }

    if (!isTeacherOfClass(classData, req.user.id)) {
      throw new ApiError(403, "You are not allowed to delete this class");
    }

    await classData.deleteOne();

    return res.json(
      new ApiResponse(200, "Class deleted successfully", null)
    );
  } catch (error) {
    next(error);
  }
};