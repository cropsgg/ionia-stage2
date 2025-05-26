import { HomeworkSubmission } from "../models/homeworkSubmission.model.js";
import { Homework } from "../models/homework.model.js";
import { StudentProfile } from "../models/studentProfile.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

/**
 * @desc    Submit homework answers
 * @route   POST /api/v1/homework-submissions/:homeworkId
 * @access  Private (Student)
 */
export const submitHomework = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const { answers, timeSpent, submissionText } = req.body;

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

    // Process file attachments if present
    let submissionAttachments = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} submission attachments...`);
      
      for (const file of req.files) {
        try {
          const uploadResult = await uploadOnCloudinary(file.path);
          if (uploadResult) {
            submissionAttachments.push({
              fileName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileUrl: uploadResult.secure_url,
              uploadedAt: new Date()
            });
            console.log(`Submission file uploaded: ${file.originalname}`);
          }
        } catch (uploadError) {
          console.error(`Error uploading submission file ${file.originalname}:`, uploadError);
        }
      }
    }

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
        totalMarks: homework.questions.reduce((sum, q) => sum + (q.marks || 1), 0),
        timeSpent: timeSpent || 0,
        submissionText: submissionText || "",
        submissionAttachments
      });
    } else {
      // Update existing submission
      submission.status = isDueDatePassed ? "late" : "submitted";
      submission.submittedAt = new Date();
      submission.submissionText = submissionText || submission.submissionText;
      
      if (timeSpent) {
        submission.timeSpent = timeSpent;
      }

      // Add new attachments to existing ones
      if (submissionAttachments.length > 0) {
        submission.submissionAttachments = [
          ...(submission.submissionAttachments || []),
          ...submissionAttachments
        ];
      }
    }

    // Process answers if provided
    if (answers && Array.isArray(answers)) {
    let totalObtainedMarks = 0;
    
      const processedAnswers = answers.map(answer => {
      // Find the corresponding question
      const question = homework.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );

      if (question && question.questionType === "objective") {
          // Auto-grade objective questions
        const correctOptions = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt._id.toString());

          const selectedOptions = (answer.selectedOptions || []).map((opt) => opt.toString());

        // Check if arrays are identical (same elements, regardless of order)
        const isCorrect =
          correctOptions.length === selectedOptions.length &&
          correctOptions.every((opt) => selectedOptions.includes(opt));

          const marks = isCorrect ? question.marks || 1 : 0;
          totalObtainedMarks += marks;

          return {
            questionId: answer.questionId,
            answerText: answer.answerText || "",
            selectedOptions: answer.selectedOptions || [],
            marks,
            isCorrect,
            feedback: isCorrect ? "Correct answer!" : "Incorrect. Please review the material.",
            gradedAt: new Date()
          };
        } else {
          // Subjective questions - need manual grading
          return {
            questionId: answer.questionId,
            answerText: answer.answerText || "",
            selectedOptions: answer.selectedOptions || [],
            marks: 0, // Will be set during manual grading
            isCorrect: null, // Will be determined during grading
            feedback: "", // Will be added during grading
            gradedAt: null
          };
        }
      });

      submission.answers = processedAnswers;
      submission.totalObtainedMarks = totalObtainedMarks;

      // Update status based on grading completion
      const hasSubjectiveQuestions = homework.questions.some(q => q.questionType === "subjective");
      if (!hasSubjectiveQuestions) {
        submission.status = "graded"; // Auto-graded if all questions are objective
      }
    }

    await submission.save();
      
    // Populate response data
    const populatedSubmission = await HomeworkSubmission.findById(submission._id)
      .populate({
        path: "homeworkId",
        select: "title description dueDate difficultyLevel questions",
        populate: [
          { path: "classId", select: "name" },
          { path: "subjectId", select: "name subjectCode" }
        ]
      })
      .populate("studentId", "fullName email");

    res.status(200).json({
      success: true,
      message: isDueDatePassed ? 
        "Homework submitted successfully (marked as late)" : 
        "Homework submitted successfully",
      data: { 
        submission: populatedSubmission,
        attachmentsUploaded: submissionAttachments.length,
        autoGraded: submission.status === "graded"
      },
    });
  } catch (error) {
    console.error("Error submitting homework:", error);
    next(error);
  }
};

/**
 * @desc    Get student's submission for a homework
 * @route   GET /api/v1/homework-submissions/:homeworkId/student
 * @access  Private (Student)
 */
export const getStudentSubmission = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get homework details
    const homework = await Homework.findOne({ _id: homeworkId, schoolId })
      .populate("classId", "name")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName");

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // Get student's submission
    const submission = await HomeworkSubmission.findOne({
      homeworkId,
      studentId,
      schoolId,
    }).populate("gradedBy", "fullName");

    // Calculate submission status
    const now = new Date();
    const dueDate = new Date(homework.dueDate);
    const isOverdue = now > dueDate;
    
    let submissionStatus = "pending";
    if (submission) {
      submissionStatus = submission.status;
    } else if (isOverdue) {
      submissionStatus = "overdue";
    }

    // Calculate progress percentage
    let progressPercentage = 0;
    if (submission && submission.answers && homework.questions) {
      const answeredQuestions = submission.answers.filter(a => 
        a.answerText || (a.selectedOptions && a.selectedOptions.length > 0)
      ).length;
      progressPercentage = Math.round((answeredQuestions / homework.questions.length) * 100);
    }

    res.status(200).json({
      success: true,
      data: {
        homework: {
          _id: homework._id,
          title: homework.title,
          description: homework.description,
          dueDate: homework.dueDate,
          difficultyLevel: homework.difficultyLevel,
          questions: homework.questions,
          attachments: homework.attachments,
          class: homework.classId,
          subject: homework.subjectId,
          createdBy: homework.createdBy
        },
        submission,
        submissionStatus,
        isOverdue,
        progressPercentage,
        timeRemaining: isOverdue ? 0 : Math.max(0, dueDate - now)
      },
    });
  } catch (error) {
    console.error("Error getting student submission:", error);
    next(error);
  }
};

/**
 * @desc    Get all submissions for a homework assignment (Teacher view)
 * @route   GET /api/v1/homework-submissions/:homeworkId
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const getHomeworkSubmissions = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const { status, search, page = 1, limit = 20 } = req.query;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    const schoolId = req.user.schoolId;

    // Verify homework exists and teacher has access
    const homework = await Homework.findOne({ _id: homeworkId, schoolId })
      .populate("classId", "name")
      .populate("subjectId", "name subjectCode");

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found or access denied",
      });
    }

    // For teachers, verify they created this homework or teach the subject
    if (req.user.role === "teacher") {
      const isAuthorized = homework.createdBy.toString() === req.user._id.toString() ||
        req.user.assignedClasses.some(assignment =>
          assignment.classId.toString() === homework.classId._id.toString() &&
          assignment.subjectIds.some(subId => subId.toString() === homework.subjectId._id.toString())
        );
        
      if (!isAuthorized) {
          return res.status(403).json({
            success: false,
          message: "You don't have permission to view these submissions",
          });
      }
    }

    // Build query for submissions
    const query = { homeworkId, schoolId };

    if (status) {
      query.status = status;
    }

    // Get submissions with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await HomeworkSubmission.find(query)
      .populate("studentId", "fullName email username")
      .populate("gradedBy", "fullName")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by student name/email if search provided
    let filteredSubmissions = submissions;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSubmissions = submissions.filter(sub =>
        sub.studentId.fullName.toLowerCase().includes(searchLower) ||
        sub.studentId.email.toLowerCase().includes(searchLower) ||
        sub.studentId.username.toLowerCase().includes(searchLower)
      );
    }

    // Get total count for pagination
    const total = await HomeworkSubmission.countDocuments(query);

    // Calculate statistics
    const stats = await HomeworkSubmission.aggregate([
      { $match: { homeworkId: mongoose.Types.ObjectId(homeworkId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgScore: {
            $avg: {
              $cond: [
                { $gt: ["$totalMarks", 0] },
                { $multiply: [{ $divide: ["$totalObtainedMarks", "$totalMarks"] }, 100] },
                0
              ]
            }
          }
        }
      }
    ]);

    const statusCounts = {
      pending: 0,
      submitted: 0,
      late: 0,
      graded: 0
    };

    let overallAvgScore = 0;
    let gradedCount = 0;

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
      if (stat._id === "graded") {
        overallAvgScore = stat.avgScore || 0;
        gradedCount = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        homework: {
          _id: homework._id,
          title: homework.title,
          dueDate: homework.dueDate,
          class: homework.classId,
          subject: homework.subjectId,
          totalQuestions: homework.questions?.length || 0,
          totalMarks: homework.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0
        },
        submissions: filteredSubmissions,
        statistics: {
          total: submissions.length,
          statusCounts,
          overallAvgScore: Math.round(overallAvgScore * 100) / 100,
          gradedCount,
          pendingGrading: statusCounts.submitted + statusCounts.late
        },
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting homework submissions:", error);
    next(error);
  }
};

/**
 * @desc    Grade a homework submission
 * @route   PUT /api/v1/homework-submissions/:submissionId/grade
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const gradeHomeworkSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { answers, feedback, totalObtainedMarks, rubricGrades } = req.body;

    // Validate submissionId
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
    }

    const schoolId = req.user.schoolId;
    const gradedBy = req.user._id;

    // Find submission
    const submission = await HomeworkSubmission.findOne({
      _id: submissionId,
      schoolId 
    }).populate({
      path: "homeworkId",
      populate: [
        { path: "classId", select: "name" },
        { path: "subjectId", select: "name" },
        { path: "createdBy", select: "_id" }
      ]
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Verify teacher has permission to grade this submission
    if (req.user.role === "teacher") {
      const homework = submission.homeworkId;
      const isAuthorized = homework.createdBy._id.toString() === req.user._id.toString() ||
        req.user.assignedClasses.some(assignment =>
          assignment.classId.toString() === homework.classId._id.toString() &&
          assignment.subjectIds.some(subId => subId.toString() === homework.subjectId._id.toString())
      );
      
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to grade this submission",
        });
      }
    }

    // Update individual answer grades if provided
    if (answers && Array.isArray(answers)) {
      const updatedAnswers = submission.answers.map(existingAnswer => {
        const newAnswer = answers.find(a => 
          a.questionId.toString() === existingAnswer.questionId.toString()
        );

        if (newAnswer) {
          return {
            ...existingAnswer.toObject(),
            marks: newAnswer.marks || existingAnswer.marks,
            feedback: newAnswer.feedback || existingAnswer.feedback,
            isCorrect: newAnswer.marks > 0,
            gradedBy,
            gradedAt: new Date()
          };
        }
        return existingAnswer;
      });

      submission.answers = updatedAnswers;
      
      // Calculate total obtained marks from individual answers
      submission.totalObtainedMarks = updatedAnswers.reduce((sum, answer) => 
        sum + (answer.marks || 0), 0
      );
    } else if (totalObtainedMarks !== undefined) {
      // Use provided total if individual answers not graded
      submission.totalObtainedMarks = Math.max(0, Math.min(totalObtainedMarks, submission.totalMarks));
    }

    // Update submission metadata
    submission.feedback = feedback || submission.feedback;
    submission.gradedBy = gradedBy;
    submission.gradedAt = new Date();
    submission.status = "graded";

    // Add rubric grades if provided
    if (rubricGrades && Array.isArray(rubricGrades)) {
      submission.rubricGrades = rubricGrades;
    }

    await submission.save();

    // Populate response data
    const populatedSubmission = await HomeworkSubmission.findById(submission._id)
      .populate("studentId", "fullName email")
      .populate("gradedBy", "fullName")
      .populate({
        path: "homeworkId",
        select: "title questions rubrics",
        populate: [
          { path: "classId", select: "name" },
          { path: "subjectId", select: "name" }
        ]
      });

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: { submission: populatedSubmission },
    });
  } catch (error) {
    console.error("Error grading submission:", error);
    next(error);
  }
};

/**
 * @desc    Batch grade multiple submissions
 * @route   POST /api/v1/homework-submissions/batch-grade
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const batchGradeSubmissions = async (req, res, next) => {
  try {
    const { submissionGrades, homeworkId } = req.body;

    if (!submissionGrades || !Array.isArray(submissionGrades) || submissionGrades.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Submission grades array is required",
      });
    }

    const schoolId = req.user.schoolId;
    const gradedBy = req.user._id;

    // Verify homework exists and teacher has access
    const homework = await Homework.findOne({ _id: homeworkId, schoolId });
    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    const results = [];
    const errors = [];

    for (const gradeData of submissionGrades) {
      try {
        const { submissionId, totalObtainedMarks, feedback } = gradeData;

        const submission = await HomeworkSubmission.findOne({
          _id: submissionId,
          homeworkId,
          schoolId
        });

        if (submission) {
          submission.totalObtainedMarks = Math.max(0, Math.min(totalObtainedMarks, submission.totalMarks));
          submission.feedback = feedback || "";
          submission.gradedBy = gradedBy;
          submission.gradedAt = new Date();
          submission.status = "graded";

          await submission.save();
          results.push({ submissionId, success: true });
    } else {
          errors.push({ submissionId, error: "Submission not found" });
    }
      } catch (error) {
        errors.push({ submissionId: gradeData.submissionId, error: error.message });
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Batch grading completed. ${results.length} submissions graded successfully.`,
      data: {
        successful: results,
        errors,
        totalProcessed: submissionGrades.length,
        successCount: results.length,
        errorCount: errors.length
      },
    });
  } catch (error) {
    console.error("Error in batch grading:", error);
    next(error);
  }
};

