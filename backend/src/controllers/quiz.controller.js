import { Quiz } from "../models/quiz.model.js";
import { QuizAttempt } from "../models/quizAttempt.model.js";
import { Class } from "../models/class.model.js";
import { Subject } from "../models/subject.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new quiz
 * @route   POST /api/v1/quizzes
 * @access  Private (Teacher, ClassTeacher)
 */
export const createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      classId,
      subjectId,
      startDate,
      endDate,
      duration,
      questions,
      settings,
      instructions,
      grading,
      features
    } = req.body;

    // Validate required fields
    if (!title || !classId || !subjectId || !startDate || !endDate || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, classId, subjectId, startDate, endDate, duration are required",
      });
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();

    if (startDateObj >= endDateObj) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (endDateObj <= now) {
      return res.status(400).json({
        success: false,
        message: "End date must be in the future",
      });
    }

    // Validate duration (1 minute to 5 hours)
    if (duration < 1 || duration > 300) {
      return res.status(400).json({
        success: false,
        message: "Duration must be between 1 and 300 minutes",
      });
    }

    const schoolId = req.user.schoolId;
    const createdBy = req.user._id;

    // Verify the class exists and belongs to school
    const classObj = await Class.findOne({ _id: classId, schoolId });
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: "Class not found or you don't have access to this class",
      });
    }

    // Verify the subject exists and belongs to the school
    const subject = await Subject.findOne({ _id: subjectId, schoolId });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // For teachers, verify they teach this subject in this class
    if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      const isAuthorized = req.user.assignedClasses.some(
        (assignment) =>
          assignment.classId.toString() === classId &&
          assignment.subjectIds.includes(subjectId)
      );

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to create quizzes for this class and subject",
        });
      }
    }

    // Validate questions
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one question is required",
      });
    }

    // Validate each question
    const validatedQuestions = questions.map((q, index) => {
      if (!q.questionText || !q.questionType || !q.marks) {
        throw new Error(`Question ${index + 1}: questionText, questionType, and marks are required`);
      }

      const validTypes = ["multiple_choice", "single_choice", "true_false", "short_answer", "essay"];
      if (!validTypes.includes(q.questionType)) {
        throw new Error(`Question ${index + 1}: Invalid question type`);
      }

      // Validate options for choice questions
      if (["multiple_choice", "single_choice", "true_false"].includes(q.questionType)) {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Question ${index + 1}: At least 2 options are required for choice questions`);
        }

        const correctOptions = q.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
          throw new Error(`Question ${index + 1}: At least one correct option is required`);
        }

        if (q.questionType === "single_choice" && correctOptions.length > 1) {
          throw new Error(`Question ${index + 1}: Single choice questions can have only one correct option`);
        }
      }

      return {
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer?.trim() || "",
        marks: Math.max(0.5, Math.min(100, parseFloat(q.marks))),
        negativeMarks: Math.max(0, parseFloat(q.negativeMarks || 0)),
        difficultyLevel: q.difficultyLevel || "medium",
        timeLimit: q.timeLimit ? Math.max(10, Math.min(3600, parseInt(q.timeLimit))) : undefined,
        required: Boolean(q.required),
        attachments: q.attachments || [],
        stats: {
          timesAttempted: 0,
          correctResponses: 0,
          averageTimeSpent: 0
        }
      };
    });

    // Prepare quiz data
    const quizData = {
      title: title.trim(),
      description: description?.trim() || "",
      classId,
      subjectId,
      createdBy,
      schoolId,
      startDate: startDateObj,
      endDate: endDateObj,
      duration: parseInt(duration),
      questions: validatedQuestions,
      instructions: instructions?.trim() || "",
      settings: {
        maxAttempts: Math.max(1, Math.min(10, parseInt(settings?.maxAttempts || 1))),
        shuffleQuestions: Boolean(settings?.shuffleQuestions ?? true),
        shuffleOptions: Boolean(settings?.shuffleOptions ?? true),
        showResults: settings?.showResults || "after_end",
        showCorrectAnswers: Boolean(settings?.showCorrectAnswers),
        allowReview: Boolean(settings?.allowReview ?? true),
        requirePassword: Boolean(settings?.requirePassword),
        password: settings?.password || "",
        proctoring: {
          enabled: Boolean(settings?.proctoring?.enabled),
          lockdownBrowser: Boolean(settings?.proctoring?.lockdownBrowser),
          webcamRequired: Boolean(settings?.proctoring?.webcamRequired),
          plagiarismCheck: Boolean(settings?.proctoring?.plagiarismCheck)
        }
      },
      grading: {
        gradingMethod: grading?.gradingMethod || "automatic",
        partialCredits: Boolean(grading?.partialCredits),
        passingMarks: grading?.passingMarks || undefined
      },
      features: {
        calculator: Boolean(features?.calculator),
        formulaSheet: Boolean(features?.formulaSheet),
        dictionary: Boolean(features?.dictionary),
        notepad: Boolean(features?.notepad)
      },
      status: "draft"
    };

    // Create the quiz
    const newQuiz = await Quiz.create(quizData);

    // Populate response data
    const populatedQuiz = await Quiz.findById(newQuiz._id)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName email");

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: populatedQuiz,
    });

  } catch (error) {
    console.error("Error creating quiz:", error);
    next(error);
  }
};

/**
 * @desc    Get quizzes for teacher
 * @route   GET /api/v1/quizzes/teacher
 * @access  Private (Teacher, ClassTeacher)
 */
export const getTeacherQuizzes = async (req, res, next) => {
  try {
    const { status, classId, subjectId, page = 1, limit = 10 } = req.query;
    const teacherId = req.user._id;
    const schoolId = req.user.schoolId;

    // Build query
    const query = { createdBy: teacherId, schoolId };

    if (status) {
      query.status = status;
    }

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = classId;
    }

    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      query.subjectId = subjectId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get quizzes with pagination
    const quizzes = await Quiz.find(query)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Quiz.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quizzes.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: { quizzes },
    });

  } catch (error) {
    console.error("Error getting teacher quizzes:", error);
    next(error);
  }
};

/**
 * @desc    Get quizzes for student
 * @route   GET /api/v1/quizzes/student
 * @access  Private (Student)
 */
export const getStudentQuizzes = async (req, res, next) => {
  try {
    const { status, subjectId } = req.query;
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Get student's enrolled classes
    const student = await User.findById(studentId).select("enrolledClasses");
    if (!student || !student.enrolledClasses.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: { quizzes: [] },
      });
    }

    const classIds = student.enrolledClasses;

    // Build query for quizzes in student's classes
    const query = {
      schoolId,
      classId: { $in: classIds },
      status: { $in: ["published", "active"] }
    };

    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      query.subjectId = subjectId;
    }

    // Additional filters based on status
    const now = new Date();
    if (status === "upcoming") {
      query.startDate = { $gt: now };
    } else if (status === "active") {
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === "completed") {
      query.endDate = { $lt: now };
    }

    // Get quizzes
    const quizzes = await Quiz.find(query)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName")
      .sort({ startDate: 1 });

    // For each quiz, get student's attempt information
    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await QuizAttempt.find({
          quizId: quiz._id,
          studentId: studentId
        }).sort({ attemptNumber: -1 });

        const quizObj = quiz.toObject();
        quizObj.studentAttempts = attempts.length;
        quizObj.maxAttempts = quiz.settings.maxAttempts;
        quizObj.canAttempt = quiz.canAttempt(attempts.length);
        quizObj.bestScore = attempts.length > 0 
          ? Math.max(...attempts.map(attempt => attempt.results.percentage || 0)) 
          : null;
        quizObj.lastAttempt = attempts.length > 0 ? attempts[0] : null;
        quizObj.currentStatus = quiz.currentStatus;

        return quizObj;
      })
    );

    res.status(200).json({
      success: true,
      count: quizzesWithAttempts.length,
      data: { quizzes: quizzesWithAttempts },
    });

  } catch (error) {
    console.error("Error getting student quizzes:", error);
    next(error);
  }
};

/**
 * @desc    Get quiz by ID
 * @route   GET /api/v1/quizzes/:quizId
 * @access  Private
 */
export const getQuizById = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const schoolId = req.user.schoolId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    // Find quiz
    const quiz = await Quiz.findOne({ _id: quizId, schoolId })
      .populate("classId", "name yearOrGradeLevel students")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName email");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check permissions based on user role
    if (req.user.role === "student") {
      // Check if student is enrolled in the class
      const student = await User.findById(req.user._id).select("enrolledClasses");
      const isEnrolled = student.enrolledClasses.some(
        (classId) => classId.toString() === quiz.classId._id.toString()
      );

      if (!isEnrolled) {
        return res.status(403).json({
          success: false,
          message: "You are not enrolled in this class",
        });
      }

      // Get student's attempts
      const attempts = await QuizAttempt.find({
        quizId: quiz._id,
        studentId: req.user._id
      }).sort({ attemptNumber: -1 });

      // Prepare student view (hide correct answers based on settings)
      const studentQuiz = quiz.toObject();
      
      // Hide correct answers and explanations if not allowed
      if (!quiz.settings.showCorrectAnswers) {
        studentQuiz.questions = studentQuiz.questions.map(q => ({
          ...q,
          options: q.options?.map(opt => ({
            text: opt.text,
            _id: opt._id
            // Hide isCorrect and explanation
          }))
        }));
      }

      studentQuiz.studentAttempts = attempts.length;
      studentQuiz.canAttempt = quiz.canAttempt(attempts.length);
      studentQuiz.lastAttempt = attempts.length > 0 ? attempts[0] : null;

      return res.status(200).json({
        success: true,
        data: studentQuiz,
      });

    } else if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      // Verify teacher has access to this quiz
      if (quiz.createdBy._id.toString() !== req.user._id.toString()) {
        // Check if teacher teaches this subject in this class
        const hasAccess = req.user.assignedClasses.some(
          (assignment) =>
            assignment.classId.toString() === quiz.classId._id.toString() &&
            assignment.subjectIds.includes(quiz.subjectId._id.toString())
        );

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "You don't have access to this quiz",
          });
        }
      }

      // Get quiz statistics for teacher
      const stats = await QuizAttempt.aggregate([
        { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const teacherQuiz = quiz.toObject();
      teacherQuiz.statistics = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        data: teacherQuiz,
      });

    } else {
      // School admin - full access
      return res.status(200).json({
        success: true,
        data: quiz,
      });
    }

  } catch (error) {
    console.error("Error getting quiz:", error);
    next(error);
  }
};

/**
 * @desc    Update quiz
 * @route   PUT /api/v1/quizzes/:quizId
 * @access  Private (Teacher, ClassTeacher)
 */
export const updateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const schoolId = req.user.schoolId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    // Find quiz
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check permissions
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own quizzes",
      });
    }

    // Check if quiz has attempts - restrict some updates
    const hasAttempts = await QuizAttempt.exists({ quizId: quiz._id });
    
    if (hasAttempts) {
      // Only allow limited updates if quiz has attempts
      const allowedUpdates = ['description', 'instructions', 'endDate'];
      const requestedUpdates = Object.keys(req.body);
      const hasRestrictedUpdates = requestedUpdates.some(update => !allowedUpdates.includes(update));
      
      if (hasRestrictedUpdates) {
        return res.status(400).json({
          success: false,
          message: "Cannot modify quiz structure after students have attempted it. Only description, instructions, and end date can be updated.",
        });
      }
    }

    // Update quiz
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        quiz[key] = req.body[key];
      }
    });

    await quiz.save();

    // Populate response data
    const updatedQuiz = await Quiz.findById(quiz._id)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });

  } catch (error) {
    console.error("Error updating quiz:", error);
    next(error);
  }
};

/**
 * @desc    Delete quiz
 * @route   DELETE /api/v1/quizzes/:quizId
 * @access  Private (Teacher, ClassTeacher)
 */
export const deleteQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const schoolId = req.user.schoolId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    // Find quiz
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check permissions
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own quizzes",
      });
    }

    // Check if quiz has attempts
    const hasAttempts = await QuizAttempt.exists({ quizId: quiz._id });
    
    if (hasAttempts) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete quiz with existing student attempts",
      });
    }

    // Delete quiz
    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    next(error);
  }
};

/**
 * @desc    Publish quiz
 * @route   POST /api/v1/quizzes/:quizId/publish
 * @access  Private (Teacher, ClassTeacher)
 */
export const publishQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const schoolId = req.user.schoolId;

    // Find quiz
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check permissions
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only publish your own quizzes",
      });
    }

    // Validate quiz before publishing
    if (quiz.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot publish quiz without questions",
      });
    }

    // Check if start date is valid
    const now = new Date();
    if (quiz.endDate <= now) {
      return res.status(400).json({
        success: false,
        message: "Cannot publish quiz with end date in the past",
      });
    }

    // Update quiz status
    quiz.status = "published";
    quiz.publishedAt = now;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz published successfully",
      data: quiz,
    });

  } catch (error) {
    console.error("Error publishing quiz:", error);
    next(error);
  }
};

/**
 * @desc    Start quiz attempt
 * @route   POST /api/v1/quizzes/:quizId/attempt
 * @access  Private (Student)
 */
export const startQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { password } = req.body;
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    // Find quiz
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if student is enrolled in the class
    const student = await User.findById(studentId).select("enrolledClasses");
    const isEnrolled = student.enrolledClasses.some(
      (classId) => classId.toString() === quiz.classId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this class",
      });
    }

    // Check if quiz is active
    if (!quiz.isActive()) {
      return res.status(400).json({
        success: false,
        message: "Quiz is not currently active",
      });
    }

    // Check password if required
    if (quiz.settings.requirePassword) {
      if (!password || password !== quiz.settings.password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect quiz password",
        });
      }
    }

    // Check previous attempts
    const existingAttempts = await QuizAttempt.find({
      quizId: quiz._id,
      studentId: studentId
    }).sort({ attemptNumber: -1 });

    // Check if student has exceeded max attempts
    if (existingAttempts.length >= quiz.settings.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum attempts (${quiz.settings.maxAttempts}) exceeded`,
      });
    }

    // Check if student has an active attempt
    const activeAttempt = existingAttempts.find(attempt => attempt.status === "in_progress");
    if (activeAttempt) {
      // Check if active attempt is still valid
      if (activeAttempt.isValid(quiz)) {
        // Return existing active attempt
        const questions = quiz.getRandomizedQuestions(studentId.toString());
        return res.status(200).json({
          success: true,
          message: "Resuming existing attempt",
          data: {
            attempt: activeAttempt,
            questions: questions,
            timeRemaining: Math.max(0, quiz.duration * 60 - activeAttempt.timeSpent)
          },
        });
      } else {
        // Auto-submit expired attempt
        activeAttempt.autoSubmitIfExpired(quiz);
        await activeAttempt.save();
      }
    }

    // Create new attempt
    const attemptNumber = existingAttempts.length + 1;
    const questions = quiz.getRandomizedQuestions(studentId.toString());

    // Prepare answers structure
    const answers = questions.map(question => ({
      questionId: question._id,
      questionType: question.questionType,
      maxMarks: question.marks,
      timeSpent: 0,
      attempts: 0,
      flagged: false,
      visitedAt: new Date()
    }));

    const newAttempt = await QuizAttempt.create({
      quizId: quiz._id,
      studentId: studentId,
      schoolId: schoolId,
      attemptNumber: attemptNumber,
      answers: answers,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      }
    });

    res.status(201).json({
      success: true,
      message: "Quiz attempt started successfully",
      data: {
        attempt: newAttempt,
        questions: questions,
        timeRemaining: quiz.duration * 60
      },
    });

  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    next(error);
  }
};

