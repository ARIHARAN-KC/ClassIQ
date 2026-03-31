import mongoose from "mongoose";
import Stream from "./streamModel.js";
import Class from "../classes/classModel.js";
import { ApiError } from "../../utils/ApiError.js";

// CREATE STREAM
export const createStreamService = async (
  classId: string,
  userId: string,
  content: string
) => {
  const classData = await Class.findById(classId);

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  const isTeacher = classData.teachers.some(
    (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
  );

  if (!isTeacher) {
    throw new ApiError(403, "Only teachers can post announcements");
  }

  const stream = await Stream.create({
    content,
    class: new mongoose.Types.ObjectId(classId),
    author: new mongoose.Types.ObjectId(userId),
  });

  return stream;
};

// GET CLASS STREAMS
export const getClassStreamsService = async (
  classId: string,
  userId: string
) => {
  const classData = await Class.findById(classId);

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  const isTeacher = classData.teachers.some(
    (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
  );

  const isStudent = classData.students.some(
    (studentId: mongoose.Types.ObjectId) => studentId.toString() === userId
  );

  if (!isTeacher && !isStudent) {
    throw new ApiError(403, "Not authorized to view this class stream");
  }

  const streams = await Stream.find({ class: classId })
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  return streams;
};

// DELETE STREAM
export const deleteStreamService = async (streamId: string, userId: string) => {
  const stream = await Stream.findById(streamId);

  if (!stream) {
    throw new ApiError(404, "Stream not found");
  }

  const classData = await Class.findById(stream.class);

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  const isTeacher = classData.teachers.some(
    (teacherId: mongoose.Types.ObjectId) => teacherId.toString() === userId
  );

  const isAuthor = stream.author.toString() === userId;

  if (!isTeacher && !isAuthor) {
    throw new ApiError(403, "Not authorized to delete this stream");
  }

  await stream.deleteOne();
  return true;
};