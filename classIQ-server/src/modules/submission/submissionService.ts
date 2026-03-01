import mongoose from "mongoose";
import Submission from "./submissionModel.js";
import Assignment from "../assignment/assignmentModel.js";
import Class from "../classes/classModel.js";

// Upload Submission
export const uploadSubmissionService = async (
    assignmentId: string,
    userId: string,
    data: any
) => {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const classroom = await Class.findById(assignment.class);
    if (!classroom) throw new Error("Class not found");

    // Check student belongs to class
    const isStudent = classroom.students.some(
        (studentId: any) => studentId.toString() === userId
    );

    if (!isStudent) {
        throw new Error("Only students of this class can submit");
    }

    // Prevent multiple submissions (optional rule)
    const existing = await Submission.findOne({
        assignment: assignmentId,
        student: userId,
    });

    if (existing) {
        throw new Error("You have already submitted this assignment");
    }

    const submission = await Submission.create({
        ...data,
        assignment: assignmentId,
        student: userId,
    });

    return submission;
};

// Get All Submissions (Teacher)
export const getSubmissionsByAssignmentService = async (
    assignmentId: string,
    userId: string
) => {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const classroom = await Class.findById(assignment.class);

    const isTeacher = classroom?.teachers.some(
        (teacherId: any) => teacherId.toString() === userId
    );

    if (!isTeacher) {
        throw new Error("Only teachers can view submissions");
    }

    return Submission.find({ assignment: assignmentId })
        .populate("student", "name email")
        .sort({ createdAt: -1 });
};

// Grade Submission
export const gradeSubmissionService = async (
    submissionId: string,
    userId: string,
    data: any
) => {
    const submission = await Submission.findById(submissionId)
        .populate("assignment");

    if (!submission) throw new Error("Submission not found");

    const classroom = await Class.findById(
        (submission.assignment as any).class
    );

    const isTeacher = classroom?.teachers.some(
        (teacherId: any) => teacherId.toString() === userId
    );

    if (!isTeacher) {
        throw new Error("Only teachers can grade");
    }

    // Validate marks
    const totalMarks = (submission.assignment as any).totalMarks;

    if (data.marksObtained > totalMarks) {
        throw new Error("Marks cannot exceed total marks");
    }

    submission.marksObtained = data.marksObtained;
    submission.feedback = data.feedback;
    submission.gradedBy = new mongoose.Types.ObjectId(userId);
    submission.gradedAt = new Date();

    await submission.save();

    return submission;
};

// Get Single Submission
export const getSubmissionByIdService = async (
    submissionId: string,
    userId: string
) => {
    const submission = await Submission.findById(submissionId)
        .populate("student", "name email")
        .populate("assignment");

    if (!submission) throw new Error("Submission not found");

    const classroom = await Class.findById(
        (submission.assignment as any).class
    );

    const isTeacher = classroom?.teachers.some(
        (t: any) => t.toString() === userId
    );

    const isOwner =
        submission.student.toString() === userId;

    if (!isTeacher && !isOwner) {
        throw new Error("Not authorized");
    }

    return submission;
};