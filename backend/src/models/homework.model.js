import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
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
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["objective", "subjective"],
          required: true,
        },
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
        marks: {
          type: Number,
          required: true,
          default: 1,
        },
        difficultyLevel: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        // For personalization
        learningStyle: {
          type: String,
          enum: ["visual", "auditory", "reading", "kinesthetic"],
          default: null,
        },
        // For file attachments to questions
        attachments: [
          {
            fileName: String,
            fileType: String,
            fileSize: Number,
            fileUrl: String,
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    // Personalization Settings
    personalizationEnabled: {
      type: Boolean,
      default: false,
    },
    adaptiveDifficulty: {
      type: Boolean,
      default: false,
    },
    learningStylePreference: {
      type: Boolean,
      default: false,
    },
    // For file attachments to the entire homework
    attachments: [
      {
        fileName: String,
        fileType: String,
        fileSize: Number,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Versioning
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        version: Number,
        title: String,
        description: String,
        questions: Array,
        dueDate: Date,
        difficultyLevel: String,
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
        changeDescription: String,
      },
    ],
    // Rubrics for grading
    rubrics: [
      {
        name: String,
        description: String,
        criteria: [
          {
            criterion: String,
            maxMarks: Number,
            levels: [
              {
                level: String,
                description: String,
                marks: Number,
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Indexes for query optimization
homeworkSchema.index({ classId: 1, subjectId: 1, dueDate: 1 });
homeworkSchema.index({ schoolId: 1 });
homeworkSchema.index({ createdBy: 1 });

export const Homework = mongoose.model("Homework", homeworkSchema); 