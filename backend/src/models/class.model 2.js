import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String, // e.g., "9th", "10th"
      required: true,
    },
    section: {
      type: String, // e.g., "A", "B"
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    classTeacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: "Subject",
    }],
    students: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    academicYear: {
      type: String, // e.g., "2023-2024"
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for common queries
classSchema.index({ schoolId: 1, grade: 1, section: 1 });
classSchema.index({ schoolId: 1, classTeacherId: 1 });

export const Class = mongoose.model("Class", classSchema); 