import mongoose, { Schema, Document } from "mongoose";

export interface ISubmissionAttachment {
  fileId: string;
  fileName: string;
  mimeType: string;
  url: string;
  viewUrl: string;
}

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;

  comment?: string;
  attachments: ISubmissionAttachment[];

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
      index: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    attachments: {
      type: [
        {
          fileId: { type: String, required: true },
          fileName: { type: String, required: true },
          mimeType: { type: String, required: true },
          url: { type: String, required: true },
          viewUrl: { type: String, required: true },
        },
      ],
      default: [],
    },

    marksObtained: {
      type: Number,
      min: 0,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 5000,
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

// One submission per assignment per student
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

// Faster queries
submissionSchema.index({ assignment: 1, createdAt: -1 });
submissionSchema.index({ student: 1, createdAt: -1 });

const Submission =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", submissionSchema);

export default Submission;