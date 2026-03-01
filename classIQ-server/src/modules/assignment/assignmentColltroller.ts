import { Request, Response } from "express";
import * as assignmentService from "../assignment/assignmentService.js";

// Create
export const createAssignment = async (req: any, res: Response) => {
  try {
    const classId = req.params.classId as string;

    const fileUrls =
      req.files?.map(
        (file: any) => `/uploads/${file.filename}`
      ) || [];

    const assignment = await assignmentService.createAssignmentService(
      classId,
      req.user.id,
      {
        ...req.body,
        attachments: fileUrls,
      }
    );

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get by Class
export const getAssignmentsByClass = async (req: Request, res: Response) => {
    try {
        const classId = req.params.classId as string;

        const assignments =
            await assignmentService.getAssignmentsByClassService(classId);

        res.json({
            success: true,
            data: assignments,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single
export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const assignmentId = req.params.assignmentId as string;

        const assignment =
            await assignmentService.getAssignmentByIdService(assignmentId);

        res.json({
            success: true,
            data: assignment,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update
export const updateAssignment = async (req: any, res: Response) => {
    try {
        const assignmentId = req.params.assignmentId as string;

        const updated = await assignmentService.updateAssignmentService(
            assignmentId,
            req.user.id,
            req.body
        );

        res.json({
            success: true,
            data: updated,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete
export const deleteAssignment = async (req: any, res: Response) => {
    try {
        await assignmentService.deleteAssignmentService(
            req.params.assignmentId,
            req.user.id
        );

        res.json({
            success: true,
            message: "Assignment deleted successfully",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};