/**
 * @desc    Submit answer for a question
 * @route   POST /api/v1/quizzes/:quizId/attempt/:attemptId/answer
 * @access  Private (Student)
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { quizId, attemptId } = req.params;
    const { questionId, answer, timeSpent } = req.body;
    const studentId = req.user._id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(quizId) || 
        !mongoose.Types.ObjectId.isValid(attemptId) ||
        !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID provided",
      });
    }

    // Find quiz and attempt
    const quiz = await Quiz.findById(quizId);
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      quizId: quizId,
      studentId: studentId
    });

    if (!quiz || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz or attempt not found",
      });
    }

    // Check if attempt is still valid
    if (!attempt.isValid(quiz)) {
      // Auto-submit if expired
      attempt.autoSubmitIfExpired(quiz);
      await attempt.save();
      
      return res.status(400).json({
        success: false,
        message: "Quiz attempt has expired",
      });
    }

    // Find the question in the attempt
    const questionIndex = attempt.answers.findIndex(
      ans => ans.questionId.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this attempt",
      });
    }

    // Find the question details in the quiz
    const quizQuestion = quiz.questions.find(q => q._id.toString() === questionId);
    if (!quizQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found in quiz",
      });
    }

    // Update the answer
    const answerData = attempt.answers[questionIndex];
    
    // Store answer based on question type
    if (quizQuestion.questionType === "multiple_choice" || quizQuestion.questionType === "single_choice") {
      answerData.selectedOptions = Array.isArray(answer) ? answer : [answer];
    } else if (quizQuestion.questionType === "true_false") {
      answerData.booleanAnswer = Boolean(answer);
    } else if (quizQuestion.questionType === "short_answer" || quizQuestion.questionType === "essay") {
      answerData.textAnswer = answer?.toString()?.trim() || "";
    }

    // Update metadata
    answerData.timeSpent = (answerData.timeSpent || 0) + Math.max(0, parseInt(timeSpent || 0));
    answerData.attempts = (answerData.attempts || 0) + 1;
    answerData.answeredAt = new Date();

    // Update the attempt
    attempt.answers[questionIndex] = answerData;
    attempt.markModified('answers');
    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      data: {
        questionId: questionId,
        timeSpent: answerData.timeSpent
      },
    });

  } catch (error) {
    console.error("Error submitting answer:", error);
    next(error);
  }
};

/**
 * @desc    Submit quiz attempt
 * @route   POST /api/v1/quizzes/:quizId/attempt/:attemptId/submit
 * @access  Private (Student)
 */
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, attemptId } = req.params;
    const studentId = req.user._id;

    // Find quiz and attempt
    const quiz = await Quiz.findById(quizId);
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      quizId: quizId,
      studentId: studentId
    });

    if (!quiz || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz or attempt not found",
      });
    }

    // Check if attempt is already submitted
    if (attempt.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Attempt has already been submitted",
      });
    }

    // Update attempt status
    attempt.status = "submitted";
    attempt.submittedAt = new Date();
    attempt.timeSpent = Math.floor((attempt.submittedAt - attempt.startedAt) / 1000);

    // Auto-grade objective questions
    attempt.autoGradeObjective(quiz);

    // Save attempt
    await attempt.save();

    // Update quiz statistics
    quiz.statistics.totalAttempts = (quiz.statistics.totalAttempts || 0) + 1;
    if (attempt.status === "submitted") {
      quiz.statistics.completedAttempts = (quiz.statistics.completedAttempts || 0) + 1;
    }
    await quiz.save();

    // Prepare response based on quiz settings
    let responseData = {
      attemptId: attempt._id,
      submittedAt: attempt.submittedAt,
      timeSpent: attempt.timeSpentFormatted
    };

    // Include results if allowed
    if (quiz.settings.showResults === "immediately" || 
        (quiz.settings.showResults === "after_end" && new Date() > quiz.endDate)) {
      responseData.results = attempt.results;
    }

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);
    next(error);
  }
};

