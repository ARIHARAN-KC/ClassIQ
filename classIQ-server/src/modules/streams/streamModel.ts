import mongoose, { Schema, Document } from "mongoose";

export interface IStream extends Document {
  content: string;
  class: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const streamSchema = new Schema<IStream>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

streamSchema.index({ class: 1, createdAt: -1 });

const Stream =
  mongoose.models.Stream || mongoose.model<IStream>("Stream", streamSchema);

export default Stream;