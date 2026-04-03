import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import User from "./userModel.js";
import Class from "../classes/classModel.js";
import Assignment from "../assignment/assignmentModel.js";
import Submission from "../submission/submissionModel.js";
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

// ================= TEACHER DASHBOARD =================
export const teacherDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const teacherId = req.user.id;

    // 1. Get all classes taught by this teacher
    const classes = await Class.find({ teachers: teacherId })
      .select("title description students createdAt")
      .lean();

    const classIds = classes.map(c => c._id);

    // 2. Get all assignments created by this teacher
    const assignments = await Assignment.find({ createdBy: teacherId })
      .select("title dueDate totalMarks class isPublished")
      .lean();

    const assignmentIds = assignments.map(a => a._id);

    // 3. Get submissions for those assignments
    const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
      .select("assignment marksObtained gradedAt student")
      .lean();

    // 4. Calculate statistics
    const totalClasses = classes.length;
    const totalAssignments = assignments.length;
    const totalSubmissions = submissions.length;

    // Submissions pending grading (marksObtained is null/undefined)
    const pendingGrading = submissions.filter(s => s.marksObtained === undefined || s.marksObtained === null).length;

    // 5. Recent classes (last 5)
    const recentClasses = classes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        studentCount: c.students?.length || 0,
        createdAt: c.createdAt,
      }));

    // 6. Recent assignments with submission stats
    const recentAssignments = await Promise.all(
      assignments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(async (assignment) => {
          const subs = submissions.filter(s => s.assignment.toString() === assignment._id.toString());
          const submittedCount = subs.length;
          const gradedCount = subs.filter(s => s.marksObtained !== undefined && s.marksObtained !== null).length;

          return {
            id: assignment._id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            totalMarks: assignment.totalMarks,
            isPublished: assignment.isPublished,
            submittedCount,
            pendingGrading: submittedCount - gradedCount,
          };
        })
    );

    const dashboardData = {
      summary: {
        totalClasses,
        totalAssignments,
        totalSubmissions,
        pendingGrading,
      },
      recentClasses,
      recentAssignments,
    };

    return res.json(new ApiResponse(200, "Teacher dashboard data", dashboardData));
  }
);

// ================= STUDENT DASHBOARD =================
export const studentDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const studentId = req.user.id;

    // 1. Get all classes enrolled
    const classes = await Class.find({ students: studentId })
      .select("title description teachers createdAt")
      .lean();

    const classIds = classes.map(c => c._id);

    // 2. Get all assignments for these classes (published only)
    const assignments = await Assignment.find({
      class: { $in: classIds },
      isPublished: true,
    })
      .select("title dueDate totalMarks class createdAt")
      .lean();

    // 3. Get student's submissions
    const submissions = await Submission.find({ student: studentId })
      .select("assignment marksObtained feedback gradedAt createdAt")
      .lean();

    const submittedAssignmentIds = submissions.map(s => s.assignment.toString());

    // 4. Calculate statistics
    const totalClasses = classes.length;
    const totalAssignments = assignments.length;

    // Assignments due (not submitted and deadline in future)
    const now = new Date();
    const pendingAssignments = assignments.filter(a => {
      const isSubmitted = submittedAssignmentIds.includes(a._id.toString());
      return !isSubmitted && new Date(a.dueDate) >= now;
    }).length;

    const completedAssignments = submissions.filter(s => s.marksObtained !== undefined && s.marksObtained !== null).length;

    // Average marks (only graded submissions)
    const gradedSubmissions = submissions.filter(s => s.marksObtained !== undefined && s.marksObtained !== null);
    const averageMarks = gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => sum + (s.marksObtained || 0), 0) / gradedSubmissions.length
      : 0;

    // 5. Recent classes
    const recentClasses = classes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        teacherCount: c.teachers?.length || 0,
        createdAt: c.createdAt,
      }));

    // 6. Recent submissions with grades
    const recentSubmissions = submissions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(async (sub) => {
        const assignment = await Assignment.findById(sub.assignment)
          .select("title totalMarks dueDate")
          .lean();
        return {
          id: sub._id,
          assignmentTitle: assignment?.title || "Unknown",
          totalMarks: assignment?.totalMarks || 0,
          marksObtained: sub.marksObtained,
          feedback: sub.feedback,
          submittedAt: sub.createdAt,
          gradedAt: sub.gradedAt,
        };
      });

    const resolvedRecentSubmissions = await Promise.all(recentSubmissions);

    const dashboardData = {
      summary: {
        totalClasses,
        totalAssignments,
        pendingAssignments,
        completedAssignments,
        averageMarks: parseFloat(averageMarks.toFixed(2)),
      },
      recentClasses,
      recentSubmissions: resolvedRecentSubmissions,
    };

    return res.json(new ApiResponse(200, "Student dashboard data", dashboardData));
  }
);