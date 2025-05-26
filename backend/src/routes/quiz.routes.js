import express from "express";
import {
  createQuiz,
  getTeacherQuizzes,
  getStudentQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  startQuizAttempt,
  submitAnswer,
  submitQuizAttempt,
  getStudentQuizAttempts,
  getQuizAttempts,
  getQuizAttemptDetails,
  gradeQuizAttempt,
} from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/rbac.middleware.js";
import { requirePermission } from "../middlewares/permissions.middleware.js";
import { requireOwnership } from "../middlewares/permissions.middleware.js";

const router = express.Router();

// Apply authentication to all routes
router.use(verifyJWT);

// Quiz management routes (Teacher/ClassTeacher access)
router.post(
  "/",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_CREATE_QUIZ"),
  createQuiz
);

router.get(
  "/teacher",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_VIEW_OWN_QUIZZES"),
  getTeacherQuizzes
);

router.put(
  "/:quizId",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_UPDATE_QUIZ"),
  updateQuiz
);

router.delete(
  "/:quizId",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_DELETE_QUIZ"),
  deleteQuiz
);

router.post(
  "/:quizId/publish",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_PUBLISH_QUIZ"),
  publishQuiz
);

// Student quiz access routes
router.get(
  "/student",
  checkRole(["student"]),
  requirePermission("STUDENT_VIEW_AVAILABLE_QUIZZES"),
  getStudentQuizzes
);

// Quiz attempts routes (Student access)
router.post(
  "/:quizId/attempt",
  checkRole(["student"]),
  requirePermission("STUDENT_TAKE_QUIZ"),
  startQuizAttempt
);

router.post(
  "/:quizId/attempt/:attemptId/answer",
  checkRole(["student"]),
  requirePermission("STUDENT_SUBMIT_QUIZ_ANSWER"),
  submitAnswer
);

router.post(
  "/:quizId/attempt/:attemptId/submit",
  checkRole(["student"]),
  requirePermission("STUDENT_SUBMIT_QUIZ"),
  submitQuizAttempt
);

router.get(
  "/:quizId/attempts/student",
  checkRole(["student"]),
  requirePermission("STUDENT_VIEW_OWN_ATTEMPTS"),
  getStudentQuizAttempts
);

// Teacher quiz attempts and grading routes
router.get(
  "/:quizId/attempts",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_VIEW_QUIZ_ATTEMPTS"),
  getQuizAttempts
);

router.post(
  "/:quizId/attempts/:attemptId/grade",
  checkRole(["teacher", "classTeacher"]),
  requirePermission("TEACHER_GRADE_QUIZ"),
  gradeQuizAttempt
);

// Common routes (accessible by multiple roles with different permissions)
router.get(
  "/:quizId",
  requirePermission("VIEW_QUIZ_DETAILS"),
  getQuizById
);

router.get(
  "/:quizId/attempts/:attemptId",
  requirePermission("VIEW_QUIZ_ATTEMPT"),
  getQuizAttemptDetails
);

export default router; 