import { Request, Response } from "express";
import * as submissionService from "./submissionService.js";

// Upload
export const uploadSubmission = async (req: any, res: Response) => {
    try {
        const assignmentId = req.params.assignmentId;

        const fileUrls =
            req.files?.map((file: any) => `/uploads/${file.filename}`) || [];

        const submission = await submissionService.uploadSubmissionService(
            assignmentId,
            req.user.id,
            {
                comment: req.body.comment,
                attachments: fileUrls,
            }
        );

        res.status(201).json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All
export const getSubmissionsByAssignment = async (
    req: any,
    res: Response
) => {
    try {
        const submissions =
            await submissionService.getSubmissionsByAssignmentService(
                req.params.assignmentId,
                req.user.id
            );

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Grade
export const gradeSubmission = async (req: any, res: Response) => {
    try {
        const updated =
            await submissionService.gradeSubmissionService(
                req.params.submissionId,
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

// Get Single
export const getSubmissionById = async (
    req: any,
    res: Response
) => {
    try {
        const submission =
            await submissionService.getSubmissionByIdService(
                req.params.submissionId,
                req.user.id
            );

        res.json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};