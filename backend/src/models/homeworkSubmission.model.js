import mongoose from "mongoose";

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "late", "graded"],
      default: "pending",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        answerText: String,
        selectedOptions: [mongoose.Schema.Types.ObjectId],
        marks: {
          type: Number,
          default: 0,
        },
        feedback: String,
        isCorrect: Boolean,
        gradedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        gradedAt: Date,
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalObtainedMarks: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gradedAt: {
      type: Date,
    },
    // Student learning analytics
    timeSpent: {
      type: Number, // Time in minutes
      default: 0,
    },
    attemptsPerQuestion: {
      type: Map,
      of: Number,
      default: {},
    },
    learningStyleEffectiveness: {
      type: Map,
      of: Number, // Percentage of correct answers per style
      default: {},
    },
  },
  { timestamps: true }
);

// Indexes for query optimization
homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 }, { unique: true });
homeworkSubmissionSchema.index({ schoolId: 1 });
homeworkSubmissionSchema.index({ studentId: 1, status: 1 });
homeworkSubmissionSchema.index({ homeworkId: 1, status: 1 });

export const HomeworkSubmission = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema); 