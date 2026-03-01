import { Request, Response } from "express";
import * as streamService from "./streamService.js";

export const createStream = async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId as string;
    const { content } = req.body;
    const userId = req.user?.id as string;

    if (!classId || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const stream = await streamService.createStream(
      classId,
      userId,
      content
    );

    res.status(201).json({
      success: true,
      data: stream,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getClassStreams = async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId as string;
    const userId = req.user?.id as string;

    if (!classId || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const streams = await streamService.getClassStreams(
      classId,
      userId
    );

    res.status(200).json({
      success: true,
      data: streams,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStream = async (req: Request, res: Response) => {
  try {
    const streamId = req.params.streamId as string;
    const userId = req.user?.id as string;

    if (!streamId || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await streamService.deleteStream(
      streamId,
      userId
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};