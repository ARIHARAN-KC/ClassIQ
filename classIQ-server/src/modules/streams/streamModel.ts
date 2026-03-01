import mongoose, { Schema, Document } from "mongoose";

export interface IStream extends Document {
  content: string;
  class: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const streamSchema = new Schema<IStream>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStream>("Stream", streamSchema);