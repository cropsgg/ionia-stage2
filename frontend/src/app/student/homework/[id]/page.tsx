'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import { 
  FiClock, FiFileText, FiUpload, FiDownload, FiSave, FiSend, 
  FiAlertTriangle, FiCheckCircle, FiX, FiEye, FiMessageSquare,
  FiCalendar, FiUser, FiBook, FiPlay, FiPause, FiRotateCcw
} from 'react-icons/fi';

interface HomeworkDetail {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'assignment' | 'quiz' | 'project' | 'reading';
  dueDate: Date;
  assignedDate: Date;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  maxScore: number;
  submittedScore?: number;
  timeLimit?: number; // in minutes for quizzes
  attempts?: number;
  maxAttempts?: number;
  submissionType: 'file' | 'text' | 'quiz' | 'both';
  teacherName: string;
  instructions: string;
  resources?: { name: string; url: string; type: string }[];
  rubric?: { criteria: string; maxPoints: number; description: string }[];
  feedback?: string;
  submittedAt?: Date;
  submittedFiles?: { name: string; url: string; size: number }[];
  textSubmission?: string;
  quizQuestions?: QuizQuestion[];
  studentAnswers?: { [questionId: string]: any };
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: any;
  points: number;
  explanation?: string;
}

const HomeworkDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [homework, setHomework] = useState<HomeworkDetail | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock homework data
  useEffect(() => {
    if (params.id) {
      const mockHomework: HomeworkDetail = {
        id: params.id as string,
        title: 'Quadratic Equations - Chapter 5',
        description: 'Complete exercises 1-15 from Chapter 5. Focus on solving quadratic equations using factoring and the quadratic formula. Show all your work clearly and explain your reasoning for each step.',
        subject: 'Mathematics',
        type: params.id === 'quiz-1' ? 'quiz' : 'assignment',
        dueDate: new Date(2024, 0, 20),
        assignedDate: new Date(2024, 0, 15),
        status: 'in_progress',
        priority: 'high',
        maxScore: 100,
        timeLimit: params.id === 'quiz-1' ? 30 : undefined,
        maxAttempts: params.id === 'quiz-1' ? 2 : undefined,
        attempts: params.id === 'quiz-1' ? 0 : undefined,
        submissionType: params.id === 'quiz-1' ? 'quiz' : 'both',
        teacherName: 'Mr. Johnson',
        instructions: params.id === 'quiz-1' 
          ? 'Answer all questions within the time limit. You have 2 attempts for this quiz. Choose the best answer for multiple choice questions.'
          : 'Complete all exercises showing your work. Upload your solutions as PDF or image files. You may also type your answers in the text box below. Ensure all calculations are clearly shown.',
        resources: [
          { name: 'Chapter 5 Notes.pdf', url: '/resources/chapter5-notes.pdf', type: 'pdf' },
          { name: 'Formula Sheet.pdf', url: '/resources/formulas.pdf', type: 'pdf' },
          { name: 'Video Tutorial - Quadratic Formula', url: 'https://example.com/video', type: 'video' }
        ],
        rubric: params.id !== 'quiz-1' ? [
          { criteria: 'Correct Solutions', maxPoints: 60, description: 'All problems solved correctly with accurate calculations' },
          { criteria: 'Work Shown', maxPoints: 25, description: 'All steps clearly shown and organized' },
          { criteria: 'Explanations', maxPoints: 15, description: 'Clear explanations of solution methods' }
        ] : undefined,
        quizQuestions: params.id === 'quiz-1' ? [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'What is the discriminant of the quadratic equation x² - 4x + 3 = 0?',
            options: ['4', '8', '12', '16'],
            correctAnswer: '4',
            points: 10,
            explanation: 'The discriminant is b² - 4ac = (-4)² - 4(1)(3) = 16 - 12 = 4'
          },
          {
            id: 'q2',
            type: 'true_false',
            question: 'A quadratic equation always has two real solutions.',
            correctAnswer: false,
            points: 10,
            explanation: 'False. A quadratic equation can have 0, 1, or 2 real solutions depending on the discriminant.'
          },
          {
            id: 'q3',
            type: 'short_answer',
            question: 'Solve the equation: x² - 5x + 6 = 0',
            correctAnswer: 'x = 2, x = 3',
            points: 15,
            explanation: 'Factor as (x - 2)(x - 3) = 0, so x = 2 or x = 3'
          }
        ] : undefined
      };

      setHomework(mockHomework);
      
      // Load previous answers if any
      if (mockHomework.studentAnswers) {
        setQuizAnswers(mockHomework.studentAnswers);
      }
      if (mockHomework.textSubmission) {
        setTextAnswer(mockHomework.textSubmission);
      }
    }
  }, [params.id]);

  // Quiz timer effect
  useEffect(() => {
    if (isQuizStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isQuizStarted && timeRemaining === 0) {
      handleQuizSubmit();
    }
  }, [isQuizStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuizAnswerChange = (questionId: string, answer: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    autoSave();
  };

  const startQuiz = () => {
    if (homework?.timeLimit) {
      setTimeRemaining(homework.timeLimit * 60);
    }
    setIsQuizStarted(true);
  };

  const autoSave = async () => {
    setSaving(true);
    // Mock auto-save
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const isSubmissionValid = () => {
    if (!homework) return false;
    
    switch (homework.submissionType) {
      case 'file':
        return uploadedFiles.length > 0;
      case 'text':
        return textAnswer.trim().length > 0;
      case 'quiz':
        return true; // Quiz validation handled separately
      case 'both':
        return uploadedFiles.length > 0 || textAnswer.trim().length > 0;
      default:
        return false;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      alert('Progress saved successfully!');
    }, 1000);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setSubmitting(false);
      alert('Assignment submitted successfully!');
      router.push('/student/homework');
    }, 2000);
  };

  const handleQuizSubmit = async () => {
    setSubmitting(true);
    setIsQuizStarted(false);
    // Mock quiz submission
    setTimeout(() => {
      setSubmitting(false);
      alert('Quiz submitted successfully!');
      router.push('/student/homework');
    }, 2000);
  };

  const renderQuizQuestion = (question: QuizQuestion, index: number) => {
    const userAnswer = quizAnswers[question.id];

    return (
      <Card key={question.id} className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Question {index + 1}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {question.points} points
          </span>
        </div>

        <p className="text-gray-900 mb-4">{question.question}</p>

        {question.type === 'multiple_choice' && (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleQuizAnswerChange(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={userAnswer === true}
                onChange={() => handleQuizAnswerChange(question.id, true)}
                className="text-blue-600"
              />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={userAnswer === false}
                onChange={() => handleQuizAnswerChange(question.id, false)}
                className="text-blue-600"
              />
              <span>False</span>
            </label>
          </div>
        )}

        {(question.type === 'short_answer' || question.type === 'essay') && (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleQuizAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={question.type === 'essay' ? 6 : 3}
          />
        )}
      </Card>
    );
  };

  if (!homework) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading homework...</p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilDue(homework.dueDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{homework.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiBook className="h-4 w-4" />
              <span>{homework.subject}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUser className="h-4 w-4" />
              <span>{homework.teacherName}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="h-4 w-4" />
              <span>{homework.dueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            daysLeft < 0 ? 'bg-red-100 text-red-800' :
            daysLeft === 0 ? 'bg-orange-100 text-orange-800' :
            daysLeft <= 2 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
             daysLeft === 0 ? 'Due today' :
             daysLeft === 1 ? 'Due tomorrow' :
             `${daysLeft} days left`}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {homework.maxScore} points
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {homework.status === 'overdue' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">
              This assignment is overdue. Late submissions may receive reduced points.
            </p>
          </div>
        </div>
      )}

      {/* Quiz Timer */}
      {homework.type === 'quiz' && isQuizStarted && timeRemaining !== null && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiClock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Time Remaining:</span>
            </div>
            <div className={`text-xl font-bold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          {timeRemaining < 300 && (
            <p className="text-red-600 text-sm mt-2">⚠️ Less than 5 minutes remaining!</p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Instructions */}
          <Card title="Instructions" className="p-5">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{homework.instructions}</p>
            </div>
          </Card>

          {/* Assignment/Quiz Content */}
          {homework.type === 'quiz' ? (
            <div className="space-y-6">
              {!isQuizStarted ? (
                <Card className="p-6 text-center">
                  <FiPlay className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Ready to start the quiz?</h2>
                  <p className="text-gray-600 mb-4">
                    You have {homework.timeLimit} minutes to complete this quiz.
                    {homework.maxAttempts && homework.attempts !== undefined && (
                      <span className="block mt-1">
                        Attempts: {homework.attempts}/{homework.maxAttempts}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={homework.maxAttempts !== undefined && homework.attempts !== undefined && homework.attempts >= homework.maxAttempts}
                  >
                    Start Quiz
                  </button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Quiz Questions</h2>
                    <div className="flex items-center gap-2">
                      {saving && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiSave className="h-4 w-4 animate-spin" />
                          Saving...
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {homework.quizQuestions?.map((question, index) => 
                    renderQuizQuestion(question, index)
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                      {Object.keys(quizAnswers).length} of {homework.quizQuestions?.length} questions answered
                    </div>
                    <button
                      onClick={handleQuizSubmit}
                      disabled={submitting}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Upload */}
              {(homework.submissionType === 'file' || homework.submissionType === 'both') && (
                <Card title="File Submission" className="p-5">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block text-center">
                        <FiUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG, TXT (Max 50MB per file)
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FiFileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Text Submission */}
              {(homework.submissionType === 'text' || homework.submissionType === 'both') && (
                <Card title="Text Submission" className="p-5">
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{textAnswer.length} characters</span>
                    {saving && (
                      <span className="flex items-center gap-1">
                        <FiSave className="h-4 w-4 animate-spin" />
                        Auto-saving...
                      </span>
                    )}
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !isSubmissionValid()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Details */}
          <Card title="Assignment Details" className="p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{homework.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium">{homework.dueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned:</span>
                <span className="font-medium">{homework.assignedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Points:</span>
                <span className="font-medium">{homework.maxScore}</span>
              </div>
              {homework.timeLimit && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Limit:</span>
                  <span className="font-medium">{homework.timeLimit} minutes</span>
                </div>
              )}
              {homework.maxAttempts && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Attempts:</span>
                  <span className="font-medium">{homework.maxAttempts}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Resources */}
          {homework.resources && homework.resources.length > 0 && (
            <Card title="Resources" className="p-5">
              <div className="space-y-2">
                {homework.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiDownload className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600 hover:underline">{resource.name}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Rubric */}
          {homework.rubric && homework.rubric.length > 0 && (
            <Card title="Grading Rubric" className="p-5">
              <div className="space-y-3">
                {homework.rubric.map((criterion, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{criterion.criteria}</h4>
                      <span className="text-sm text-gray-500">{criterion.maxPoints} pts</span>
                    </div>
                    <p className="text-xs text-gray-600">{criterion.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Help */}
          <Card title="Need Help?" className="p-5">
            <div className="space-y-3">
              <a href="/student/help" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <FiMessageSquare className="h-4 w-4" />
                Contact Teacher
              </a>
              <a href="/student/tutorials" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <FiEye className="h-4 w-4" />
                View Tutorials
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeworkDetailPage;