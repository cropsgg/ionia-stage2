import { User } from '../models/user.model.js';
import { Homework } from '../models/homework.model.js';
import { HomeworkSubmission } from '../models/homeworkSubmission.model.js';
import { Class } from '../models/class.model.js';
import { Subject } from '../models/subject.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Get comprehensive student analytics
 * @route   GET /api/v1/analytics/student/:studentId
 * @access  Private (Student own data, Teachers for their students, Admins)
 */
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { timeRange = '30', subjectId } = req.query;
    const schoolId = req.user.schoolId;

    // Validate student access
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own analytics"
      });
    }

    // Build date filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Performance over time aggregation
    const performanceOverTime = await HomeworkSubmission.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$gradedAt" }
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          submissionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    // Subject-wise performance
    const subjectPerformance = await HomeworkSubmission.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $lookup: {
          from: "subjects",
          localField: "homework.subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: {
            subjectId: "$subject._id",
            subjectName: "$subject.name"
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalAssignments: { $sum: 1 },
          totalMarks: { $sum: "$totalMarks" },
          obtainedMarks: { $sum: "$totalObtainedMarks" }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Topic/Difficulty performance
    const difficultyPerformance = await HomeworkSubmission.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $group: {
          _id: "$homework.difficultyLevel",
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate overall metrics
    const overallStats = await HomeworkSubmission.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalSubmissions: { $sum: 1 },
          totalObtainedMarks: { $sum: "$totalObtainedMarks" },
          totalMarks: { $sum: "$totalMarks" }
        }
      }
    ]);

    const analytics = {
      performanceOverTime: performanceOverTime.map(p => ({
        date: p._id,
        score: Math.round(p.averageScore * 100) / 100,
        average: Math.round(p.averageScore * 100) / 100,
        submissionCount: p.submissionCount
      })),
      
      subjectPerformance: subjectPerformance.map(s => ({
        subject: s._id.subjectName,
        score: Math.round(s.averageScore * 100) / 100,
        average: Math.round(s.averageScore * 100) / 100,
        totalAssignments: s.totalAssignments,
        obtainedMarks: s.obtainedMarks,
        totalMarks: s.totalMarks
      })),
      
      difficultyPerformance: difficultyPerformance.reduce((acc, curr) => {
        acc[curr._id || 'medium'] = {
          score: Math.round(curr.averageScore * 100) / 100,
          count: curr.count
        };
        return acc;
      }, {}),
      
      averageScore: overallStats[0] ? Math.round(overallStats[0].averageScore * 100) / 100 : 0,
      totalSubmissions: overallStats[0] ? overallStats[0].totalSubmissions : 0,
      timeRange: `${timeRange} days`
    };

    res.status(200).json({
      success: true,
      data: analytics,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error("Error getting student analytics:", error);
    next(error);
  }
};

/**
 * @desc    Get comprehensive teacher analytics
 * @route   GET /api/v1/analytics/teacher/:teacherId
 * @access  Private (Teacher own data, Admins)
 */
