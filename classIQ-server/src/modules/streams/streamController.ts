import { Request, Response } from "express";
import mongoose from "mongoose";
import * as streamService from "./streamService.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middleware/error.js";
import { logSecurityEvent } from "../../utils/logger.js";

// CREATE STREAM
export const createStream = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    if (!content || typeof content !== "string" || content.trim().length < 2) {
      throw new ApiError(400, "Content must be at least 2 characters");
    }

    if (content.trim().length > 2000) {
      throw new ApiError(400, "Content cannot exceed 2000 characters");
    }

    const stream = await streamService.createStreamService(
      classId,
      req.user.id,
      content.trim()
    );

    logSecurityEvent("STREAM_CREATED", req.user.id, "Teacher posted announcement", {
      classId,
      streamId: stream._id.toString(),
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Stream created successfully", stream));
  }
);

// GET CLASS STREAMS
export const getClassStreams = asyncHandler(
  async (req: Request<{ classId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      throw new ApiError(400, "Invalid class ID");
    }

    const streams = await streamService.getClassStreamsService(
      classId,
      req.user.id
    );

    res.status(200).json(new ApiResponse(200, "Streams fetched successfully", streams));
  }
);

// DELETE STREAM
export const deleteStream = asyncHandler(
  async (req: Request<{ streamId: string }>, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { streamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(streamId)) {
      throw new ApiError(400, "Invalid stream ID");
    }

    await streamService.deleteStreamService(streamId, req.user.id);

    logSecurityEvent("STREAM_DELETED", req.user.id, "Stream deleted", {
      streamId,
    });

    res.json(new ApiResponse(200, "Stream deleted successfully", null));
  }
);