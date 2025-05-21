import { HomeworkSubmission } from "../models/homeworkSubmission.model.js";
import { Homework } from "../models/homework.model.js";
import { StudentProfile } from "../models/studentProfile.model.js";
import mongoose from "mongoose";

/**
 * @desc    Submit homework answers
 * @route   POST /api/v1/homework-submissions/:homeworkId
 * @access  Private (Student)
 */
export const submitHomework = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const { answers, timeSpent } = req.body;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get studentId and schoolId from authenticated user
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Check if the homework exists and is active
    const homework = await Homework.findOne({
      _id: homeworkId,
      schoolId,
      isActive: true,
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found or inactive",
      });
    }

    // Check if the due date has passed
    const isDueDatePassed = new Date() > new Date(homework.dueDate);

    // Find existing submission or create a new one
    let submission = await HomeworkSubmission.findOne({
      homeworkId,
      studentId,
      schoolId,
    });

    if (!submission) {
      // Create a new submission
      submission = new HomeworkSubmission({
        homeworkId,
        studentId,
        schoolId,
        status: isDueDatePassed ? "late" : "submitted",
        submittedAt: new Date(),
        answers,
        totalMarks: homework.questions.reduce((sum, q) => sum + (q.marks || 1), 0),
        timeSpent: timeSpent || 0,
      });
    } else {
      // Update existing submission
      submission.answers = answers;
      submission.status = isDueDatePassed ? "late" : "submitted";
      submission.submittedAt = new Date();
      
      if (timeSpent) {
        submission.timeSpent = timeSpent;
      }
    }

    // For objective questions, auto-grade
    let totalObtainedMarks = 0;
    
    answers.forEach((answer) => {
      // Find the corresponding question
      const question = homework.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );

      if (question && question.questionType === "objective") {
        // Compare selected options with correct options
        const correctOptions = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt._id.toString());

        const selectedOptions = answer.selectedOptions.map((opt) => opt.toString());

        // Check if arrays are identical (same elements, regardless of order)
        const isCorrect =
          correctOptions.length === selectedOptions.length &&
          correctOptions.every((opt) => selectedOptions.includes(opt));

        answer.isCorrect = isCorrect;
        answer.marks = isCorrect ? question.marks || 1 : 0;
        totalObtainedMarks += answer.marks;
      }
    });

    submission.totalObtainedMarks = totalObtainedMarks;

    await submission.save();

    // Update student profile analytics
    if (homework.personalizationEnabled) {
      // Find or create student profile
      let studentProfile = await StudentProfile.findOne({
        studentId,
        schoolId,
      });

      if (!studentProfile) {
        studentProfile = new StudentProfile({
          studentId,
          schoolId,
        });
      }

      // Update analytics based on submission
      if (homework.adaptiveDifficulty) {
        // Track performance by difficulty level
        answers.forEach((answer) => {
          const question = homework.questions.find(
            (q) => q._id.toString() === answer.questionId.toString()
          );

          if (question && answer.isCorrect !== undefined) {
            const difficulty = question.difficultyLevel || "medium";
            
            // Increment correct/total counters
            studentProfile.performanceByDifficulty[difficulty].total += 1;
            
            if (answer.isCorrect) {
              studentProfile.performanceByDifficulty[difficulty].correct += 1;
            }
          }
        });

        // Calculate recommended difficulty level
        const difficultyLevels = ["easy", "medium", "hard"];
        const performanceRates = {};
        
        difficultyLevels.forEach(level => {
          const { correct, total } = studentProfile.performanceByDifficulty[level];
          if (total > 0) {
            performanceRates[level] = correct / total;
          }
        });
        
        // Logic to determine appropriate difficulty
        if (performanceRates.hard && performanceRates.hard > 0.7) {
          studentProfile.recommendedDifficultyLevel = "hard";
        } else if (performanceRates.medium && performanceRates.medium > 0.7) {
          studentProfile.recommendedDifficultyLevel = "medium";
        } else {
          studentProfile.recommendedDifficultyLevel = "easy";
        }
      }

      if (homework.learningStylePreference) {
        // Track performance by learning style
        const stylePerformance = {
          visual: { correct: 0, total: 0 },
          auditory: { correct: 0, total: 0 },
          reading: { correct: 0, total: 0 },
          kinesthetic: { correct: 0, total: 0 },
        };
        
        answers.forEach((answer) => {
          const question = homework.questions.find(
            (q) => q._id.toString() === answer.questionId.toString()
          );

          if (question && question.learningStyle && answer.isCorrect !== undefined) {
            stylePerformance[question.learningStyle].total += 1;
            
            if (answer.isCorrect) {
              stylePerformance[question.learningStyle].correct += 1;
            }
          }
        });
        
        // Update learning style scores
        Object.keys(stylePerformance).forEach(style => {
          if (stylePerformance[style].total > 0) {
            const correctRate = stylePerformance[style].correct / stylePerformance[style].total;
            
            // Update learning style score with a weighted average
            // 30% new data, 70% existing data
            studentProfile.learningStyles[style] = 
              (studentProfile.learningStyles[style] * 0.7) + (correctRate * 100 * 0.3);
          }
        });
        
        // Determine recommended learning style
        let bestStyle = null;
        let bestScore = 0;
        
        Object.keys(studentProfile.learningStyles).forEach(style => {
          if (studentProfile.learningStyles[style] > bestScore) {
            bestScore = studentProfile.learningStyles[style];
            bestStyle = style;
          }
        });
        
        studentProfile.recommendedLearningStyle = bestStyle;
      }

      // Update subject performance
      const subjectId = homework.subjectId.toString();
      const currentPerformance = studentProfile.subjectPerformance.get(subjectId) || {
        averageScore: 0,
        questionsAttempted: 0,
        lastSubmissionDate: null,
      };
      
      const scorePercentage = submission.totalObtainedMarks / submission.totalMarks * 100;
      const newQuestionsAttempted = currentPerformance.questionsAttempted + homework.questions.length;
      
      // Calculate new average score
      const newAvgScore = 
        ((currentPerformance.averageScore * currentPerformance.questionsAttempted) + 
        (scorePercentage * homework.questions.length)) / newQuestionsAttempted;
      
      studentProfile.subjectPerformance.set(subjectId, {
        averageScore: newAvgScore,
        questionsAttempted: newQuestionsAttempted,
        lastSubmissionDate: new Date(),
      });
      
      await studentProfile.save();
    }

    res.status(200).json({
      success: true,
      message: "Homework submitted successfully",
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a student's homework submission
 * @route   GET /api/v1/homework-submissions/:homeworkId/student
 * @access  Private (Student - own submission only)
 */
export const getStudentSubmission = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get studentId and schoolId from authenticated user
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Find submission
    const submission = await HomeworkSubmission.findOne({
      homeworkId,
      studentId,
      schoolId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Get homework details
    const homework = await Homework.findOne({
      _id: homeworkId,
      schoolId,
    }).populate("classId", "name").populate("subjectId", "name");

    res.status(200).json({
      success: true,
      data: {
        submission,
        homework,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for a homework assignment
 * @route   GET /api/v1/homework-submissions/:homeworkId
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const getHomeworkSubmissions = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Check if the homework exists
    const homework = await Homework.findOne({
      _id: homeworkId,
      schoolId,
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // If teacher, verify they created this homework or teach this class
    if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      const isCreator = homework.createdBy.toString() === req.user._id.toString();
      
      if (!isCreator) {
        const isTeaching = req.user.assignedClasses.some(
          (assignment) =>
            assignment.classId.toString() === homework.classId.toString() &&
            assignment.subjectIds.includes(homework.subjectId.toString())
        );
        
        if (!isTeaching) {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to view these submissions",
          });
        }
      }
    }

    // Build query
    const query = {
      homeworkId,
      schoolId,
    };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get submissions with student details
    const submissions = await HomeworkSubmission.find(query)
      .populate("studentId", "fullName email username")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await HomeworkSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        submissions,
        homework,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Grade a student's homework submission
 * @route   PUT /api/v1/homework-submissions/:submissionId/grade
 * @access  Private (Teacher, ClassTeacher)
 */
export const gradeHomeworkSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { answers, feedback } = req.body;

    // Validate submissionId
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
    }

    // Get teacher info
    const teacherId = req.user._id;
    const schoolId = req.user.schoolId;

    // Find submission
    const submission = await HomeworkSubmission.findOne({
      _id: submissionId,
      schoolId,
    }).populate("homeworkId");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Verify the teacher is authorized to grade this submission
    const homework = await Homework.findOne({
      _id: submission.homeworkId,
      schoolId,
    });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    const isCreator = homework.createdBy.toString() === teacherId.toString();
    
    if (!isCreator) {
      const isTeaching = req.user.assignedClasses.some(
        (assignment) =>
          assignment.classId.toString() === homework.classId.toString() &&
          assignment.subjectIds.includes(homework.subjectId.toString())
      );
      
      if (!isTeaching) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to grade this submission",
        });
      }
    }

    // Update answers with grades
    if (answers && answers.length > 0) {
      let totalObtainedMarks = 0;

      // Update each answer
      answers.forEach((gradedAnswer) => {
        const answerIndex = submission.answers.findIndex(
          (a) => a.questionId.toString() === gradedAnswer.questionId.toString()
        );

        if (answerIndex !== -1) {
          submission.answers[answerIndex].marks = gradedAnswer.marks || 0;
          submission.answers[answerIndex].feedback = gradedAnswer.feedback || "";
          submission.answers[answerIndex].isCorrect = gradedAnswer.isCorrect || false;
          submission.answers[answerIndex].gradedBy = teacherId;
          submission.answers[answerIndex].gradedAt = new Date();

          totalObtainedMarks += gradedAnswer.marks || 0;
        }
      });

      // Update total obtained marks
      submission.totalObtainedMarks = totalObtainedMarks;
    }

    // Update submission status and feedback
    submission.status = "graded";
    submission.feedback = feedback || "";
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date();

    await submission.save();

    // Update student profile with learning data
    if (homework.personalizationEnabled) {
      // This could be moved to a background job for performance in a real system
      const studentProfile = await StudentProfile.findOne({
        studentId: submission.studentId,
        schoolId,
      });

      if (studentProfile) {
        // Update analytics similar to the submit function
        // (could extract this logic to a shared helper function)
        // ... implementation omitted for brevity ...
      }
    }

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get subjective answer assessment for AI grading
 * @route   POST /api/v1/homework-submissions/assess
 * @access  Private (Teacher, ClassTeacher)
 */
export const assessSubjectiveAnswer = async (req, res, next) => {
  try {
    const { questionText, modelAnswer, studentAnswer } = req.body;

    // Validate required fields
    if (!questionText || !modelAnswer || !studentAnswer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // In a real implementation, this would call an AI service
    // For now, we'll simulate a basic assessment
    
    // Simple word matching algorithm (in a real app, use NLP or LLM)
    const modelWords = new Set(modelAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const studentWords = studentAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const matchedWords = studentWords.filter(word => modelWords.has(word));
    const matchPercentage = modelWords.size > 0 ? (matchedWords.length / modelWords.size * 100) : 0;
    
    // Generate a simple assessment based on match percentage
    let assessment = {
      similarityScore: matchPercentage,
      suggestedMarks: 0,
      feedback: "",
      keyConceptsMissing: [],
      keyConceptsIdentified: matchedWords,
    };
    
    // Determine suggested marks out of 10
    if (matchPercentage >= 80) {
      assessment.suggestedMarks = 10;
      assessment.feedback = "Excellent answer that covers all key concepts.";
    } else if (matchPercentage >= 60) {
      assessment.suggestedMarks = 8;
      assessment.feedback = "Good answer that covers most key concepts.";
    } else if (matchPercentage >= 40) {
      assessment.suggestedMarks = 6;
      assessment.feedback = "Adequate answer but missing some key concepts.";
    } else if (matchPercentage >= 20) {
      assessment.suggestedMarks = 4;
      assessment.feedback = "Below average answer missing many key concepts.";
    } else {
      assessment.suggestedMarks = 2;
      assessment.feedback = "Poor answer with minimal relevant content.";
    }
    
    // Identify missing concepts
    assessment.keyConceptsMissing = Array.from(modelWords).filter(word => !matchedWords.includes(word));
    
    res.status(200).json({
      success: true,
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student learning analytics
 * @route   GET /api/v1/homework-submissions/analytics/:studentId
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin, Student-self)
 */
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // For security, students can only view their own analytics
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these analytics",
      });
    }

    // Get student profile
    const studentProfile = await StudentProfile.findOne({
      studentId,
      schoolId,
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Get submission analytics
    const submissionStats = await HomeworkSubmission.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId), schoolId: mongoose.Types.ObjectId(schoolId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgScore: {
            $avg: {
              $cond: [
                { $eq: ["$status", "graded"] },
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                0,
              ],
            },
          },
        },
      },
    ]);

    // Get performance by subject
    const subjectPerformance = Array.from(studentProfile.subjectPerformance).map(
      ([subjectId, data]) => ({
        subjectId,
        ...data,
      })
    );

    // Get recent submissions
    const recentSubmissions = await HomeworkSubmission.find({
      studentId,
      schoolId,
      status: "graded",
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate({
        path: "homeworkId",
        select: "title subjectId",
        populate: {
          path: "subjectId",
          select: "name",
        },
      });

    // Prepare analytics data
    const analytics = {
      learningStyles: studentProfile.learningStyles,
      recommendedLearningStyle: studentProfile.recommendedLearningStyle,
      difficultyPerformance: studentProfile.performanceByDifficulty,
      recommendedDifficultyLevel: studentProfile.recommendedDifficultyLevel,
      submissionStats: submissionStats.reduce((acc, curr) => {
        acc[curr._id] = {
          count: curr.count,
          avgScore: curr.avgScore,
        };
        return acc;
      }, {}),
      subjectPerformance,
      recentSubmissions: recentSubmissions.map(sub => ({
        submissionId: sub._id,
        homeworkTitle: sub.homeworkId?.title || "Unknown",
        subjectName: sub.homeworkId?.subjectId?.name || "Unknown",
        score: (sub.totalObtainedMarks / sub.totalMarks) * 100,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt,
      })),
      personalizationSettings: {
        personalizationEnabled: studentProfile.personalizationEnabled,
        adaptiveDifficultyEnabled: studentProfile.adaptiveDifficultyEnabled,
        learningStylePreferenceEnabled: studentProfile.learningStylePreferenceEnabled,
      },
    };

    res.status(200).json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student personalization settings
 * @route   PUT /api/v1/homework-submissions/settings
 * @access  Private (Student)
 */
export const updatePersonalizationSettings = async (req, res, next) => {
  try {
    const {
      personalizationEnabled,
      adaptiveDifficultyEnabled,
      learningStylePreferenceEnabled,
    } = req.body;

    // Get student info
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Find or create student profile
    let studentProfile = await StudentProfile.findOne({
      studentId,
      schoolId,
    });

    if (!studentProfile) {
      studentProfile = new StudentProfile({
        studentId,
        schoolId,
      });
    }

    // Update settings if provided
    if (personalizationEnabled !== undefined) {
      studentProfile.personalizationEnabled = personalizationEnabled;
    }
    
    if (adaptiveDifficultyEnabled !== undefined) {
      studentProfile.adaptiveDifficultyEnabled = adaptiveDifficultyEnabled;
    }
    
    if (learningStylePreferenceEnabled !== undefined) {
      studentProfile.learningStylePreferenceEnabled = learningStylePreferenceEnabled;
    }

    await studentProfile.save();

    res.status(200).json({
      success: true,
      message: "Personalization settings updated successfully",
      data: {
        settings: {
          personalizationEnabled: studentProfile.personalizationEnabled,
          adaptiveDifficultyEnabled: studentProfile.adaptiveDifficultyEnabled,
          learningStylePreferenceEnabled: studentProfile.learningStylePreferenceEnabled,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}; 