import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    isPersonalized: {
      type: Boolean,
      default: false,
    },
    // For objective questions
    questions: [{
      type: Schema.Types.ObjectId,
      ref: "Question"
    }],
    // For subjective questions
    subjectiveQuestions: [{
      question: {
        type: String,
        required: true
      },
      marks: {
        type: Number,
        required: true
      },
      rubric: [{
        criteria: String,
        maxMarks: Number,
        description: String
      }],
      attachments: [{
        url: String,
        name: String,
        type: String
      }]
    }],
    // For attachments (PDF, images, etc)
    attachments: [{
      url: String,
      name: String,
      type: String
    }],
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For tracking purposes
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
assignmentSchema.index({ schoolId: 1, classId: 1, subjectId: 1 });
assignmentSchema.index({ schoolId: 1, teacherId: 1 });
assignmentSchema.index({ dueDate: 1 });

export const Assignment = mongoose.model("Assignment", assignmentSchema); 