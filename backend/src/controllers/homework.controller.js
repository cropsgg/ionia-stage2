import { Homework } from "../models/homework.model.js";
import { HomeworkSubmission } from "../models/homeworkSubmission.model.js";
import { StudentProfile } from "../models/studentProfile.model.js";
import { Class } from "../models/class.model.js";
import { Subject } from "../models/subject.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new homework assignment
 * @route   POST /api/v1/homework
 * @access  Private (Teacher, ClassTeacher)
 */
export const createHomework = async (req, res, next) => {
  try {
    const {
      title,
      description,
      classId,
      subjectId,
      dueDate,
      difficultyLevel,
      questions,
      personalizationEnabled,
      adaptiveDifficulty,
      learningStylePreference,
      rubrics
    } = req.body;

    // Validate required fields
    if (!title || !classId || !subjectId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, classId, subjectId, dueDate are required",
      });
    }

    // Validate due date is in the future
    const dueDateObj = new Date(dueDate);
    if (dueDateObj <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date must be in the future",
      });
    }

    // Get schoolId and userId from authenticated user
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
        message: "Subject not found or you don't have access to this subject",
      });
    }

    // For teachers, verify they teach this subject in this class
    if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      const isAuthorized = req.user.assignedClasses.some(
        (assignment) =>
          assignment.classId.toString() === classId &&
          assignment.subjectIds.some(subId => subId.toString() === subjectId)
      );

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to create homework for this class and subject combination",
        });
      }
    }

    // Process file attachments if present
    let attachments = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} file attachments...`);
      
      for (const file of req.files) {
        try {
          const uploadResult = await uploadOnCloudinary(file.path);
          if (uploadResult) {
            attachments.push({
              fileName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              fileUrl: uploadResult.secure_url,
              uploadedAt: new Date()
            });
            console.log(`File uploaded successfully: ${file.originalname}`);
          }
        } catch (uploadError) {
          console.error(`Error uploading file ${file.originalname}:`, uploadError);
          // Continue with other files instead of failing the entire request
        }
      }
    }

    // Prepare homework data
    const homeworkData = {
      title: title.trim(),
      description: description?.trim() || "",
      classId,
      subjectId,
      createdBy,
      schoolId,
      dueDate: dueDateObj,
      difficultyLevel: difficultyLevel || "medium",
      personalizationEnabled: personalizationEnabled || false,
      adaptiveDifficulty: adaptiveDifficulty || false,
      learningStylePreference: learningStylePreference || false,
      attachments
    };

    // Add questions if provided
    if (questions && Array.isArray(questions) && questions.length > 0) {
      // Validate questions format
      const validQuestions = questions.filter(q => 
        q.questionText && 
        q.questionType && 
        ['objective', 'subjective'].includes(q.questionType) &&
        q.marks && 
        q.marks > 0
      );

      if (validQuestions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one valid question is required",
        });
      }

      homeworkData.questions = validQuestions.map(q => ({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        options: q.options || [],
        marks: parseInt(q.marks) || 1,
        difficultyLevel: q.difficultyLevel || "medium",
        learningStyle: q.learningStyle || null,
        attachments: q.attachments || []
      }));
    }

    // Add basic rubrics if provided
    if (rubrics && Array.isArray(rubrics) && rubrics.length > 0) {
      homeworkData.rubrics = rubrics.map(rubric => ({
        name: rubric.name || "Basic Rubric",
        description: rubric.description || "",
        criteria: rubric.criteria || [{
          criterion: "Quality of Work",
          maxMarks: 10,
          levels: [
            { level: "Excellent", description: "Outstanding work", marks: 10 },
            { level: "Good", description: "Good work", marks: 8 },
            { level: "Satisfactory", description: "Acceptable work", marks: 6 },
            { level: "Needs Improvement", description: "Below expectations", marks: 4 }
          ]
        }]
      }));
    }

    // Create the homework
    const newHomework = await Homework.create(homeworkData);

    // If personalization is enabled, create initial submissions for all students
    if (personalizationEnabled) {
      // Get all students in the class
      const classStudents = await User.find({
        _id: { $in: classObj.students },
        schoolId,
        role: "student",
        isActive: true,
      }).select("_id");

      // Create bulk submissions
      if (classStudents.length > 0) {
        const totalMarks = homeworkData.questions ? 
          homeworkData.questions.reduce((sum, q) => sum + q.marks, 0) : 0;
          
        const submissions = classStudents.map((student) => ({
          homeworkId: newHomework._id,
          studentId: student._id,
          schoolId,
          status: "pending",
          answers: [],
          totalMarks
        }));

        await HomeworkSubmission.insertMany(submissions);
        console.log(`Created ${submissions.length} submissions for personalized homework`);
      }
    }

    // Populate response data
    const populatedHomework = await Homework.findById(newHomework._id)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName email");

    res.status(201).json({
      success: true,
      message: "Homework created successfully",
      data: { 
        homework: populatedHomework,
        attachmentsUploaded: attachments.length,
        studentsNotified: personalizationEnabled ? classObj.students.length : 0
      },
    });
  } catch (error) {
    console.error("Error creating homework:", error);
    next(error);
  }
};

/**
 * @desc    Get all homework assignments for a teacher
 * @route   GET /api/v1/homework
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const getTeacherHomework = async (req, res, next) => {
  try {
    const { classId, subjectId, active, search, page = 1, limit = 10 } = req.query;

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Build query
    const query = { schoolId };

    // For teachers, only show homework they created
    if (req.user.role === "teacher" || req.user.role === "classTeacher") {
      query.createdBy = req.user._id;
    }

    // Filter by class if provided
    if (classId) {
      query.classId = classId;
    }

    // Filter by subject if provided
    if (subjectId) {
      query.subjectId = subjectId;
    }

    // Filter by active status if provided
    if (active !== undefined) {
      query.isActive = active === "true";
    }

    // Add search if provided
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find homework with pagination
    const homework = await Homework.find(query)
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Homework.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
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
 * @desc    Get all homework assignments for a student
 * @route   GET /api/v1/homework/student
 * @access  Private (Student)
 */
export const getStudentHomework = async (req, res, next) => {
  try {
    const { status, subjectId, page = 1, limit = 10 } = req.query;

    // Get student info
    const studentId = req.user._id;
    const schoolId = req.user.schoolId;

    // Get student's enrolled classes
    const student = await User.findById(studentId).select("enrolledClasses");
    if (!student || !student.enrolledClasses || student.enrolledClasses.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          homework: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            pages: 0,
            limit: parseInt(limit),
          },
        },
      });
    }

    // Find all homework submissions for the student
    const submissionQuery = {
      studentId,
      schoolId,
    };

    // Filter by status if provided
    if (status) {
      submissionQuery.status = status;
    }

    // Get submissions with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const submissions = await HomeworkSubmission.find(submissionQuery)
      .populate({
        path: "homeworkId",
        select: "title description classId subjectId dueDate difficultyLevel isActive personalizationEnabled",
        populate: [
          { path: "classId", select: "name" },
          { path: "subjectId", select: "name subjectCode" },
        ],
      })
      .sort({ "homeworkId.dueDate": 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by subject if provided
    let filteredSubmissions = submissions;
    if (subjectId) {
      filteredSubmissions = submissions.filter(
        (submission) =>
          submission.homeworkId &&
          submission.homeworkId.subjectId &&
          submission.homeworkId.subjectId._id.toString() === subjectId
      );
    }

    // Get total count
    const total = await HomeworkSubmission.countDocuments(submissionQuery);

    res.status(200).json({
      success: true,
      data: {
        homeworkSubmissions: filteredSubmissions,
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
 * @desc    Get a single homework by ID
 * @route   GET /api/v1/homework/:homeworkId
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin, Student)
 */
export const getHomeworkById = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Find homework
    const homework = await Homework.findOne({ _id: homeworkId, schoolId })
      .populate("classId", "name yearOrGradeLevel")
      .populate("subjectId", "name subjectCode")
      .populate("createdBy", "fullName");

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // If user is a student, check if they're in the class
    if (req.user.role === "student") {
      const student = await User.findById(req.user._id).select("enrolledClasses");
      const isInClass = student.enrolledClasses.some(
        (classId) => classId.toString() === homework.classId._id.toString()
      );

      if (!isInClass) {
        return res.status(403).json({
          success: false,
          message: "You are not enrolled in this class",
        });
      }

      // Get personalized questions for the student if personalization is enabled
      if (homework.personalizationEnabled) {
        // Get student profile
        const studentProfile = await StudentProfile.findOne({
          studentId: req.user._id,
          schoolId,
        });

        if (studentProfile) {
          // Get their submission
          const submission = await HomeworkSubmission.findOne({
            homeworkId,
            studentId: req.user._id,
          });

          // Return personalized data
          return res.status(200).json({
            success: true,
            data: {
              homework,
              studentProfile,
              submission,
            },
          });
        }
      }
    }

    // For teachers, get submission statistics
    let stats = null;
    if (
      req.user.role === "teacher" ||
      req.user.role === "classTeacher" ||
      req.user.role === "schoolAdmin"
    ) {
      stats = await HomeworkSubmission.aggregate([
        { $match: { homeworkId: mongoose.Types.ObjectId(homeworkId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        homework,
        stats: stats ? stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}) : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a homework assignment
 * @route   PUT /api/v1/homework/:homeworkId
 * @access  Private (Teacher who created it, ClassTeacher, SchoolAdmin)
 */
export const updateHomework = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const {
      title,
      description,
      dueDate,
      difficultyLevel,
      questions,
      isActive,
      personalizationEnabled,
      adaptiveDifficulty,
      learningStylePreference,
    } = req.body;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Find homework
    const homework = await Homework.findOne({ _id: homeworkId, schoolId });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // Check if user is authorized to update this homework
    if (
      req.user.role === "teacher" &&
      homework.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this homework",
      });
    }

    // Update fields if provided
    if (title) homework.title = title;
    if (description !== undefined) homework.description = description;
    if (dueDate) homework.dueDate = dueDate;
    if (difficultyLevel) homework.difficultyLevel = difficultyLevel;
    if (questions && questions.length > 0) homework.questions = questions;
    if (isActive !== undefined) homework.isActive = isActive;
    if (personalizationEnabled !== undefined)
      homework.personalizationEnabled = personalizationEnabled;
    if (adaptiveDifficulty !== undefined)
      homework.adaptiveDifficulty = adaptiveDifficulty;
    if (learningStylePreference !== undefined)
      homework.learningStylePreference = learningStylePreference;

    // Save updated homework
    await homework.save();

    // Update total marks in all submissions if questions were updated
    if (questions && questions.length > 0) {
      const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      await HomeworkSubmission.updateMany(
        { homeworkId },
        { $set: { totalMarks } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Homework updated successfully",
      data: { homework },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a homework assignment
 * @route   DELETE /api/v1/homework/:homeworkId
 * @access  Private (Teacher who created it, ClassTeacher, SchoolAdmin)
 */
export const deleteHomework = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Find homework
    const homework = await Homework.findOne({ _id: homeworkId, schoolId });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // Check if user is authorized to delete this homework
    if (
      req.user.role === "teacher" &&
      homework.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this homework",
      });
    }

    // Check if any submissions are graded
    const gradedSubmissions = await HomeworkSubmission.countDocuments({
      homeworkId,
      status: "graded",
    });

    if (gradedSubmissions > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete homework with graded submissions",
      });
    }

    // Delete homework and all submissions
    await Homework.deleteOne({ _id: homeworkId });
    await HomeworkSubmission.deleteMany({ homeworkId });

    res.status(200).json({
      success: true,
      message: "Homework deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate personalized homework for a class
 * @route   POST /api/v1/homework/personalize/:classId
 * @access  Private (Teacher, ClassTeacher)
 */
export const createPersonalizedHomework = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const {
      title,
      description,
      subjectId,
      dueDate,
      baseQuestions,
      adaptiveDifficulty,
      learningStylePreference,
    } = req.body;

    // Validate required fields
    if (!title || !subjectId || !dueDate || !baseQuestions || baseQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Get schoolId and userId from authenticated user
    const schoolId = req.user.schoolId;
    const createdBy = req.user._id;

    // Verify the class exists and belongs to school
    const classObj = await Class.findOne({ _id: classId, schoolId });
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
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
          message: "You are not authorized to create homework for this class and subject",
        });
      }
    }

    // Create the homework with personalization enabled
    const newHomework = await Homework.create({
      title,
      description: description || "",
      classId,
      subjectId,
      createdBy,
      schoolId,
      dueDate,
      difficultyLevel: "medium", // Default, will be personalized per student
      questions: baseQuestions,
      personalizationEnabled: true,
      adaptiveDifficulty: adaptiveDifficulty || false,
      learningStylePreference: learningStylePreference || false,
    });

    // Get all students in the class with their profiles
    const students = await User.find({
      _id: { $in: classObj.students },
      schoolId,
      role: "student",
      isActive: true,
    }).select("_id");

    // Fetch student profiles
    const studentProfiles = await StudentProfile.find({
      studentId: { $in: students.map((s) => s._id) },
      schoolId,
    });

    // Create personalized submissions for each student
    const submissions = [];
    for (const student of students) {
      // Find student's profile
      const profile = studentProfiles.find(
        (p) => p.studentId.toString() === student._id.toString()
      );

      // Create submission with personalized questions if profile exists
      if (profile) {
        // Personalize questions based on student profile
        const personalizedQuestions = baseQuestions.map((q) => {
          const question = { ...q };

          // Adjust difficulty if adaptive difficulty is enabled
          if (adaptiveDifficulty && profile.recommendedDifficultyLevel) {
            question.difficultyLevel = profile.recommendedDifficultyLevel;
          }

          // Adjust learning style if preference is enabled
          if (learningStylePreference && profile.recommendedLearningStyle) {
            question.learningStyle = profile.recommendedLearningStyle;
          }

          return question;
        });

        submissions.push({
          homeworkId: newHomework._id,
          studentId: student._id,
          schoolId,
          status: "pending",
          answers: [],
          totalMarks: personalizedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0),
          // Store personalized questions in metadata
          metadata: {
            personalizedQuestions,
          },
        });
      } else {
        // Create standard submission if no profile
        submissions.push({
          homeworkId: newHomework._id,
          studentId: student._id,
          schoolId,
          status: "pending",
          answers: [],
          totalMarks: baseQuestions.reduce((sum, q) => sum + (q.marks || 1), 0),
        });
      }
    }

    // Insert all submissions
    if (submissions.length > 0) {
      await HomeworkSubmission.insertMany(submissions);
    }

    res.status(201).json({
      success: true,
      message: "Personalized homework created successfully",
      data: {
        homework: newHomework,
        submissionsCreated: submissions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get class statistics for a homework assignment
 * @route   GET /api/v1/homework/:homeworkId/stats
 * @access  Private (Teacher, ClassTeacher, SchoolAdmin)
 */
export const getHomeworkStats = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;

    // Validate homeworkId
    if (!mongoose.Types.ObjectId.isValid(homeworkId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid homework ID",
      });
    }

    // Get schoolId from authenticated user
    const schoolId = req.user.schoolId;

    // Find homework
    const homework = await Homework.findOne({ _id: homeworkId, schoolId });

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    // Get submission statistics
    const submissionStats = await HomeworkSubmission.aggregate([
      { $match: { homeworkId: mongoose.Types.ObjectId(homeworkId) } },
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

    // Get question-level statistics
    const questionStats = await HomeworkSubmission.aggregate([
      { $match: { homeworkId: mongoose.Types.ObjectId(homeworkId), status: "graded" } },
      { $unwind: "$answers" },
      {
        $group: {
          _id: "$answers.questionId",
          totalAttempts: { $sum: 1 },
          correctCount: {
            $sum: { $cond: [{ $eq: ["$answers.isCorrect", true] }, 1, 0] },
          },
          avgMarks: { $avg: "$answers.marks" },
        },
      },
      {
        $project: {
          questionId: "$_id",
          totalAttempts: 1,
          correctCount: 1,
          avgMarks: 1,
          correctPercentage: {
            $multiply: [
              { $divide: ["$correctCount", "$totalAttempts"] },
              100,
            ],
          },
        },
      },
    ]);

    // Get learning style effectiveness if personalization is enabled
    let learningStyleStats = null;
    if (homework.personalizationEnabled && homework.learningStylePreference) {
      learningStyleStats = await HomeworkSubmission.aggregate([
        { $match: { homeworkId: mongoose.Types.ObjectId(homeworkId), status: "graded" } },
        { $unwind: "$answers" },
        {
          $lookup: {
            from: "homeworks",
            localField: "homeworkId",
            foreignField: "_id",
            as: "homework",
          },
        },
        { $unwind: "$homework" },
        { $unwind: "$homework.questions" },
        {
          $match: {
            $expr: {
              $eq: ["$answers.questionId", "$homework.questions._id"],
            },
          },
        },
        {
          $group: {
            _id: "$homework.questions.learningStyle",
            totalQuestions: { $sum: 1 },
            correctCount: {
              $sum: { $cond: [{ $eq: ["$answers.isCorrect", true] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            learningStyle: "$_id",
            totalQuestions: 1,
            correctCount: 1,
            correctPercentage: {
              $multiply: [
                { $divide: ["$correctCount", "$totalQuestions"] },
                100,
              ],
            },
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        homework,
        submissionStats: submissionStats.reduce((acc, curr) => {
          acc[curr._id] = {
            count: curr.count,
            avgScore: curr.avgScore,
          };
          return acc;
        }, {}),
        questionStats,
        learningStyleStats,
      },
    });
  } catch (error) {
    next(error);
  }
}; 