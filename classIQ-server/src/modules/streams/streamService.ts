import mongoose from "mongoose";
import Stream from "./streamModel.js";
import Class from "../classes/classModel.js";

export const createStream = async (
  classId: string,
  userId: string,
  content: string
) => {
  const classData = await Class.findById(classId);

  if (!classData) {
    throw new Error("Class not found");
  }

  // Check if user is one of the teachers
  const isTeacher = classData.teachers.some(
    (teacherId) => teacherId.toString() === userId
  );

  if (!isTeacher) {
    throw new Error("Only teachers can post announcements");
  }

  const stream = await Stream.create({
    content,
    class: new mongoose.Types.ObjectId(classId),
    author: new mongoose.Types.ObjectId(userId),
  });

  return stream;
};

export const getClassStreams = async (classId: string, userId: string) => {
  const classData = await Class.findById(classId);

  if (!classData) {
    throw new Error("Class not found");
  }

  const isTeacher = classData.teachers.some(
    (teacherId) => teacherId.toString() === userId
  );

  const isStudent = classData.students.some(
    (studentId) => studentId.toString() === userId
  );

  if (!isTeacher && !isStudent) {
    throw new Error("Not authorized to view this class stream");
  }

  const streams = await Stream.find({ class: classId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  return streams;
};

export const deleteStream = async (streamId: string, userId: string) => {
  const stream = await Stream.findById(streamId);

  if (!stream) {
    throw new Error("Stream not found");
  }

  const classData = await Class.findById(stream.class);

  if (!classData) {
    throw new Error("Class not found");
  }

  const isTeacher = classData.teachers.some(
    (teacherId) => teacherId.toString() === userId
  );

  if (!isTeacher) {
    throw new Error("Only teachers can delete stream");
  }

  await stream.deleteOne();

  return { message: "Stream deleted successfully" };
};