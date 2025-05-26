import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from './middlewares/error.middleware.js';
import { CONFIG } from './config/index.js';

const app = express();

// ✅ Use Cookie Parser Middleware
app.use(cookieParser());

// ✅ Simplified CORS Configuration using our config module
app.use(cors(CONFIG.CORS));

// ✅ Body Parsing Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// ✅ Routes Import
import userRouter from "./routes/user.routes.js";
import analyticsRouter from './routes/analytics.routes.js';
import superadminRouter from './routes/superadmin.routes.js';
import classRouter from './routes/class.routes.js';
import subjectRouter from './routes/subject.routes.js';
import schoolAdminRouter from './routes/schoolAdmin.routes.js';
import homeworkRouter from './routes/homework.routes.js';
import homeworkSubmissionRouter from './routes/homeworkSubmission.routes.js';
import quizRouter from './routes/quiz.routes.js';

// ✅ Routes Declaration
app.use("/api/v1/users", userRouter);
app.use('/api', analyticsRouter); 
app.use('/api/v1/superadmin', superadminRouter); // Super Admin routes for school management
app.use('/api/v1/classes', classRouter); // Class management routes
app.use('/api/v1/subjects', subjectRouter); // Subject management routes
app.use('/api/v1/school-admin', schoolAdminRouter); // School Admin user management routes
app.use('/api/v1/homework', homeworkRouter); // Homework management routes
app.use('/api/v1/homework-submissions', homeworkSubmissionRouter); // Homework submissions routes
app.use('/api/v1/quizzes', quizRouter); // Quiz management and taking routes

// ✅ Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ionia Stage 2 LMS API is running",
    environment: CONFIG.SERVER.NODE_ENV,
    version: CONFIG.API.VERSION,
    features: Object.entries(CONFIG.FEATURES)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name)
  });
});

// ✅ API Info Endpoint
app.get("/api", (req, res) => {
    res.json({
    success: true,
    message: "Ionia Stage 2 LMS API",
    version: CONFIG.API.VERSION,
    baseUrl: CONFIG.API.BASE_URL,
    endpoints: [
      "/api/v1/users",
      "/api/v1/superadmin", 
      "/api/v1/classes",
      "/api/v1/subjects",
      "/api/v1/school-admin",
      "/api/v1/homework",
      "/api/v1/homework-submissions",
      "/api/v1/quizzes",
      "/api"
    ]
  });
});

// Log all incoming requests in development
if (CONFIG.SERVER.IS_DEVELOPMENT) {
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
}

// Error handling middleware
app.use(errorHandler);

// ✅ Export the App
export { app };