/**
 * @desc    Get quiz attempts for a student
 * @route   GET /api/v1/quizzes/:quizId/attempts/student
 * @access  Private (Student)
 */
export const getStudentQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user._id;

    const attempts = await QuizAttempt.find({
      quizId: quizId,
      studentId: studentId
    })
    .sort({ attemptNumber: -1 })
    .populate("quizId", "title settings grading");

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: { attempts },
    });

  } catch (error) {
    console.error("Error getting student attempts:", error);
    next(error);
  }
};

/**
 * @desc    Get all attempts for a quiz (Teacher view)
 * @route   GET /api/v1/quizzes/:quizId/attempts
 * @access  Private (Teacher, ClassTeacher)
 */
export const getQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;
    const schoolId = req.user.schoolId;

    // Find quiz and verify access
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check teacher permissions
    if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      if (quiz.createdBy.toString() !== req.user._id.toString()) {
        const hasAccess = req.user.assignedClasses.some(
          (assignment) =>
            assignment.classId.toString() === quiz.classId.toString() &&
            assignment.subjectIds.includes(quiz.subjectId.toString())
        );

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "You don't have access to this quiz",
          });
        }
      }
    }

    // Build query
    const query = { quizId: quiz._id };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get attempts with student information
    const attempts = await QuizAttempt.find(query)
      .populate("studentId", "fullName email enrolledClasses")
      .sort({ submittedAt: -1, startedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await QuizAttempt.countDocuments(query);

    res.status(200).json({
      success: true,
      count: attempts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: { attempts },
    });

  } catch (error) {
    console.error("Error getting quiz attempts:", error);
    next(error);
  }
};

