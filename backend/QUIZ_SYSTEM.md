# Quiz System Documentation

## Overview
The Quiz System is a comprehensive assessment platform that allows teachers to create, manage, and grade quizzes while providing students with an interactive quiz-taking experience.

## Features

### 🎯 Core Functionality
- **Quiz Creation**: Teachers can create quizzes with multiple question types
- **Question Types**: Multiple choice, single choice, true/false, short answer, essay
- **Randomization**: Questions and options can be shuffled for each attempt
- **Time Management**: Set quiz duration and question-specific time limits
- **Attempt Control**: Configure maximum attempts per student
- **Auto-Grading**: Automatic grading for objective questions
- **Manual Grading**: Teacher review for subjective questions

### 🔒 Security & Authentication
- **Role-Based Access**: Different permissions for students, teachers, and admins
- **Password Protection**: Optional quiz passwords
- **Multi-Tenancy**: School-level data isolation
- **Attempt Validation**: Prevents cheating and ensures data integrity

### 📊 Analytics & Reporting
- **Real-time Statistics**: Track completion rates and performance
- **Detailed Analytics**: Question-wise analysis and difficulty metrics
- **Student Progress**: Individual attempt history and scores
- **Teacher Dashboard**: Overview of all quiz attempts and grades

## API Endpoints

### Teacher Endpoints

#### Create Quiz
```http
POST /api/v1/quizzes
Authorization: Bearer <token>
Role: teacher, classTeacher

{
  "title": "Math Quiz 1",
  "description": "Basic algebra concepts",
  "classId": "class_id",
  "subjectId": "subject_id",
  "startDate": "2024-01-15T09:00:00Z",
  "endDate": "2024-01-15T11:00:00Z",
  "duration": 60,
  "questions": [...],
  "settings": {...},
  "grading": {...},
  "features": {...}
}
```

#### Get Teacher Quizzes
```http
GET /api/v1/quizzes/teacher?status=draft&page=1&limit=10
Authorization: Bearer <token>
Role: teacher, classTeacher
```

#### Update Quiz
```http
PUT /api/v1/quizzes/:quizId
Authorization: Bearer <token>
Role: teacher, classTeacher
```

#### Delete Quiz
```http
DELETE /api/v1/quizzes/:quizId
Authorization: Bearer <token>
Role: teacher, classTeacher
```

#### Publish Quiz
```http
POST /api/v1/quizzes/:quizId/publish
Authorization: Bearer <token>
Role: teacher, classTeacher
```

#### View Quiz Attempts
```http
GET /api/v1/quizzes/:quizId/attempts
Authorization: Bearer <token>
Role: teacher, classTeacher
```

#### Grade Quiz Attempt
```http
POST /api/v1/quizzes/:quizId/attempts/:attemptId/grade
Authorization: Bearer <token>
Role: teacher, classTeacher

{
  "grades": [
    {
      "questionId": "question_id",
      "marks": 8.5,
      "feedback": "Good answer but missing one point"
    }
  ],
  "teacherComments": "Well done overall"
}
```

### Student Endpoints

#### Get Available Quizzes
```http
GET /api/v1/quizzes/student?status=active
Authorization: Bearer <token>
Role: student
```

#### Start Quiz Attempt
```http
POST /api/v1/quizzes/:quizId/attempt
Authorization: Bearer <token>
Role: student

{
  "password": "optional_quiz_password"
}
```

#### Submit Answer
```http
POST /api/v1/quizzes/:quizId/attempt/:attemptId/answer
Authorization: Bearer <token>
Role: student

{
  "questionId": "question_id",
  "answer": "selected_option_or_text",
  "timeSpent": 30
}
```

#### Submit Quiz
```http
POST /api/v1/quizzes/:quizId/attempt/:attemptId/submit
Authorization: Bearer <token>
Role: student
```

#### Get Own Attempts
```http
GET /api/v1/quizzes/:quizId/attempts/student
Authorization: Bearer <token>
Role: student
```

### Common Endpoints

#### Get Quiz Details
```http
GET /api/v1/quizzes/:quizId
Authorization: Bearer <token>
```

#### Get Attempt Details
```http
GET /api/v1/quizzes/:quizId/attempts/:attemptId
Authorization: Bearer <token>
```

## Data Models

### Quiz Model
```javascript
{
  title: String,
  description: String,
  classId: ObjectId,
  subjectId: ObjectId,
  createdBy: ObjectId,
  schoolId: ObjectId,
  startDate: Date,
  endDate: Date,
  duration: Number, // minutes
  questions: [{
    questionText: String,
    questionType: String, // 'multiple_choice', 'single_choice', 'true_false', 'short_answer', 'essay'
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    marks: Number,
    negativeMarks: Number,
    difficultyLevel: String,
    timeLimit: Number
  }],
  settings: {
    maxAttempts: Number,
    shuffleQuestions: Boolean,
    shuffleOptions: Boolean,
    showResults: String, // 'immediately', 'after_end', 'manual'
    showCorrectAnswers: Boolean,
    allowReview: Boolean,
    requirePassword: Boolean,
    password: String,
    proctoring: {
      enabled: Boolean,
      lockdownBrowser: Boolean,
      webcamRequired: Boolean,
      plagiarismCheck: Boolean
    }
  },
  grading: {
    gradingMethod: String, // 'automatic', 'manual', 'hybrid'
    partialCredits: Boolean,
    passingMarks: Number
  },
  features: {
    calculator: Boolean,
    formulaSheet: Boolean,
    dictionary: Boolean,
    notepad: Boolean
  },
  status: String, // 'draft', 'published', 'active', 'completed', 'archived'
  statistics: {
    totalAttempts: Number,
    completedAttempts: Number,
    averageScore: Number,
    averageTime: Number
  }
}
```

