import mongoose from "mongoose";
import Submission from "./submissionModel.js";
import Assignment from "../assignment/assignmentModel.js";
import Class from "../classes/classModel.js";
import { ApiError } from "../../utils/ApiError.js";
import { logSecurityEvent, logError } from "../../utils/logger.js";

export interface SubmissionAttachmentDTO {
  fileId: string;
  fileName: string;
  mimeType: string;
  url: string;
  viewUrl: string;
}

export const uploadSubmissionService = async (
  assignmentId: string,
  userId: string,
  data: { comment?: string; attachments: SubmissionAttachmentDTO[] }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const assignment = await Assignment.findById(assignmentId).session(session);
    if (!assignment) throw new ApiError(404, "Assignment not found");

    const classroom = await Class.findById(assignment.class).session(session);
    if (!classroom) throw new ApiError(404, "Class not found");

    const isStudent = classroom.students.some(
      (studentId: mongoose.Types.ObjectId) => studentId.toString() === userId
    );

    if (!isStudent) {
      logSecurityEvent(
        "UNAUTHORIZED_SUBMISSION_ATTEMPT",
        userId,
        "Student tried to submit assignment without enrollment",
        {
          assignmentId,
          classId: assignment.class.toString(),
        }
      );

      throw new ApiError(403, "Only students of this class can submit");
    }

    // Deadline check
    if (new Date() > new Date(assignment.dueDate)) {
      throw new ApiError(400, "Assignment deadline has passed");
    }

    // Prevent duplicate submissions
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: userId,
    }).session(session);

    if (existingSubmission) {
      throw new ApiError(400, "You have already submitted this assignment");
    }

    if (data.comment && data.comment.trim().length > 5000) {
      throw new ApiError(400, "Comment is too long (max 5000 characters)");
    }

    if (!Array.isArray(data.attachments)) {
      throw new ApiError(400, "Attachments must be an array");
    }

    if (data.attachments.length > 5) {
      throw new ApiError(400, "Maximum 5 attachments allowed");
    }

    const submission = await Submission.create(
      [
        {
          assignment: new mongoose.Types.ObjectId(assignmentId),
          student: new mongoose.Types.ObjectId(userId),
          comment: data.comment?.trim(),
          attachments: data.attachments,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    logSecurityEvent("ASSIGNMENT_SUBMITTED", userId, "Student submitted assignment", {
      assignmentId,
      submissionId: submission[0]._id.toString(),
    });

    return submission[0];
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof ApiError) throw error;

    logError("Submission upload failed", {
      assignmentId,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(500, "Failed to submit assignment");
  } finally {
    session.endSession();
  }
};

// GET SUBMISSIONS BY ASSIGNMENT (Teacher Only)
export const getSubmissionsByAssignmentService = async (
  assignmentId: string,
  userId: string,
  page: number,
  limit: number
) => {
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new ApiError(404, "Assignment not found");

    const classroom = await Class.findById(assignment.class);
    if (!classroom) throw new ApiError(404, "Class not found");

    const isTeacher = classroom.teachers.some(
      (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
    );

    if (!isTeacher) {
      logSecurityEvent(
        "UNAUTHORIZED_SUBMISSION_VIEW",
        userId,
        "Non-teacher attempted to view submissions",
        { assignmentId }
      );

      throw new ApiError(403, "Only teachers can view submissions");
    }

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find({ assignment: assignmentId })
        .populate("student", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Submission.countDocuments({ assignment: assignmentId }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      submissions,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    logError("Failed to fetch submissions", {
      assignmentId,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(500, "Failed to fetch submissions");
  }
};

// GRADE SUBMISSION (Teacher Only)
export const gradeSubmissionService = async (
  submissionId: string,
  userId: string,
  data: { marksObtained: number; feedback?: string }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (data.marksObtained === undefined || data.marksObtained === null) {
      throw new ApiError(400, "Marks obtained are required");
    }

    const marks = Number(data.marksObtained);

    if (!Number.isFinite(marks) || marks < 0) {
      throw new ApiError(400, "Marks must be a valid non-negative number");
    }

    if (data.feedback && data.feedback.trim().length > 5000) {
      throw new ApiError(400, "Feedback is too long (max 5000 characters)");
    }

    const submission = await Submission.findById(submissionId)
      .populate("assignment")
      .session(session);

    if (!submission) throw new ApiError(404, "Submission not found");

    const assignment = submission.assignment as any;

    const classroom = await Class.findById(assignment.class).session(session);
    if (!classroom) throw new ApiError(404, "Class not found");

    const isTeacher = classroom.teachers.some(
      (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
    );

    if (!isTeacher) {
      logSecurityEvent(
        "UNAUTHORIZED_GRADING_ATTEMPT",
        userId,
        "Non-teacher attempted to grade submission",
        {
          submissionId,
          assignmentId: assignment._id.toString(),
        }
      );

      throw new ApiError(403, "Only teachers can grade submissions");
    }

    if (marks > assignment.totalMarks) {
      throw new ApiError(
        400,
        `Marks cannot exceed total marks (${assignment.totalMarks})`
      );
    }

    submission.marksObtained = marks;
    submission.feedback = data.feedback?.trim() || undefined;
    submission.gradedBy = new mongoose.Types.ObjectId(userId);
    submission.gradedAt = new Date();

    await submission.save({ session });
    await session.commitTransaction();

    logSecurityEvent("ASSIGNMENT_GRADED", userId, "Teacher graded submission", {
      submissionId,
      assignmentId: assignment._id.toString(),
      marksGiven: marks,
    });

    return submission;
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof ApiError) throw error;

    logError("Grading submission failed", {
      submissionId,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(500, "Failed to grade submission");
  } finally {
    session.endSession();
  }
};

// GET SINGLE SUBMISSION (Teacher or Owner Student)
export const getSubmissionByIdService = async (
  submissionId: string,
  userId: string
) => {
  try {
    const submission = await Submission.findById(submissionId)
      .populate("student", "name email role")
      .populate("assignment")
      .lean();

    if (!submission) throw new ApiError(404, "Submission not found");

    const assignment = submission.assignment as any;

    const classroom = await Class.findById(assignment.class);
    if (!classroom) throw new ApiError(404, "Class not found");

    const isTeacher = classroom.teachers.some(
      (t: mongoose.Types.ObjectId) => t.toString() === userId
    );

    const isOwner = (submission.student as any)._id.toString() === userId;

    if (!isTeacher && !isOwner) {
      logSecurityEvent(
        "UNAUTHORIZED_SUBMISSION_ACCESS",
        userId,
        "User attempted unauthorized submission access",
        { submissionId }
      );

      throw new ApiError(403, "You do not have permission to view this submission");
    }

    return submission;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    logError("Failed to fetch submission", {
      submissionId,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(500, "Failed to fetch submission");
  }
};