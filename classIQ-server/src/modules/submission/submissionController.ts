import { Request, Response } from "express";
import mongoose from "mongoose";
import * as submissionService from "./submissionService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToDrive } from "../../utils/driveUpload.js";
import { asyncHandler } from "../../middleware/error.js";
import { logSecurityEvent, logError } from "../../utils/logger.js";

// Upload Submission
export const uploadSubmission = asyncHandler(
  async (req: Request<{ assignmentId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const assignmentId = req.params.assignmentId;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment ID");
    }

    const attachments: submissionService.SubmissionAttachmentDTO[] = [];

    const files = req.files as Express.Multer.File[] | undefined;

    if (files?.length) {
      if (files.length > 5) {
        throw new ApiError(400, "Maximum 5 files allowed");
      }

      for (const file of files) {
        try {
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
        } catch (error) {
          logError("Drive upload failed", {
            assignmentId,
            userId: req.user.id,
            fileName: file.originalname,
            error: error instanceof Error ? error.message : String(error),
          });

          throw new ApiError(500, "File upload failed. Try again.");
        }
      }
    }

    const submission = await submissionService.uploadSubmissionService(
      assignmentId,
      req.user.id,
      {
        comment: req.body.comment,
        attachments,
      }
    );

    logSecurityEvent("SUBMISSION_UPLOADED", req.user.id, "Student uploaded submission", {
      assignmentId,
      submissionId: submission._id.toString(),
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Submission uploaded successfully", submission));
  }
);

// GET ALL SUBMISSIONS (Teacher)
export const getSubmissionsByAssignment = asyncHandler(
  async (req: Request<{ assignmentId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const assignmentId = req.params.assignmentId;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment ID");
    }

    const page = parseInt(String(req.query.page || "1"));
    const limit = Math.min(parseInt(String(req.query.limit || "10")), 50);

    if (page < 1) throw new ApiError(400, "Page must be >= 1");

    const submissions =
      await submissionService.getSubmissionsByAssignmentService(
        assignmentId,
        req.user.id,
        page,
        limit
      );

    res.json(new ApiResponse(200, "Submissions fetched successfully", submissions));
  }
);

// GRADE SUBMISSION
export const gradeSubmission = asyncHandler(
  async (req: Request<{ submissionId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const submissionId = req.params.submissionId;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new ApiError(400, "Invalid submission ID");
    }

    const { marksObtained, feedback } = req.body;

    const updated = await submissionService.gradeSubmissionService(
      submissionId,
      req.user.id,
      {
        marksObtained,
        feedback,
      }
    );

    res.json(new ApiResponse(200, "Submission graded successfully", updated));
  }
);

// GET SINGLE SUBMISSION
export const getSubmissionById = asyncHandler(
  async (req: Request<{ submissionId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const submissionId = req.params.submissionId;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new ApiError(400, "Invalid submission ID");
    }

    const submission = await submissionService.getSubmissionByIdService(
      submissionId,
      req.user.id
    );

    res.json(new ApiResponse(200, "Submission fetched successfully", submission));
  }
);