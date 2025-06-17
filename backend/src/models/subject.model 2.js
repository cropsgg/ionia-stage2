import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String, // e.g., "MATH101"
      trim: true,
    },
    description: {
      type: String,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    classes: [{
      type: Schema.Types.ObjectId,
      ref: "Class",
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    // For personalized learning topics
    topics: [{
      name: String,
      description: String,
      difficulty: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        default: "INTERMEDIATE"
      }
    }],
    // Metadata for reporting
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for common queries
subjectSchema.index({ schoolId: 1, name: 1 });
subjectSchema.index({ schoolId: 1, teacherId: 1 });

export const Subject = mongoose.model("Subject", subjectSchema);

 