/**
 * @desc    Assess subjective answer using AI/manual criteria
 * @route   POST /api/v1/homework-submissions/assess
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const assessSubjectiveAnswer = async (req, res, next) => {
  try {
    const { 
      submissionId, 
      questionId, 
      criteria, 
      suggestedMarks, 
      feedback,
      useAI = false 
    } = req.body;

    // Validate required fields
    if (!submissionId || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Submission ID and Question ID are required",
      });
    }

    const schoolId = req.user.schoolId;

    // Find submission
    const submission = await HomeworkSubmission.findOne({ 
      _id: submissionId, 
      schoolId 
    }).populate("homeworkId");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Find the specific answer
    const answerIndex = submission.answers.findIndex(
      answer => answer.questionId.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Answer not found for the specified question",
      });
    }

    // Find the question details
    const question = submission.homeworkId.questions.find(
      q => q._id.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // For now, we'll use manual assessment (AI integration can be added later)
    const assessment = {
      marks: Math.min(suggestedMarks || 0, question.marks),
      feedback: feedback || "",
      criteria: criteria || {},
      assessedBy: req.user._id,
      assessedAt: new Date(),
      assessmentMethod: useAI ? "AI-assisted" : "manual"
    };

    // Update the specific answer
    submission.answers[answerIndex] = {
      ...submission.answers[answerIndex].toObject(),
      marks: assessment.marks,
      feedback: assessment.feedback,
      isCorrect: assessment.marks > 0,
      gradedBy: req.user._id,
      gradedAt: new Date(),
      assessment
    };

    // Recalculate total obtained marks
    submission.totalObtainedMarks = submission.answers.reduce(
      (sum, answer) => sum + (answer.marks || 0), 0
    );

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Subjective answer assessed successfully",
      data: {
        assessment,
        updatedAnswer: submission.answers[answerIndex],
        totalObtainedMarks: submission.totalObtainedMarks
            },
    });
  } catch (error) {
    console.error("Error assessing subjective answer:", error);
    next(error);
  }
};

/**
 * @desc    Get student analytics
 * @route   GET /api/v1/homework-submissions/analytics/:studentId
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin, Student - own only)
 */
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { subjectId, timeRange = '30' } = req.query; // timeRange in days

    const schoolId = req.user.schoolId;

    // Build date filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Build query
    const query = {
      studentId,
      schoolId,
      status: "graded",
      gradedAt: { $gte: startDate }
    };

    // Get submissions with homework details
    const submissions = await HomeworkSubmission.find(query)
      .populate({
        path: "homeworkId",
        select: "title subjectId difficultyLevel questions",
        populate: {
          path: "subjectId",
          select: "name subjectCode"
        }
      })
      .sort({ gradedAt: -1 });

    // Filter by subject if specified
    let filteredSubmissions = submissions;
    if (subjectId) {
      filteredSubmissions = submissions.filter(sub => 
        sub.homeworkId.subjectId._id.toString() === subjectId
      );
    }

    // Calculate analytics
    const analytics = {
      totalSubmissions: filteredSubmissions.length,
      averageScore: 0,
      totalMarks: 0,
      totalObtainedMarks: 0,
      subjectPerformance: {},
      difficultyPerformance: {
        easy: { total: 0, obtained: 0, count: 0 },
        medium: { total: 0, obtained: 0, count: 0 },
        hard: { total: 0, obtained: 0, count: 0 }
      },
      recentSubmissions: [],
      improvementTrend: []
    };

    if (filteredSubmissions.length > 0) {
      // Calculate totals
      analytics.totalMarks = filteredSubmissions.reduce((sum, sub) => sum + sub.totalMarks, 0);
      analytics.totalObtainedMarks = filteredSubmissions.reduce((sum, sub) => sum + sub.totalObtainedMarks, 0);
      analytics.averageScore = Math.round((analytics.totalObtainedMarks / analytics.totalMarks) * 100 * 100) / 100;

      // Subject performance
      const subjectStats = {};
      filteredSubmissions.forEach(sub => {
        const subjectName = sub.homeworkId.subjectId.name;
        if (!subjectStats[subjectName]) {
          subjectStats[subjectName] = { total: 0, obtained: 0, count: 0 };
        }
        subjectStats[subjectName].total += sub.totalMarks;
        subjectStats[subjectName].obtained += sub.totalObtainedMarks;
        subjectStats[subjectName].count += 1;
      });

      analytics.subjectPerformance = Object.keys(subjectStats).reduce((acc, subject) => {
        const stats = subjectStats[subject];
        acc[subject] = {
          averageScore: Math.round((stats.obtained / stats.total) * 100 * 100) / 100,
          totalAssignments: stats.count
        };
        return acc;
      }, {});

      // Difficulty performance
      filteredSubmissions.forEach(sub => {
        const difficulty = sub.homeworkId.difficultyLevel || 'medium';
        analytics.difficultyPerformance[difficulty].total += sub.totalMarks;
        analytics.difficultyPerformance[difficulty].obtained += sub.totalObtainedMarks;
        analytics.difficultyPerformance[difficulty].count += 1;
      });

      // Calculate percentages for difficulty
      Object.keys(analytics.difficultyPerformance).forEach(difficulty => {
        const stats = analytics.difficultyPerformance[difficulty];
        if (stats.total > 0) {
          stats.percentage = Math.round((stats.obtained / stats.total) * 100 * 100) / 100;
        } else {
          stats.percentage = 0;
        }
      });

      // Recent submissions (last 5)
      analytics.recentSubmissions = filteredSubmissions.slice(0, 5).map(sub => ({
        homework: {
          title: sub.homeworkId.title,
          subject: sub.homeworkId.subjectId.name
        },
        score: Math.round((sub.totalObtainedMarks / sub.totalMarks) * 100 * 100) / 100,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt
      }));

      // Improvement trend (scores over time)
      analytics.improvementTrend = filteredSubmissions
        .reverse() // Chronological order
        .map(sub => ({
          date: sub.gradedAt,
          score: Math.round((sub.totalObtainedMarks / sub.totalMarks) * 100 * 100) / 100,
          homework: sub.homeworkId.title
        }));
    }

    res.status(200).json({
      success: true,
      data: {
        analytics,
        timeRange: `${timeRange} days`,
        generatedAt: new Date()
      },
    });
  } catch (error) {
    console.error("Error getting student analytics:", error);
    next(error);
  }
};

/**
 * @desc    Update personalization settings
 * @route   PUT /api/v1/homework-submissions/settings
 * @access  Private (Student)
 */
export const updatePersonalizationSettings = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // For now, this is a placeholder for personalization settings
    // In a full implementation, this would update student profile preferences

    res.status(200).json({
      success: true,
      message: "Personalization settings updated successfully",
      data: { preferences },
    });
  } catch (error) {
    console.error("Error updating personalization settings:", error);
    next(error);
  }
}; 