/**
 * @desc    Get quiz attempt details
 * @route   GET /api/v1/quizzes/:quizId/attempts/:attemptId
 * @access  Private
 */
export const getQuizAttemptDetails = async (req, res, next) => {
  try {
    const { quizId, attemptId } = req.params;
    const schoolId = req.user.schoolId;

    // Find quiz and attempt
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    const attempt = await QuizAttempt.findById(attemptId)
      .populate("studentId", "fullName email")
      .populate("quizId", "title settings");

    if (!quiz || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz or attempt not found",
      });
    }

    // Check permissions
    if (req.user.role === "student") {
      if (attempt.studentId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own attempts",
        });
      }
    } else if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      if (quiz.createdBy.toString() !== req.user._id.toString()) {
        const hasAccess = req.user.assignedClasses.some(
          (assignment) =>
            assignment.classId.toString() === quiz.classId.toString() &&
            assignment.subjectIds.includes(quiz.subjectId.toString())
        );

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "You don't have access to this quiz",
          });
        }
      }
    }

    // Prepare detailed response with questions and answers
    const detailedAttempt = attempt.toObject();
    
    // Add question details to answers
    detailedAttempt.answers = attempt.answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
      return {
        ...answer,
        question: question ? {
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          marks: question.marks,
          difficultyLevel: question.difficultyLevel
        } : null
      };
    });

    res.status(200).json({
      success: true,
      data: detailedAttempt,
    });

  } catch (error) {
    console.error("Error getting attempt details:", error);
    next(error);
  }
};