### QuizAttempt Model
```javascript
{
  quizId: ObjectId,
  studentId: ObjectId,
  schoolId: ObjectId,
  attemptNumber: Number,
  startedAt: Date,
  submittedAt: Date,
  timeSpent: Number, // seconds
  status: String, // 'in_progress', 'submitted', 'graded', 'expired'
  answers: [{
    questionId: ObjectId,
    questionType: String,
    selectedOptions: [String],
    textAnswer: String,
    booleanAnswer: Boolean,
    marks: Number,
    maxMarks: Number,
    autoGraded: Boolean,
    timeSpent: Number,
    feedback: String
  }],
  results: {
    totalMarks: Number,
    obtainedMarks: Number,
    percentage: Number,
    grade: String,
    passed: Boolean
  },
  teacherComments: String,
  reviewedBy: ObjectId,
  reviewedAt: Date
}
```

## Permissions

### Student Permissions
- `STUDENT_VIEW_AVAILABLE_QUIZZES`: View quizzes available for their classes
- `STUDENT_TAKE_QUIZ`: Start a quiz attempt
- `STUDENT_SUBMIT_QUIZ_ANSWER`: Submit answers to questions
- `STUDENT_SUBMIT_QUIZ`: Submit completed quiz
- `STUDENT_VIEW_OWN_ATTEMPTS`: View their own quiz attempts

### Teacher Permissions
- `TEACHER_CREATE_QUIZ`: Create new quizzes for assigned classes
- `TEACHER_VIEW_OWN_QUIZZES`: View quizzes they created
- `TEACHER_UPDATE_QUIZ`: Update their own quizzes
- `TEACHER_DELETE_QUIZ`: Delete their own quizzes
- `TEACHER_PUBLISH_QUIZ`: Publish quizzes to make them available
- `TEACHER_VIEW_QUIZ_ATTEMPTS`: View student attempts on their quizzes
- `TEACHER_GRADE_QUIZ`: Grade quiz attempts manually

### Common Permissions
- `VIEW_QUIZ_DETAILS`: View quiz information (role-specific filtering)
- `VIEW_QUIZ_ATTEMPT`: View attempt details (role-specific filtering)

## Configuration

### Environment Variables
```bash
# Quiz feature toggle
ENABLE_QUIZ=true  # Default: true

# Quiz-specific settings (optional)
QUIZ_MAX_DURATION=240  # Maximum quiz duration in minutes
QUIZ_MAX_QUESTIONS=100  # Maximum questions per quiz
QUIZ_MAX_ATTEMPTS=10   # Maximum attempts per student
```

## Usage Examples

### Creating a Quiz
```javascript
const quizData = {
  title: "Introduction to Algebra",
  description: "Basic algebraic concepts and equations",
  classId: "64a1b2c3d4e5f6789abc123",
  subjectId: "64a1b2c3d4e5f6789abc456",
  startDate: "2024-01-15T09:00:00Z",
  endDate: "2024-01-15T11:00:00Z",
  duration: 60,
  questions: [
    {
      questionText: "What is 2 + 2?",
      questionType: "single_choice",
      options: [
        { text: "3", isCorrect: false },
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false }
      ],
      marks: 2,
      difficultyLevel: "easy"
    }
  ],
  settings: {
    maxAttempts: 2,
    shuffleQuestions: true,
    showResults: "after_end"
  }
};
```

### Taking a Quiz
```javascript
// Start attempt
const attempt = await startQuizAttempt(quizId, { password: "optional" });

// Submit answers
await submitAnswer(quizId, attemptId, {
  questionId: "question_id",
  answer: "selected_option",
  timeSpent: 30
});

// Submit quiz
await submitQuizAttempt(quizId, attemptId);
```

## Error Handling

### Common Error Codes
- `QUIZ_NOT_FOUND`: Quiz doesn't exist or not accessible
- `QUIZ_NOT_ACTIVE`: Quiz is not currently available for attempts
- `MAX_ATTEMPTS_EXCEEDED`: Student has used all allowed attempts
- `QUIZ_EXPIRED`: Quiz attempt has exceeded time limit
- `INVALID_PASSWORD`: Incorrect quiz password provided
- `NOT_ENROLLED`: Student is not enrolled in the quiz's class

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (schoolId, classId, studentId)
- Efficient aggregation pipelines for analytics
- Proper pagination for large result sets

### Caching Strategy
- Quiz data caching for active quizzes
- Student enrollment data caching
- Statistics caching with TTL

### Security Measures
- Input validation for all quiz data
- XSS protection for text answers
- Rate limiting on quiz endpoints
- Attempt validation to prevent cheating

## Future Enhancements

### Planned Features
- [ ] Question banks and reusable questions
- [ ] Advanced proctoring integration
- [ ] AI-powered auto-grading for essays
- [ ] Detailed analytics dashboard
- [ ] Quiz templates and sharing
- [ ] Offline quiz taking capability
- [ ] Advanced question types (drag-drop, matching)

### Integration Points
- Analytics system for detailed reporting
- Notification system for quiz reminders
- File upload system for question attachments
- Grading system integration

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team. 