import Assignment from "../assignment/assignmentModel.js";
import Class from "../classes/classModel.js";
import mongoose from "mongoose";

// Create Assignment
export const createAssignmentService = async (
    classId: string,
    userId: string,
    data: any
) => {
    const classroom = await Class.findById(classId);
    if (!classroom) throw new Error("Class not found");

    // Check if user is teacher
    const isTeacher = classroom.teachers.some(
        (teacherId) => teacherId.toString() === userId
    );

    if (!isTeacher) {
        throw new Error("Only teachers can create assignments");
    }
    const assignment = await Assignment.create({
        ...data,
        class: classId,
        createdBy: userId,
    });

    return assignment;
};

// Get Assignments by Class
export const getAssignmentsByClassService = async (classId: string) => {
    return Assignment.find({ class: classId })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");
};

// Get Single Assignment
export const getAssignmentByIdService = async (assignmentId: string) => {
    const assignment = await Assignment.findById(assignmentId)
        .populate("createdBy", "name email")
        .populate("class", "name");

    if (!assignment) throw new Error("Assignment not found");

    return assignment;
};

// Update Assignment
export const updateAssignmentService = async (
    assignmentId: string,
    userId: string,
    data: any
) => {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    if (assignment.createdBy.toString() !== userId) {
        throw new Error("Only teacher can update this assignment");
    }

    Object.assign(assignment, data);
    await assignment.save();

    return assignment;
};

// Delete Assignment
export const deleteAssignmentService = async (
    assignmentId: string,
    userId: string
) => {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    if (assignment.createdBy.toString() !== userId) {
        throw new Error("Only teacher can delete this assignment");
    }

    await assignment.deleteOne();
};