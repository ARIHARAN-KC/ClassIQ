import Assignment from "./assignmentModel.js";
import Class from "../classes/classModel.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose from "mongoose";

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  dueDate: Date;
  totalMarks: number;
  attachments: {
    fileId: string;
    fileName: string;
    mimeType: string;
    url?: string;
    viewUrl?: string;
  }[];
}

export interface UpdateAssignmentDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  totalMarks?: number;
  isPublished?: boolean;
}

export const createAssignmentService = async (
  classId: string,
  userId: string,
  data: CreateAssignmentDTO
) => {
  const classroom = await Class.findById(classId);

  if (!classroom) throw new ApiError(404, "Class not found");

  const isTeacher = classroom.teachers.some(
    (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
  );

  if (!isTeacher) {
    throw new ApiError(403, "Only teachers can create assignments");
  }

  const assignment = await Assignment.create({
    ...data,
    class: new mongoose.Types.ObjectId(classId),
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  return assignment;
};

export const getAssignmentsByClassService = async (
  classId: string,
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const classroom = await Class.findById(classId);
  if (!classroom) throw new ApiError(404, "Class not found");

  const isTeacher = classroom.teachers.some(
    (t: mongoose.Types.ObjectId) => t.toString() === userId
  );

  const isStudent = classroom.students.some(
    (s: mongoose.Types.ObjectId) => s.toString() === userId
  );

  if (!isTeacher && !isStudent) {
    throw new ApiError(403, "Not authorized to view assignments");
  }

  const skip = (page - 1) * limit;

  const query: Record<string, any> = { class: classId };

  // Students can only see published assignments
  if (isStudent && !isTeacher) {
    query.isPublished = true;
  }

  const [assignments, total] = await Promise.all([
    Assignment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email"),

    Assignment.countDocuments(query),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    assignments,
  };
};

export const getAssignmentByIdService = async (
  assignmentId: string,
  userId: string
) => {
  const assignment = await Assignment.findById(assignmentId)
    .populate("createdBy", "name email")
    .populate("class", "title");

  if (!assignment) throw new ApiError(404, "Assignment not found");

  const classroom = await Class.findById(assignment.class);
  if (!classroom) throw new ApiError(404, "Class not found");

  const isTeacher = classroom.teachers.some(
    (t: mongoose.Types.ObjectId) => t.toString() === userId
  );

  const isStudent = classroom.students.some(
    (s: mongoose.Types.ObjectId) => s.toString() === userId
  );

  if (!isTeacher && !isStudent) {
    throw new ApiError(403, "Not authorized to view this assignment");
  }

  if (!assignment.isPublished && !isTeacher) {
    throw new ApiError(403, "Assignment is not published yet");
  }

  return assignment;
};

export const updateAssignmentService = async (
  assignmentId: string,
  userId: string,
  data: UpdateAssignmentDTO
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) throw new ApiError(404, "Assignment not found");

  if (assignment.createdBy.toString() !== userId) {
    throw new ApiError(403, "Only assignment creator can update this assignment");
  }

  Object.assign(assignment, data);
  await assignment.save();

  return assignment;
};

export const deleteAssignmentService = async (
  assignmentId: string,
  userId: string
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) throw new ApiError(404, "Assignment not found");

  if (assignment.createdBy.toString() !== userId) {
    throw new ApiError(403, "Only assignment creator can delete this assignment");
  }

  await assignment.deleteOne();
  return assignment;
};