export const getTeacherAnalytics = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { timeRange = '30' } = req.query;
    const schoolId = req.user.schoolId;

    // Validate teacher access
    if ((req.user.role === 'teacher' || req.user.role === 'classTeacher') && 
        req.user._id.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own analytics"
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Get teacher's classes
    const teacher = await User.findById(teacherId).select('assignedClasses');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    const teacherClassIds = teacher.assignedClasses.map(ac => ac.classId);

    // Class performance overview
    const classPerformance = await HomeworkSubmission.aggregate([
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $match: {
          "homework.createdBy": mongoose.Types.ObjectId(teacherId),
          "homework.schoolId": mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "classes",
          localField: "homework.classId",
          foreignField: "_id",
          as: "class"
        }
      },
      { $unwind: "$class" },
      {
        $group: {
          _id: {
            classId: "$class._id",
            className: "$class.name"
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalSubmissions: { $sum: 1 },
          completedHomework: {
            $sum: {
              $cond: [{ $eq: ["$status", "graded"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Student progress tracking
    const studentProgress = await HomeworkSubmission.aggregate([
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $match: {
          "homework.createdBy": mongoose.Types.ObjectId(teacherId),
          "homework.schoolId": mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $group: {
          _id: {
            studentId: "$student._id",
            studentName: "$student.fullName"
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalSubmissions: { $sum: 1 },
          firstScore: { $first: "$totalObtainedMarks" },
          lastScore: { $last: "$totalObtainedMarks" },
          submissions: {
            $push: {
              score: {
                $multiply: [
                  { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                  100
                ]
              },
              submittedAt: "$submittedAt"
            }
          }
        }
      },
      {
        $addFields: {
          trend: {
            $cond: {
              if: { $gt: ["$lastScore", "$firstScore"] },
              then: "improving",
              else: {
                $cond: {
                  if: { $lt: ["$lastScore", "$firstScore"] },
                  then: "declining",
                  else: "stable"
                }
              }
            }
          },
          needsAttention: {
            $or: [
              { $lt: ["$averageScore", 70] },
              { $eq: ["$trend", "declining"] }
            ]
          }
        }
      },
      { $sort: { needsAttention: -1, averageScore: 1 } }
    ]);

    // Subject-wise challenges
    const subjectChallenges = await HomeworkSubmission.aggregate([
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $match: {
          "homework.createdBy": mongoose.Types.ObjectId(teacherId),
          "homework.schoolId": mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "homework.subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: {
            subjectId: "$subject._id",
            subjectName: "$subject.name"
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          failRate: {
            $avg: {
              $cond: [
                { $lt: [{ $divide: ["$totalObtainedMarks", "$totalMarks"] }, 0.5] },
                1,
                0
              ]
            }
          },
          totalSubmissions: { $sum: 1 }
        }
      },
      { $sort: { averageScore: 1 } }
    ]);

    // Grading statistics
    const gradingStats = await HomeworkSubmission.aggregate([
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $match: {
          "homework.createdBy": mongoose.Types.ObjectId(teacherId),
          "homework.schoolId": mongoose.Types.ObjectId(schoolId),
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgGradingTime: {
            $avg: {
              $cond: [
                { $and: ["$gradedAt", "$submittedAt"] },
                {
                  $divide: [
                    { $subtract: ["$gradedAt", "$submittedAt"] },
                    1000 * 60 * 60 // Convert to hours
                  ]
                },
                0
              ]
            }
          }
        }
      }
    ]);

    const gradingStatsObj = gradingStats.reduce((acc, curr) => {
      acc[curr._id] = {
        count: curr.count,
        avgGradingTime: curr.avgGradingTime || 0
      };
      return acc;
    }, {});

    const analytics = {
      classPerformance: classPerformance.map(cp => ({
        className: cp._id.className,
        averageScore: Math.round(cp.averageScore * 100) / 100,
        totalSubmissions: cp.totalSubmissions,
        completionRate: Math.round((cp.completedHomework / cp.totalSubmissions) * 100)
      })),
      
      studentProgress: studentProgress.slice(0, 20).map(sp => ({
        studentId: sp._id.studentId.toString(),
        studentName: sp._id.studentName,
        averageScore: Math.round(sp.averageScore * 100) / 100,
        totalSubmissions: sp.totalSubmissions,
        trend: sp.trend,
        needsAttention: sp.needsAttention
      })),
      
      subjectChallenges: subjectChallenges.map(sc => ({
        subject: sc._id.subjectName,
        averageScore: Math.round(sc.averageScore * 100) / 100,
        failRate: Math.round(sc.failRate * 100),
        totalSubmissions: sc.totalSubmissions
      })),
      
      gradingStats: {
        pendingGrades: gradingStatsObj.submitted?.count || 0,
        completedGrades: gradingStatsObj.graded?.count || 0,
        averageGradingTime: Math.round((gradingStatsObj.graded?.avgGradingTime || 0) * 100) / 100
      },
      
      timeRange: `${timeRange} days`
    };

    res.status(200).json({
      success: true,
      data: analytics,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error("Error getting teacher analytics:", error);
    next(error);
  }
};

/**
 * @desc    Get comprehensive school analytics
 * @route   GET /api/v1/analytics/school
 * @access  Private (School Admin, Super Admin)
 */
export const getSchoolAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '30' } = req.query;
    const schoolId = req.user.schoolId;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Overall school performance
    const overallPerformance = await HomeworkSubmission.aggregate([
      {
        $match: {
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalSubmissions: { $sum: 1 },
          passRate: {
            $avg: {
              $cond: [
                { $gte: [{ $divide: ["$totalObtainedMarks", "$totalMarks"] }, 0.5] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Subject-wise performance
    const subjectPerformance = await HomeworkSubmission.aggregate([
      {
        $match: {
          schoolId: mongoose.Types.ObjectId(schoolId),
          status: "graded",
          gradedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "homework",
          localField: "homeworkId",
          foreignField: "_id",
          as: "homework"
        }
      },
      { $unwind: "$homework" },
      {
        $lookup: {
          from: "subjects",
          localField: "homework.subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: {
            subjectName: "$subject.name"
          },
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$totalObtainedMarks", "$totalMarks"] },
                100
              ]
            }
          },
          totalSubmissions: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Calculate completion rate
    const totalHomework = await Homework.countDocuments({
      schoolId: mongoose.Types.ObjectId(schoolId),
      createdAt: { $gte: startDate }
    });

    const completedHomework = await HomeworkSubmission.countDocuments({
      schoolId: mongoose.Types.ObjectId(schoolId),
      status: { $in: ["submitted", "late", "graded"] },
      submittedAt: { $gte: startDate }
    });

    const analytics = {
      overallPerformance: {
        averageScore: overallPerformance[0] ? Math.round(overallPerformance[0].averageScore * 100) / 100 : 0,
        passRate: overallPerformance[0] ? Math.round(overallPerformance[0].passRate * 100) : 0,
        homeworkCompletionRate: totalHomework > 0 ? Math.round((completedHomework / totalHomework) * 100) : 0,
        totalSubmissions: overallPerformance[0] ? overallPerformance[0].totalSubmissions : 0
      },
      
      subjectPerformance: subjectPerformance.map(sp => ({
        subject: sp._id.subjectName,
        averageScore: Math.round(sp.averageScore * 100) / 100,
        totalSubmissions: sp.totalSubmissions,
        trend: 'stable'
      })),
      
      timeRange: `${timeRange} days`
    };

    res.status(200).json({
      success: true,
      data: analytics,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error("Error getting school analytics:", error);
    next(error);
  }
};

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/v1/analytics/admin
 * @access  Private (School Admin, Super Admin)
 */
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get basic counts
    const activeUsers = await User.countDocuments({
      schoolId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    const totalStudents = await User.countDocuments({ 
      schoolId,
      role: 'student' 
    });

    const totalTeachers = await User.countDocuments({ 
      schoolId,
      role: { $in: ['teacher', 'classTeacher'] } 
    });

    const totalHomework = await Homework.countDocuments({
      schoolId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const completedHomework = await HomeworkSubmission.countDocuments({
      schoolId,
      status: { $in: ["submitted", "late", "graded"] },
      submittedAt: { $gte: thirtyDaysAgo }
    });

    // Get homework by subject
    const homeworkBySubject = await Homework.aggregate([
      {
        $match: {
          schoolId: mongoose.Types.ObjectId(schoolId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: "$subject.name",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent homework
    const recentHomework = await Homework.find({
      schoolId,
      createdAt: { $gte: thirtyDaysAgo }
    })
    .populate("subjectId", "name")
    .populate("classId", "name")
    .populate("createdBy", "fullName")
      .sort({ createdAt: -1 })
    .limit(10);

    const responseData = {
      activeUsers,
      totalStudents,
      totalTeachers,
      totalHomework,
      completedHomework,
      totalTests: 0, // Legacy field
      totalQuestions: 0, // Legacy field
      homeworkBySubject: homeworkBySubject.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      completionRates: {
        homework: totalHomework > 0 ? Math.round((completedHomework / totalHomework) * 100) : 0
      },
      recentHomework: recentHomework.map(hw => ({
        _id: hw._id,
        title: hw.title,
        subject: hw.subjectId?.name,
        class: hw.classId?.name,
        createdBy: hw.createdBy?.fullName,
        createdAt: hw.createdAt,
        dueDate: hw.dueDate
      })),
      recentTests: [], // Legacy field
      recentQuestions: [], // Legacy field
      testsBySubject: {}, // Legacy field
    };

    res.status(200).json({
      success: true,
      data: responseData,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Error getting admin analytics:', error);
    next(error);
  }
};

