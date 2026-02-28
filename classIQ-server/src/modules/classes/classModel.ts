import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  title: string;
  description?: string;
  teachers: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  joinCode: string;
}

const classSchema = new Schema<IClass>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    joinCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IClass>("Class", classSchema);