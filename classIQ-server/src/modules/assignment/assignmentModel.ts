import mongoose, { Schema, Document } from "mongoose";

export interface IAssignmentAttachment {
  fileId: string;
  fileName: string;
  mimeType: string;
  url?: string;
  viewUrl?: string;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  totalMarks: number;

  class: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;

  attachments: IAssignmentAttachment[];
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
      min: 0,
      max: 1000,
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
        fileId: { type: String, required: true },
        fileName: { type: String, required: true },
        mimeType: { type: String, required: true },
        url: { type: String },
        viewUrl: { type: String },
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// indexes
assignmentSchema.index({ class: 1, createdAt: -1 });
assignmentSchema.index({ createdBy: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ isPublished: 1 });

const Assignment =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", assignmentSchema);

export default Assignment;