import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    // Learning Preferences
    learningStyles: {
      visual: {
        type: Number, // Score from 0-100
        default: 25,
      },
      auditory: {
        type: Number,
        default: 25,
      },
      reading: {
        type: Number,
        default: 25,
      },
      kinesthetic: {
        type: Number,
        default: 25,
      },
    },
    // Difficulty adaptivity
    performanceByDifficulty: {
      easy: {
        correct: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
      medium: {
        correct: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
      hard: {
        correct: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    },
    // Subject performance
    subjectPerformance: {
      type: Map,
      of: {
        averageScore: Number,
        questionsAttempted: Number,
        lastSubmissionDate: Date,
      },
      default: {},
    },
    // System recommendations
    recommendedLearningStyle: {
      type: String,
      enum: ["visual", "auditory", "reading", "kinesthetic", null],
      default: null,
    },
    recommendedDifficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    // Student settings
    personalizationEnabled: {
      type: Boolean,
      default: true,
    },
    adaptiveDifficultyEnabled: {
      type: Boolean,
      default: true,
    },
    learningStylePreferenceEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for query optimization
studentProfileSchema.index({ studentId: 1 });
studentProfileSchema.index({ schoolId: 1 });

export const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema); 