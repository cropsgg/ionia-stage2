import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    // For objective questions
    answers: [{
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question"
      },
      selectedOption: String,
      isCorrect: Boolean,
      marks: Number
    }],
    // For subjective questions
    subjectiveAnswers: [{
      questionIndex: Number, // Index in the assignment's subjectiveQuestions array
      answer: String,
      attachments: [{
        url: String,
        name: String,
        type: String
      }],
      feedback: String,
      rubricScores: [{
        criteriaIndex: Number,
        score: Number,
        feedback: String
      }],
      marks: Number
    }],
    // For attachments (PDF, images, etc)
    attachments: [{
      url: String,
      name: String,
      type: String
    }],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "LATE", "GRADED", "RETURNED"],
      default: "SUBMITTED"
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for common queries
submissionSchema.index({ schoolId: 1, assignmentId: 1 });
submissionSchema.index({ schoolId: 1, studentId: 1 });
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ status: 1 });

export const Submission = mongoose.model("Submission", submissionSchema); 