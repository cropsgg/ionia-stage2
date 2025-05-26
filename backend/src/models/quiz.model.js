import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
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
    
    // Quiz timing and scheduling
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      min: 1,
      max: 300, // Max 5 hours
    },
    
    // Quiz settings
    settings: {
      maxAttempts: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
      },
      shuffleQuestions: {
        type: Boolean,
        default: true,
      },
      shuffleOptions: {
        type: Boolean,
        default: true,
      },
      showResults: {
        type: String,
        enum: ["immediately", "after_end", "manual", "never"],
        default: "after_end",
      },
      showCorrectAnswers: {
        type: Boolean,
        default: false,
      },
      allowReview: {
        type: Boolean,
        default: true,
      },
      requirePassword: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        select: false, // Don't include in normal queries
      },
      proctoring: {
        enabled: {
          type: Boolean,
          default: false,
        },
        lockdownBrowser: {
          type: Boolean,
          default: false,
        },
        webcamRequired: {
          type: Boolean,
          default: false,
        },
        plagiarismCheck: {
          type: Boolean,
          default: false,
        },
      },
    },
    
    // Question configuration
    questions: [
      {
        questionText: {
          type: String,
          required: true,
          trim: true,
        },
        questionType: {
          type: String,
          enum: ["multiple_choice", "single_choice", "true_false", "short_answer", "essay"],
          required: true,
        },
        options: [
          {
            text: {
              type: String,
              trim: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
            explanation: {
              type: String,
              trim: true,
            },
          },
        ],
        correctAnswer: {
          type: String, // For short answer and essay questions
          trim: true,
        },
        marks: {
          type: Number,
          required: true,
          min: 0.5,
          max: 100,
        },
        negativeMarks: {
          type: Number,
          default: 0,
          min: 0,
        },
        difficultyLevel: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        timeLimit: {
          type: Number, // Time limit for this question in seconds
          min: 10,
          max: 3600,
        },
        required: {
          type: Boolean,
          default: false, // Whether student must answer this question
        },
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
        // Question analytics
        stats: {
          timesAttempted: {
            type: Number,
            default: 0,
          },
          correctResponses: {
            type: Number,
            default: 0,
          },
          averageTimeSpent: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
    
    // Grading configuration
    grading: {
      totalMarks: {
        type: Number,
        default: 0,
      },
      passingMarks: {
        type: Number,
        default: 0,
      },
      gradingMethod: {
        type: String,
        enum: ["automatic", "manual", "hybrid"],
        default: "automatic",
      },
      partialCredits: {
        type: Boolean,
        default: false,
      },
    },
    
    // Quiz status and metadata
    status: {
      type: String,
      enum: ["draft", "published", "active", "completed", "cancelled"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    instructions: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    
    // Analytics and statistics
    statistics: {
      totalAttempts: {
        type: Number,
        default: 0,
      },
      completedAttempts: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      averageCompletionTime: {
        type: Number,
        default: 0,
      },
      passRate: {
        type: Number,
        default: 0,
      },
    },
    
    // Question pool for randomization
    questionPool: {
      enabled: {
        type: Boolean,
        default: false,
      },
      totalQuestions: {
        type: Number,
        min: 1,
      },
      questionSelection: {
        type: String,
        enum: ["random", "difficulty_based", "topic_based"],
        default: "random",
      },
    },
    
    // Additional features
    features: {
      calculator: {
        type: Boolean,
        default: false,
      },
      formulaSheet: {
        type: Boolean,
        default: false,
      },
      dictionary: {
        type: Boolean,
        default: false,
      },
      notepad: {
        type: Boolean,
        default: false,
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance optimization
quizSchema.index({ schoolId: 1, classId: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ startDate: 1, endDate: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ subjectId: 1 });

// Virtual for quiz duration in human-readable format
quizSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Virtual for quiz status based on current time
quizSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  
  if (this.status === 'draft') return 'draft';
  if (this.status === 'cancelled') return 'cancelled';
  if (now < startDate) return 'scheduled';
  if (now >= startDate && now <= endDate) return 'active';
  if (now > endDate) return 'ended';
  return 'completed';
});

// Pre-save middleware to calculate total marks
quizSchema.pre('save', function(next) {
  if (this.isModified('questions')) {
    this.grading.totalMarks = this.questions.reduce((total, question) => {
      return total + (question.marks || 0);
    }, 0);
    
    // Set default passing marks to 50% if not set
    if (!this.grading.passingMarks) {
      this.grading.passingMarks = Math.ceil(this.grading.totalMarks * 0.5);
    }
  }
  next();
});

// Method to check if quiz is currently active
quizSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'published' && 
         now >= this.startDate && 
         now <= this.endDate;
};

// Method to check if student can attempt quiz
quizSchema.methods.canAttempt = function(studentAttempts = 0) {
  return this.isActive() && 
         studentAttempts < this.settings.maxAttempts;
};

// Method to get randomized questions for a student
quizSchema.methods.getRandomizedQuestions = function(seed = null) {
  let questions = [...this.questions];
  
  if (this.settings.shuffleQuestions) {
    // Use seed for consistent randomization per student
    if (seed) {
      // Simple seeded shuffle algorithm
      questions = this.shuffleWithSeed(questions, seed);
    } else {
      questions = questions.sort(() => Math.random() - 0.5);
    }
  }
  
  if (this.settings.shuffleOptions) {
    questions = questions.map(q => ({
      ...q.toObject(),
      options: this.settings.shuffleOptions && q.options?.length > 0 
        ? (seed ? this.shuffleWithSeed([...q.options], seed + q._id) : q.options.sort(() => Math.random() - 0.5))
        : q.options
    }));
  }
  
  return questions;
};

// Helper method for seeded shuffle
quizSchema.methods.shuffleWithSeed = function(array, seed) {
  const random = this.seededRandom(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Simple seeded random number generator
quizSchema.methods.seededRandom = function(seed) {
  let x = Math.sin(seed) * 10000;
  return function() {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
};

// Static method to find active quizzes for a class
quizSchema.statics.findActiveQuizzes = function(classId, schoolId) {
  const now = new Date();
  return this.find({
    classId,
    schoolId,
    status: 'published',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('subjectId', 'name subjectCode')
    .populate('createdBy', 'fullName')
    .sort({ startDate: 1 });
};

export const Quiz = mongoose.model("Quiz", quizSchema); 