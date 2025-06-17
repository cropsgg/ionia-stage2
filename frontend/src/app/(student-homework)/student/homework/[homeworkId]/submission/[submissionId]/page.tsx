'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle, FiMessageCircle } from 'react-icons/fi';

// Define types
type OptionType = {
  _id: string;
  text: string;
  isCorrect?: boolean;
};

type QuestionType = {
  _id: string;
  questionText: string;
  questionType: 'objective' | 'subjective';
  options: OptionType[];
  marks: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | null;
};

type HomeworkType = {
  _id: string;
  title: string;
  description: string;
  classId: {
    _id: string;
    name: string;
  };
  subjectId: {
    _id: string;
    name: string;
  };
  dueDate: string;
  questions: QuestionType[];
};

type AnswerType = {
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  marks?: number;
  feedback?: string;
  isCorrect?: boolean;
  gradedBy?: string;
  gradedAt?: string;
};

type SubmissionType = {
  _id: string;
  homeworkId: string;
  studentId: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  submittedAt: string;
  answers: AnswerType[];
  totalMarks: number;
  totalObtainedMarks: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  timeSpent?: number;
};

// Mock data for initial development
const MOCK_HOMEWORK: HomeworkType = {
  _id: '1',
  title: 'Forces and Motion - Week 3',
  description: 'Complete all questions on Newton\'s laws of motion',
  classId: { _id: '1', name: 'Grade 10A' },
  subjectId: { _id: '202', name: 'Physics' },
  dueDate: '2023-09-15T23:59:59Z',
  questions: [
    {
      _id: 'q1',
      questionText: 'Which of Newton\'s laws states that an object at rest stays at rest unless acted upon by an external force?',
      questionType: 'objective',
      options: [
        { _id: 'o1', text: 'First Law', isCorrect: true },
        { _id: 'o2', text: 'Second Law', isCorrect: false },
        { _id: 'o3', text: 'Third Law', isCorrect: false },
        { _id: 'o4', text: 'Fourth Law', isCorrect: false },
      ],
      marks: 1,
      difficultyLevel: 'easy',
    },
    {
      _id: 'q2',
      questionText: 'Explain how Newton\'s Second Law relates force, mass, and acceleration. Provide an example.',
      questionType: 'subjective',
      options: [],
      marks: 5,
      difficultyLevel: 'medium',
    },
  ]
};

const MOCK_SUBMISSION: SubmissionType = {
  _id: '101',
  homeworkId: '1',
  studentId: 'student1',
  status: 'graded',
  submittedAt: '2023-09-14T14:30:00Z',
  answers: [
    {
      questionId: 'q1',
      selectedOptions: ['o1'],
      isCorrect: true,
      marks: 1,
      feedback: 'Correct answer!',
      gradedBy: 'teacher1',
      gradedAt: '2023-09-16T10:15:00Z',
    },
    {
      questionId: 'q2',
      answerText: 'Newton\'s Second Law states that F = ma, which means the force applied on an object equals its mass times acceleration. For example, when pushing a shopping cart, the more mass in the cart, the more force needed to achieve the same acceleration.',
      selectedOptions: [],
      isCorrect: true,
      marks: 4,
      feedback: 'Good explanation, but you could have elaborated more on the proportionality relationship.',
      gradedBy: 'teacher1',
      gradedAt: '2023-09-16T10:20:00Z',
    },
  ],
  totalMarks: 6,
  totalObtainedMarks: 5,
  feedback: 'Good job overall. Your understanding of Newton\'s laws is solid.',
  gradedBy: 'teacher1',
  gradedAt: '2023-09-16T10:25:00Z',
  timeSpent: 35,
};

const SubmissionViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;
  const submissionId = params.submissionId as string;
  
  const [homework, setHomework] = useState<HomeworkType | null>(null);
  const [submission, setSubmission] = useState<SubmissionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch submission data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const response = await axios.get(`/api/v1/homework-submissions/${homeworkId}/student`);
        // setSubmission(response.data.data.submission);
        // setHomework(response.data.data.homework);
        
        // Using mock data for now
        setHomework(MOCK_HOMEWORK);
        setSubmission(MOCK_SUBMISSION);
      } catch (err) {
        console.error('Failed to fetch submission:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch submission.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [homeworkId, submissionId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate score percentage
  const calculateScorePercentage = () => {
    if (submission && submission.totalMarks > 0) {
      return Math.round((submission.totalObtainedMarks / submission.totalMarks) * 100);
    }
    return 0;
  };

  // Get score color class
  const getScoreColorClass = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Homework Submission</h1>
        <Link 
          href="/student/homework"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Homework
        </Link>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : submission && homework ? (
        <>
          {/* Submission Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{homework.title}</h2>
                <p className="text-gray-600 mb-4">{homework.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Subject:</span>
                    {homework.subjectId.name}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Class:</span>
                    {homework.classId.name}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Due Date:</span>
                    {formatDate(homework.dueDate)}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="font-medium mr-2">Submitted on:</span>
                  {formatDate(submission.submittedAt)}
                </div>
                
                {submission.timeSpent && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiClock className="mr-1" />
                    <span className="font-medium mr-2">Time spent:</span>
                    {submission.timeSpent} minutes
                  </div>
                )}
                
                <div className="flex items-center mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(submission.status)}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {submission.status === 'graded' && (
                <div className="bg-gray-50 p-4 rounded-lg min-w-[200px] text-center">
                  <div className="text-2xl font-bold mb-1 flex items-center justify-center">
                    <span className={getScoreColorClass(calculateScorePercentage())}>
                      {submission.totalObtainedMarks} / {submission.totalMarks}
                    </span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColorClass(calculateScorePercentage())}`}>
                    {calculateScorePercentage()}%
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Graded on: {submission.gradedAt && formatDate(submission.gradedAt)}
                  </div>
                </div>
              )}
            </div>
            
            {submission.feedback && (
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <FiMessageCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Feedback from Teacher</h3>
                    <p className="text-blue-700">{submission.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Questions and Answers */}
          <div className="space-y-8 mb-8">
            {homework.questions.map((question, index) => {
              const answer = submission.answers.find(a => a.questionId === question._id);
              const isCorrect = answer?.isCorrect;
              
              return (
                <div key={question._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`p-4 ${
                    answer && answer.gradedBy 
                      ? isCorrect ? 'bg-green-50' : 'bg-orange-50' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">
                        Question {index + 1} <span className="text-gray-500">({question.marks} {question.marks === 1 ? 'mark' : 'marks'})</span>
                      </h3>
                      
                      {answer && answer.gradedBy && (
                        <div className="flex items-center">
                          {isCorrect ? (
                            <FiCheckCircle className="text-green-600 mr-2" />
                          ) : (
                            <FiAlertCircle className="text-orange-600 mr-2" />
                          )}
                          <span className="text-sm font-medium">
                            {answer.marks} / {question.marks}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-800">{question.questionText}</p>
                    </div>
                    
                    {question.questionType === 'objective' ? (
                      <div className="space-y-2 mb-4">
                        {question.options.map(option => {
                          const isSelected = answer?.selectedOptions.includes(option._id);
                          const isCorrectOption = option.isCorrect;
                          
                          return (
                            <div 
                              key={option._id}
                              className={`p-3 border rounded-md ${
                                answer && answer.gradedBy ? (
                                  isCorrectOption 
                                    ? 'border-green-500 bg-green-50' 
                                    : isSelected 
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-200'
                                ) : (
                                  isSelected 
                                    ? 'border-indigo-500 bg-indigo-50' 
                                    : 'border-gray-200'
                                )
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-5 h-5 mt-0.5 flex-shrink-0 border rounded-full ${
                                  isSelected 
                                    ? 'border-indigo-500' 
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <div className="w-3 h-3 m-1 rounded-full bg-indigo-500"></div>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className={`${
                                    answer && answer.gradedBy && isCorrectOption 
                                      ? 'text-green-700 font-medium' 
                                      : 'text-gray-700'
                                  }`}>
                                    {option.text}
                                    {answer && answer.gradedBy && isCorrectOption && ' (Correct)'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Answer
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                          {answer?.answerText || 'No answer provided'}
                        </div>
                      </div>
                    )}
                    
                    {answer?.feedback && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-start">
                          <FiMessageCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Teacher Feedback</h4>
                            <p className="text-blue-700">{answer.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Learning insights from this homework */}
          {submission.status === 'graded' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Learning Insights</h2>
              <p className="text-gray-600 mb-4">
                Based on your performance in this homework, we've updated your learning profile to better personalize future assignments.
              </p>
              
              <Link
                href="/student/learning-profile"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
              >
                View your updated learning profile
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Submission not found or no longer available.</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionViewPage; 