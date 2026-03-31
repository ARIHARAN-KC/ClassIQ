import { Request, Response } from "express";
import mongoose from "mongoose";
import * as assignmentService from "./assignmentService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToDrive, deleteFromDrive } from "../../utils/driveUpload.js";
import { logSecurityEvent, logError } from "../../utils/logger.js";
import { asyncHandler } from "../../middleware/error.js";

// Safe string getter
const getString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] || "";
  return "";
};

// Safe number getter
const getNumber = (value: unknown): number | null => {
  const n = Number(getString(value));
  return isNaN(n) ? null : n;
};

// ================= CREATE =================
export const createAssignment = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const classId = req.params.classId;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID format");
    }

    const { title, description, dueDate, totalMarks } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      throw new ApiError(400, "Assignment title must be at least 3 characters");
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      throw new ApiError(
        400,
        "Assignment description must be at least 10 characters"
      );
    }

    if (!dueDate) {
      throw new ApiError(400, "Due date is required");
    }

    const dueDateObj = new Date(dueDate);

    if (isNaN(dueDateObj.getTime())) {
      throw new ApiError(400, "Invalid due date format");
    }

    if (dueDateObj <= new Date()) {
      throw new ApiError(400, "Due date must be in the future");
    }

    const marks = totalMarks ? Number(totalMarks) : 100;

    if (isNaN(marks) || marks < 0 || marks > 1000) {
      throw new ApiError(400, "Total marks must be between 0 and 1000");
    }

    const attachments: {
      fileId: string;
      fileName: string;
      mimeType: string;
      url?: string;
      viewUrl?: string;
    }[] = [];

    const files = req.files as Express.Multer.File[] | undefined;

    if (files?.length) {
      if (files.length > 5) throw new ApiError(400, "Maximum 5 files allowed");

      for (const file of files) {
        const uploaded = await uploadToDrive(
          file.buffer,
          file.originalname,
          file.mimetype
        );

        attachments.push({
          fileId: uploaded.fileId,
          fileName: uploaded.fileName,
          mimeType: uploaded.mimeType,
          url: uploaded.url,
          viewUrl: uploaded.viewUrl,
        });

        logSecurityEvent("FILE_UPLOADED", req.user.id, "File uploaded", {
          fileName: file.originalname,
          classId,
        });
      }
    }

    const assignment = await assignmentService.createAssignmentService(
      classId,
      req.user.id,
      {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDateObj,
        totalMarks: marks,
        attachments,
      }
    );

    logSecurityEvent("ASSIGNMENT_CREATED", req.user.id, "New assignment created", {
      assignmentId: assignment._id.toString(),
      classId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Assignment created successfully", assignment));
  }
);

// ================= GET BY CLASS =================
export const getAssignmentsByClass = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const classId = req.params.classId;

    const page = getNumber(req.query.page) || 1;
    const limit = Math.min(getNumber(req.query.limit) || 10, 50);

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID format");
    }

    if (page < 1) throw new ApiError(400, "Page must be >= 1");

    const assignments = await assignmentService.getAssignmentsByClassService(
      classId,
      req.user.id,
      page,
      limit
    );

    res.json(new ApiResponse(200, "Assignments fetched successfully", assignments));
  }
);

// ================= GET SINGLE =================
export const getAssignmentById = asyncHandler(
  async (req: Request<{ assignmentId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const assignmentId = req.params.assignmentId;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment ID format");
    }

    const assignment = await assignmentService.getAssignmentByIdService(
      assignmentId,
      req.user.id
    );

    res.json(new ApiResponse(200, "Assignment fetched successfully", assignment));
  }
);

// ================= UPDATE =================
export const updateAssignment = asyncHandler(
  async (req: Request<{ assignmentId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const assignmentId = req.params.assignmentId;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment ID format");
    }

    const { title, description, dueDate, totalMarks, isPublished } = req.body;

    const updateData: Record<string, any> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        throw new ApiError(400, "Title must be at least 3 characters");
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length < 10) {
        throw new ApiError(400, "Description must be at least 10 characters");
      }
      updateData.description = description.trim();
    }

    if (dueDate !== undefined) {
      const dueDateObj = new Date(dueDate);

      if (isNaN(dueDateObj.getTime())) {
        throw new ApiError(400, "Invalid due date format");
      }

      if (dueDateObj <= new Date()) {
        throw new ApiError(400, "Due date must be in the future");
      }

      updateData.dueDate = dueDateObj;
    }

    if (totalMarks !== undefined) {
      const marks = Number(totalMarks);

      if (isNaN(marks) || marks < 0 || marks > 1000) {
        throw new ApiError(400, "Total marks must be between 0 and 1000");
      }

      updateData.totalMarks = marks;
    }

    if (isPublished !== undefined) {
      if (typeof isPublished === "boolean") {
        updateData.isPublished = isPublished;
      } else if (isPublished === "true") {
        updateData.isPublished = true;
      } else if (isPublished === "false") {
        updateData.isPublished = false;
      } else {
        throw new ApiError(400, "isPublished must be true or false");
      }
    }

    const updated = await assignmentService.updateAssignmentService(
      assignmentId,
      req.user.id,
      updateData
    );

    logSecurityEvent("ASSIGNMENT_UPDATED", req.user.id, "Assignment updated", {
      assignmentId,
    });

    res.json(new ApiResponse(200, "Assignment updated successfully", updated));
  }
);

// ================= DELETE =================
export const deleteAssignment = asyncHandler(
  async (req: Request<{ assignmentId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const assignmentId = req.params.assignmentId;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment ID format");
    }

    const deletedAssignment = await assignmentService.deleteAssignmentService(
      assignmentId,
      req.user.id
    );

    if (deletedAssignment.attachments?.length) {
      for (const attachment of deletedAssignment.attachments) {
        try {
          await deleteFromDrive(attachment.fileId);
        } catch (err) {
          logError("Failed to delete file from drive", {
            fileId: attachment.fileId,
            assignmentId,
          });
        }
      }
    }

    logSecurityEvent("ASSIGNMENT_DELETED", req.user.id, "Assignment deleted", {
      assignmentId,
    });

    res.json(new ApiResponse(200, "Assignment deleted successfully", null));
  }
);