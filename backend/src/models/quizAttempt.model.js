import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
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
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    
    // Attempt timing
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number, // Time spent in seconds
      default: 0,
    },
    
    // Attempt status
    status: {
      type: String,
      enum: ["in_progress", "submitted", "auto_submitted", "abandoned"],
      default: "in_progress",
    },
    
    // Student answers
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["multiple_choice", "single_choice", "true_false", "short_answer", "essay"],
          required: true,
        },
        
        // Different answer types
        selectedOptions: [mongoose.Schema.Types.ObjectId], // For MCQ
        textAnswer: String, // For short answer and essay
        booleanAnswer: Boolean, // For true/false
        
        // Answer metadata
        timeSpent: {
          type: Number,
          default: 0, // Time spent on this question in seconds
        },
        attempts: {
          type: Number,
          default: 1, // Number of times student changed answer
        },
        flagged: {
          type: Boolean,
          default: false, // Whether student flagged for review
        },
        confidence: {
          type: Number,
          min: 1,
          max: 5, // Student's confidence level (if collected)
        },
        visitedAt: {
          type: Date,
          default: Date.now,
        },
        answeredAt: {
          type: Date,
        },
        
        // Grading information
        marks: {
          type: Number,
          default: 0,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
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
        autoGraded: {
          type: Boolean,
          default: false,
        },
      },
    ],
    
    // Quiz results
    results: {
      totalMarks: {
        type: Number,
        default: 0,
      },
      obtainedMarks: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
      grade: {
        type: String,
        enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
      },
      passed: {
        type: Boolean,
      },
      rank: {
        type: Number, // Rank among all students who attempted
      },
    },
    
    // Attempt analytics
    analytics: {
      questionsAttempted: {
        type: Number,
        default: 0,
      },
      questionsCorrect: {
        type: Number,
        default: 0,
      },
      questionsIncorrect: {
        type: Number,
        default: 0,
      },
      questionsSkipped: {
        type: Number,
        default: 0,
      },
      averageTimePerQuestion: {
        type: Number,
        default: 0,
      },
      difficultyBreakdown: {
        easy: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
        medium: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
        hard: {
          attempted: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
      },
      subjectMastery: {
        type: Number, // Calculated mastery percentage for this subject
        min: 0,
        max: 100,
      },
    },
    
    // Proctoring and security
    proctoring: {
      browserEvents: [
        {
          event: {
            type: String,
            enum: ["tab_switch", "window_blur", "right_click", "copy", "paste", "print", "fullscreen_exit"],
          },
          timestamp: Date,
          details: String,
        },
      ],
      violations: {
        type: Number,
        default: 0,
      },
      flagged: {
        type: Boolean,
        default: false,
      },
      webcamImages: [
        {
          timestamp: Date,
          imageUrl: String,
          aiFlags: [String], // AI-detected suspicious activities
        },
      ],
    },
    
    // Technical metadata
    deviceInfo: {
      userAgent: String,
      ipAddress: String,
      browser: String,
      os: String,
      screenResolution: String,
    },
    
    // Review and feedback
    studentFeedback: {
      difficulty: {
        type: Number,
        min: 1,
        max: 5,
      },
      clarity: {
        type: Number,
        min: 1,
        max: 5,
      },
      fairness: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
    },
    
    // Teacher feedback
    teacherComments: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for performance
quizAttemptSchema.index({ quizId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
quizAttemptSchema.index({ schoolId: 1, status: 1 });
quizAttemptSchema.index({ studentId: 1, submittedAt: -1 });
quizAttemptSchema.index({ quizId: 1, submittedAt: -1 });

// Virtual for formatted time spent
quizAttemptSchema.virtual('timeSpentFormatted').get(function() {
  const hours = Math.floor(this.timeSpent / 3600);
  const minutes = Math.floor((this.timeSpent % 3600) / 60);
  const seconds = this.timeSpent % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
});

// Virtual for completion percentage
quizAttemptSchema.virtual('completionPercentage').get(function() {
  if (this.answers.length === 0) return 0;
  
  const answeredQuestions = this.answers.filter(answer => {
    return answer.selectedOptions?.length > 0 || 
           answer.textAnswer?.trim() || 
           answer.booleanAnswer !== undefined;
  }).length;
  
  return Math.round((answeredQuestions / this.answers.length) * 100);
});

// Pre-save middleware to calculate analytics
quizAttemptSchema.pre('save', function(next) {
  if (this.isModified('answers') || this.isModified('results')) {
    this.calculateAnalytics();
  }
  next();
});

// Method to calculate analytics
quizAttemptSchema.methods.calculateAnalytics = function() {
  const analytics = {
    questionsAttempted: 0,
    questionsCorrect: 0,
    questionsIncorrect: 0,
    questionsSkipped: 0,
    averageTimePerQuestion: 0,
    difficultyBreakdown: {
      easy: { attempted: 0, correct: 0 },
      medium: { attempted: 0, correct: 0 },
      hard: { attempted: 0, correct: 0 }
    }
  };
  
  let totalTimeSpent = 0;
  
  this.answers.forEach(answer => {
    const isAnswered = answer.selectedOptions?.length > 0 || 
                      answer.textAnswer?.trim() || 
                      answer.booleanAnswer !== undefined;
    
    if (isAnswered) {
      analytics.questionsAttempted++;
      if (answer.isCorrect === true) {
        analytics.questionsCorrect++;
      } else if (answer.isCorrect === false) {
        analytics.questionsIncorrect++;
      }
    } else {
      analytics.questionsSkipped++;
    }
    
    totalTimeSpent += answer.timeSpent || 0;
  });
  
  analytics.averageTimePerQuestion = analytics.questionsAttempted > 0 
    ? Math.round(totalTimeSpent / analytics.questionsAttempted) 
    : 0;
  
  this.analytics = { ...this.analytics, ...analytics };
  
  // Calculate results
  if (this.status === 'submitted' || this.status === 'auto_submitted') {
    this.results.obtainedMarks = this.answers.reduce((sum, answer) => sum + (answer.marks || 0), 0);
    this.results.totalMarks = this.answers.reduce((sum, answer) => sum + (answer.maxMarks || 0), 0);
    this.results.percentage = this.results.totalMarks > 0 
      ? Math.round((this.results.obtainedMarks / this.results.totalMarks) * 100) 
      : 0;
  }
};

// Method to auto-grade objective questions
quizAttemptSchema.methods.autoGradeObjective = function(quiz) {
  this.answers.forEach((answer, index) => {
    const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
    if (!question) return;
    
    answer.maxMarks = question.marks;
    
    // Auto-grade based on question type
    if (question.questionType === 'single_choice' || question.questionType === 'multiple_choice') {
      const correctOptions = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt._id.toString());
      
      const selectedOptions = (answer.selectedOptions || []).map(opt => opt.toString());
      
      // Check if answer is correct
      if (question.questionType === 'single_choice') {
        answer.isCorrect = correctOptions.length === 1 && 
                          selectedOptions.length === 1 && 
                          correctOptions[0] === selectedOptions[0];
      } else {
        // Multiple choice - all correct options must be selected
        answer.isCorrect = correctOptions.length === selectedOptions.length &&
                          correctOptions.every(opt => selectedOptions.includes(opt));
      }
      
      answer.marks = answer.isCorrect ? question.marks : (question.negativeMarks ? -question.negativeMarks : 0);
      answer.autoGraded = true;
      answer.gradedAt = new Date();
      
    } else if (question.questionType === 'true_false') {
      const correctAnswer = question.options.find(opt => opt.isCorrect);
      answer.isCorrect = correctAnswer && 
                        ((correctAnswer.text.toLowerCase() === 'true' && answer.booleanAnswer === true) ||
                         (correctAnswer.text.toLowerCase() === 'false' && answer.booleanAnswer === false));
      
      answer.marks = answer.isCorrect ? question.marks : (question.negativeMarks ? -question.negativeMarks : 0);
      answer.autoGraded = true;
      answer.gradedAt = new Date();
    }
  });
  
  this.calculateAnalytics();
};

// Method to check if attempt is still valid (within time limit)
quizAttemptSchema.methods.isValid = function(quiz) {
  if (this.status !== 'in_progress') return false;
  
  const now = new Date();
  const maxEndTime = new Date(this.startedAt.getTime() + (quiz.duration * 60 * 1000));
  
  return now <= maxEndTime && now <= quiz.endDate;
};

// Method to auto-submit if time is up
quizAttemptSchema.methods.autoSubmitIfExpired = function(quiz) {
  if (!this.isValid(quiz) && this.status === 'in_progress') {
    this.status = 'auto_submitted';
    this.submittedAt = new Date();
    this.timeSpent = Math.floor((this.submittedAt - this.startedAt) / 1000);
    this.autoGradeObjective(quiz);
    return true;
  }
  return false;
};

// Static method to get student's quiz attempts
quizAttemptSchema.statics.getStudentAttempts = function(studentId, quizId) {
  return this.find({ studentId, quizId })
    .sort({ attemptNumber: -1 })
    .populate('quizId', 'title settings grading');
};

// Static method to get quiz statistics
quizAttemptSchema.statics.getQuizStats = function(quizId) {
  return this.aggregate([
    { $match: { quizId: mongoose.Types.ObjectId(quizId), status: { $in: ['submitted', 'auto_submitted'] } } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$results.percentage' },
        averageTime: { $avg: '$timeSpent' },
        passCount: { $sum: { $cond: ['$results.passed', 1, 0] } },
        maxScore: { $max: '$results.percentage' },
        minScore: { $min: '$results.percentage' }
      }
    }
  ]);
};

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema); 