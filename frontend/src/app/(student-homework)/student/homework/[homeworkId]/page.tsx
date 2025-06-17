'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiSave, FiCheck, FiAlertTriangle, FiPaperclip, FiDownload } from 'react-icons/fi';
import FileUpload, { FileAttachment } from '@/components/FileUpload';
import RichTextEditor from '@/components/RichTextEditor';

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
  attachments?: FileAttachment[];
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
  difficultyLevel: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  questions: QuestionType[];
  personalizationEnabled: boolean;
  attachments?: FileAttachment[];
};

type AnswerType = {
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  attachments?: FileAttachment[];
};

type StudentProfileType = {
  recommendedLearningStyle: string | null;
  learningStyles: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
};

// Mock data for initial development
const MOCK_HOMEWORK: HomeworkType = {
  _id: '1',
  title: 'Forces and Motion - Week 3',
  description: 'Complete all questions on Newton\'s laws of motion',
  classId: { _id: '1', name: 'Grade 10A' },
  subjectId: { _id: '202', name: 'Physics' },
  dueDate: '2023-09-15T23:59:59Z',
  difficultyLevel: 'medium',
  isActive: true,
  personalizationEnabled: true,
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
      learningStyle: 'reading',
      attachments: []
    },
    {
      _id: 'q2',
      questionText: 'Explain how Newton\'s Second Law relates force, mass, and acceleration. Provide an example.',
      questionType: 'subjective',
      options: [],
      marks: 5,
      difficultyLevel: 'medium',
      learningStyle: 'kinesthetic',
      attachments: [
        {
          id: 'att1',
          fileName: 'newton_second_law.pdf',
          fileType: 'application/pdf',
          fileSize: 2048576,
          fileUrl: '#',
          uploadedAt: new Date()
        }
      ]
    },
  ],
  attachments: [
    {
      id: 'hw-att1',
      fileName: 'newtons_laws_summary.pdf',
      fileType: 'application/pdf',
      fileSize: 3145728,
      fileUrl: '#',
      uploadedAt: new Date()
    }
  ]
};

const MOCK_PROFILE: StudentProfileType = {
  recommendedLearningStyle: 'kinesthetic',
  learningStyles: {
    visual: 65,
    auditory: 30,
    reading: 45,
    kinesthetic: 80
  }
};

