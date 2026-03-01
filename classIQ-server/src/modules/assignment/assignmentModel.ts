import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
    title: string;
    description: string;
    dueDate: Date;
    totalMarks: number;
    class: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        totalMarks: {
            type: Number,
            default: 100,
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attachments: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);