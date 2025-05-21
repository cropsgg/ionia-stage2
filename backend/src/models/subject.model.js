import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    subjectCode: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    associatedGradeLevels: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better query performance
subjectSchema.index({ schoolId: 1, name: 1 }, { unique: true });
subjectSchema.index({ schoolId: 1, subjectCode: 1 }, { sparse: true });

export const Subject = mongoose.model("Subject", subjectSchema); 