/**
 * @desc    Grade quiz attempt manually
 * @route   POST /api/v1/quizzes/:quizId/attempts/:attemptId/grade
 * @access  Private (Teacher, ClassTeacher)
 */
export const gradeQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, attemptId } = req.params;
    const { grades, teacherComments } = req.body;
    const teacherId = req.user._id;
    const schoolId = req.user.schoolId;

    // Find quiz and attempt
    const quiz = await Quiz.findOne({ _id: quizId, schoolId });
    const attempt = await QuizAttempt.findById(attemptId);

    if (!quiz || !attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz or attempt not found",
      });
    }

    // Check teacher permissions
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const hasAccess = req.user.assignedClasses.some(
        (assignment) =>
          assignment.classId.toString() === quiz.classId.toString() &&
          assignment.subjectIds.includes(quiz.subjectId.toString())
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "You don't have access to grade this quiz",
        });
      }
    }

    // Update grades
    if (grades && Array.isArray(grades)) {
      grades.forEach(grade => {
        const answerIndex = attempt.answers.findIndex(
          ans => ans.questionId.toString() === grade.questionId
        );
        
        if (answerIndex !== -1) {
          attempt.answers[answerIndex].marks = Math.max(0, parseFloat(grade.marks || 0));
          attempt.answers[answerIndex].feedback = grade.feedback || "";
          attempt.answers[answerIndex].gradedBy = teacherId;
          attempt.answers[answerIndex].gradedAt = new Date();
          attempt.answers[answerIndex].autoGraded = false;
        }
      });
    }

    // Update teacher comments
    if (teacherComments) {
      attempt.teacherComments = teacherComments;
      attempt.reviewedBy = teacherId;
      attempt.reviewedAt = new Date();
    }

    // Recalculate results
    attempt.calculateAnalytics();
    
    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Quiz graded successfully",
      data: attempt,
    });

  } catch (error) {
    console.error("Error grading quiz:", error);
    next(error);
  }
}; 