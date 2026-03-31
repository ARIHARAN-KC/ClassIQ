import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  title: string;
  description?: string;
  teachers: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
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
      trim: true,
      maxlength: 2000,
    },

    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    joinCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Class =
  mongoose.models.Class || mongoose.model<IClass>("Class", classSchema);

export default Class;