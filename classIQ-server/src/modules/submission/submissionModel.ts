import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
    assignment: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;

    comment?: string;
    attachments: string[];

    marksObtained?: number;
    feedback?: string;

    gradedBy?: mongoose.Types.ObjectId;
    gradedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
    {
        assignment: {
            type: Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },

        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        comment: {
            type: String,
        },

        attachments: [
            {
                type: String,
            },
        ],

        marksObtained: {
            type: Number,
        },

        feedback: {
            type: String,
        },

        gradedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        gradedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model<ISubmission>( "Submission", submissionSchema);