const HomeworkCompletionPage = () => {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;
  
  const [homework, setHomework] = useState<HomeworkType | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Track time spent
  const [startTime] = useState<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  
  // Form state
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  
  // Fetch homework data
  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const response = await axios.get(`/api/v1/homework/${homeworkId}`);
        // setHomework(response.data.data.homework);
        // if (response.data.data.studentProfile) {
        //   setStudentProfile(response.data.data.studentProfile);
        // }
        
        // Using mock data for now
        setHomework(MOCK_HOMEWORK);
        setStudentProfile(MOCK_PROFILE);
        
        // Initialize answers
        const initialAnswers = MOCK_HOMEWORK.questions.map(question => ({
          questionId: question._id,
          answerText: '',
          selectedOptions: [],
          attachments: [],
        }));
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Failed to fetch homework:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch homework.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Clean up timer on unmount
    const interval = setInterval(() => {
      const now = new Date();
      const minutesSpent = Math.floor((now.getTime() - startTime.getTime()) / 60000);
      setTimeSpent(minutesSpent);
    }, 60000); // Update every minute

    fetchHomework();
    
    return () => clearInterval(interval);
  }, [homeworkId, startTime]);

  // Handle objective question choice
  const handleObjectiveAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? { ...answer, selectedOptions: [optionId] }
          : answer
      )
    );
  };

  // Handle subjective question answer
  const handleSubjectiveAnswer = (questionId: string, text: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? { ...answer, answerText: text }
          : answer
      )
    );
  };

  // Handle file attachments
  const handleAttachmentChange = (questionId: string, attachments: FileAttachment[]) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? { ...answer, attachments }
          : answer
      )
    );
  };

  // Submit homework answers
  const handleSubmit = async () => {
    // Validate all questions are answered
    const unansweredQuestions = answers.filter(answer => {
      if (homework) {
        const question = homework.questions.find(q => q._id === answer.questionId);
        return question?.questionType === 'objective' 
          ? answer.selectedOptions.length === 0
          : !answer.answerText;
      }
      return false;
    });

    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      // In real implementation:
      // await axios.post(`/api/v1/homework-submissions/${homeworkId}`, {
      //   answers,
      //   timeSpent
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and redirect after delay
      setSuccess(true);
      setTimeout(() => {
        router.push('/student/homework');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit homework:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to submit homework.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if homework is past due
  const isPastDue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return now > dueDate;
  };

  // Render learning style tag
  const renderLearningStyleTag = (style: string | undefined | null) => {
    if (!style) return null;
    
    const styleColors = {
      visual: 'bg-blue-100 text-blue-800',
      auditory: 'bg-green-100 text-green-800',
      reading: 'bg-purple-100 text-purple-800',
      kinesthetic: 'bg-orange-100 text-orange-800'
    };
    
    const colorClass = styleColors[style as keyof typeof styleColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {style.charAt(0).toUpperCase() + style.slice(1)} learner
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Complete Homework</h1>
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
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            Homework submitted successfully! Redirecting...
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : homework ? (
        <>
          {/* Homework Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{homework.title}</h2>
            <p className="text-gray-600 mb-4">{homework.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
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
                {formatDueDate(homework.dueDate)}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Difficulty:</span>
                <span className="capitalize">{homework.difficultyLevel}</span>
              </div>
            </div>
            
            {isPastDue(homework.dueDate) && (
              <div className="flex items-center mt-2 text-orange-500">
                <FiAlertTriangle className="mr-2" />
                <span className="text-sm font-medium">
                  This homework is past due. Your submission will be marked as late.
                </span>
              </div>
            )}
            
            {homework.personalizationEnabled && studentProfile && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                <p className="text-sm text-indigo-800 font-medium">
                  This homework has been personalized based on your learning profile.
                </p>
                {studentProfile.recommendedLearningStyle && (
                  <div className="mt-2">
                    <span className="text-sm text-indigo-700">Your recommended learning style: </span>
                    {renderLearningStyleTag(studentProfile.recommendedLearningStyle)}
                  </div>
                )}
              </div>
            )}
            
            {/* Homework Attachments */}
            {homework.attachments && homework.attachments.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Homework Materials:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {homework.attachments.map(attachment => (
                    <a 
                      key={attachment.id}
                      href={attachment.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      download={attachment.fileName}
                    >
                      <FiPaperclip className="mr-1" />
                      {attachment.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Timer */}
          <div className="flex items-center mb-6 text-gray-600">
            <FiClock className="mr-2" />
            <span>Time spent: {timeSpent} minutes</span>
          </div>
          
          {/* Questions */}
          <div className="space-y-8 mb-8">
            {homework.questions.map((question, index) => (
              <div key={question._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">
                    Question {index + 1} <span className="text-gray-500">({question.marks} {question.marks === 1 ? 'mark' : 'marks'})</span>
                  </h3>
                  
                  {question.learningStyle && (
                    <div className="ml-2">
                      {renderLearningStyleTag(question.learningStyle)}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-800">{question.questionText}</p>
                  
                  {/* Question Attachments */}
                  {question.attachments && question.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reference Materials:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.attachments.map(attachment => (
                          <a 
                            key={attachment.id}
                            href={attachment.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                            download={attachment.fileName}
                          >
                            <FiDownload className="mr-1" />
                            {attachment.fileName}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {question.questionType === 'objective' ? (
                  <div className="space-y-2">
                    {question.options.map(option => {
                      const isSelected = answers.find(a => a.questionId === question._id)?.selectedOptions.includes(option._id);
                      
                      return (
                        <div 
                          key={option._id}
                          className={`p-3 border rounded-md cursor-pointer ${
                            isSelected 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleObjectiveAnswer(question._id, option._id)}
                        >
                          <div className="flex items-start">
                            <div className={`w-5 h-5 mt-0.5 flex-shrink-0 border rounded-full ${
                              isSelected ? 'border-indigo-500' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-3 h-3 m-1 rounded-full bg-indigo-500"></div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-700">{option.text}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Rich Text Editor for Subjective Answer */}
                    <RichTextEditor
                      value={answers.find(a => a.questionId === question._id)?.answerText || ''}
                      onChange={(value) => handleSubjectiveAnswer(question._id, value)}
                      placeholder="Enter your answer here..."
                      height="min-h-[200px]"
                      label="Your Answer"
                    />
                    
                    {/* File Attachments for Answer */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Attach Files (Optional)
                      </p>
                      <FileUpload
                        attachments={answers.find(a => a.questionId === question._id)?.attachments || []}
                        onChange={(attachments) => handleAttachmentChange(question._id, attachments)}
                        maxFiles={3}
                        maxSize={10} // 10MB
                        allowedTypes={['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
              disabled={submitting || success}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Submit Homework
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Homework not found or no longer available.</p>
        </div>
      )}
    </div>
  );
};

export default HomeworkCompletionPage; 