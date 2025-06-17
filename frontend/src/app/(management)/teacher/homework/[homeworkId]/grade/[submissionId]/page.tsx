'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { 
  FiArrowLeft, FiSave, FiCheck, FiXCircle, FiClock, 
  FiHelpCircle, FiMessageSquare, FiPaperclip, FiDownload,
  FiClipboard
} from 'react-icons/fi';
import TextAnnotator from '@/components/TextAnnotator';
import RubricEvaluator, { Rubric, RubricCriterion } from '@/components/RubricEvaluator';
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
  questions: QuestionType[];
  dueDate: string;
  rubrics?: Rubric[];
  attachments?: FileAttachment[];
  version?: number;
  previousVersions?: {
    version: number;
    modifiedAt: string;
    modifiedBy: string;
    changeDescription: string;
  }[];
};

type Annotation = {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  comment: string;
  color: string;
};

type AnswerType = {
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  marks?: number;
  feedback?: string;
  isCorrect?: boolean;
  attachments?: FileAttachment[];
  annotations?: Annotation[];
};

type StudentInfo = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
};

type SubmissionType = {
  _id: string;
  homeworkId: string;
  studentId: StudentInfo;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  submittedAt: string;
  answers: AnswerType[];
  totalMarks: number;
  totalObtainedMarks?: number;
  feedback?: string;
  timeSpent?: number;
  rubricEvaluations?: Record<string, { levelId: string, marks: number }>;
};

type AIAssessmentType = {
  similarityScore: number;
  suggestedMarks: number;
  feedback: string;
  keyConceptsMissing: string[];
  keyConceptsIdentified: string[];
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
      attachments: []
    },
    {
      _id: 'q2',
      questionText: 'Explain how Newton\'s Second Law relates force, mass, and acceleration. Provide an example.',
      questionType: 'subjective',
      options: [],
      marks: 5,
      difficultyLevel: 'medium',
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
  rubrics: [
    {
      id: 'r1',
      name: 'Physics Understanding Rubric',
      description: 'Evaluates understanding of physics concepts and application',
      criteria: [
        {
          id: 'c1',
          criterion: 'Conceptual Understanding',
          maxMarks: 3,
          levels: [
            { id: 'l1', level: 'Basic', description: 'Shows basic understanding of the concept', marks: 1 },
            { id: 'l2', level: 'Proficient', description: 'Shows good understanding with minor misconceptions', marks: 2 },
            { id: 'l3', level: 'Advanced', description: 'Demonstrates thorough and accurate understanding', marks: 3 },
          ]
        },
        {
          id: 'c2',
          criterion: 'Application to Real World',
          maxMarks: 2,
          levels: [
            { id: 'l4', level: 'Basic', description: 'Provides simple example with limited explanation', marks: 1 },
            { id: 'l5', level: 'Advanced', description: 'Provides detailed example with clear connection to concept', marks: 2 },
          ]
        },
      ]
    }
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

const MOCK_SUBMISSION: SubmissionType = {
  _id: '101',
  homeworkId: '1',
  studentId: {
    _id: 'student1',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    username: 'johnsmith'
  },
  status: 'submitted',
  submittedAt: '2023-09-14T14:30:00Z',
  answers: [
    {
      questionId: 'q1',
      selectedOptions: ['o1'],
      attachments: []
    },
    {
      questionId: 'q2',
      answerText: 'Newton\'s Second Law states that F = ma, which means the force applied on an object equals its mass times acceleration. For example, when pushing a shopping cart, the more mass in the cart, the more force needed to achieve the same acceleration.',
      selectedOptions: [],
      attachments: [
        {
          id: 'ans-att1',
          fileName: 'my_solution.pdf',
          fileType: 'application/pdf',
          fileSize: 1048576,
          fileUrl: '#',
          uploadedAt: new Date()
        }
      ]
    },
  ],
  totalMarks: 6,
  timeSpent: 35,
};

const HomeworkGradingPage = () => {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;
  const submissionId = params.submissionId as string;
  
  const [homework, setHomework] = useState<HomeworkType | null>(null);
  const [submission, setSubmission] = useState<SubmissionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // AI assessment state
  const [aiAssessmentLoading, setAiAssessmentLoading] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<AIAssessmentType | null>(null);
  const [currentSubjectiveQuestionId, setCurrentSubjectiveQuestionId] = useState<string | null>(null);
  
  // Annotation state
  const [annotations, setAnnotations] = useState<{ [questionId: string]: Annotation[] }>({});
  
  // Rubric state
  const [selectedRubricId, setSelectedRubricId] = useState<string>('');
  const [rubricEvaluations, setRubricEvaluations] = useState<Record<string, { levelId: string, marks: number }>>({});
  
  // Form state
  const [grades, setGrades] = useState<AnswerType[]>([]);
  const [overallFeedback, setOverallFeedback] = useState('');

  // Fetch submission data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const submissionResponse = await axios.get(`/api/v1/homework-submissions/${submissionId}`);
        // const homeworkResponse = await axios.get(`/api/v1/homework/${homeworkId}`);
        // setSubmission(submissionResponse.data.data.submission);
        // setHomework(homeworkResponse.data.data.homework);
        
        // Using mock data for now
        setHomework(MOCK_HOMEWORK);
        setSubmission(MOCK_SUBMISSION);
        
        // Initialize grades from the submission
        if (MOCK_SUBMISSION.answers) {
          const initialGrades = MOCK_SUBMISSION.answers.map(answer => ({
            ...answer,
            marks: 0,
            feedback: '',
            isCorrect: false,
            annotations: []
          }));
          setGrades(initialGrades);
          
          // Initialize annotations
          const initialAnnotations: { [questionId: string]: Annotation[] } = {};
          MOCK_SUBMISSION.answers.forEach(answer => {
            if (answer.answerText) {
              initialAnnotations[answer.questionId] = [];
            }
          });
          setAnnotations(initialAnnotations);
        }
        
        // Initialize rubric evaluations if available
        if (MOCK_SUBMISSION.rubricEvaluations) {
          setRubricEvaluations(MOCK_SUBMISSION.rubricEvaluations);
        }
        
        if (MOCK_HOMEWORK.rubrics && MOCK_HOMEWORK.rubrics.length > 0) {
          setSelectedRubricId(MOCK_HOMEWORK.rubrics[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch data.');
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

  // Auto-grade objective questions
  useEffect(() => {
    if (homework && submission) {
      const updatedGrades = [...grades];
      
      submission.answers.forEach((answer, index) => {
        const question = homework.questions.find(q => q._id === answer.questionId);
        
        if (question && question.questionType === 'objective') {
          // Find correct options
          const correctOptions = question.options
            .filter(opt => opt.isCorrect)
            .map(opt => opt._id);
          
          // Check if answer is correct (arrays match exactly)
          const isCorrect = 
            correctOptions.length === answer.selectedOptions.length &&
            correctOptions.every(id => answer.selectedOptions.includes(id));
          
          // Set grade
          updatedGrades[index] = {
            ...updatedGrades[index],
            marks: isCorrect ? question.marks : 0,
            isCorrect,
            feedback: isCorrect ? 'Correct answer.' : 'Incorrect answer.'
          };
        }
      });
      
      setGrades(updatedGrades);
    }
  }, [homework, submission]);

  // Get AI assessment for subjective questions
  const getAIAssessment = async (questionId: string) => {
    setAiAssessmentLoading(true);
    setCurrentSubjectiveQuestionId(questionId);
    
    try {
      // In real implementation:
      // const response = await axios.post(`/api/v1/homework-submissions/${submissionId}/ai-assessment`, {
      //   questionId
      // });
      // setAiAssessment(response.data.data.assessment);
      
      // Using mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiAssessment({
        similarityScore: 72,
        suggestedMarks: 4,
        feedback: "Good explanation of F=ma and the example is relevant. Could improve by explicitly mentioning the proportional relationship between force and acceleration, and the inverse relationship with mass.",
        keyConceptsMissing: ["inverse proportionality", "directionality"],
        keyConceptsIdentified: ["force", "mass", "acceleration", "equation", "example", "proportional"]
      });
    } catch (err) {
      console.error('Failed to get AI assessment:', err);
      setError('Failed to get AI assessment. Please grade manually.');
    } finally {
      setAiAssessmentLoading(false);
    }
  };

  // Handle marks change
  const handleMarksChange = (questionId: string, marks: number) => {
    setGrades(prev => 
      prev.map(grade => 
        grade.questionId === questionId
          ? { ...grade, marks }
          : grade
      )
    );
  };

  // Handle feedback change
  const handleFeedbackChange = (questionId: string, feedback: string) => {
    setGrades(prev => 
      prev.map(grade => 
        grade.questionId === questionId
          ? { ...grade, feedback }
          : grade
      )
    );
  };

  // Handle correctness change
  const handleCorrectnessChange = (questionId: string, isCorrect: boolean) => {
    setGrades(prev => 
      prev.map(grade => 
        grade.questionId === questionId
          ? { ...grade, isCorrect }
          : grade
      )
    );
  };

  // Handle annotation changes
  const handleAnnotationsChange = (questionId: string, newAnnotations: Annotation[]) => {
    setAnnotations(prev => ({
      ...prev,
      [questionId]: newAnnotations
    }));
    
    // Update grades with annotations
    setGrades(prev => 
      prev.map(grade => 
        grade.questionId === questionId
          ? { ...grade, annotations: newAnnotations }
          : grade
      )
    );
  };

  // Handle rubric selection
  const handleRubricSelect = (rubricId: string) => {
    setSelectedRubricId(rubricId);
  };

  // Handle rubric evaluations
  const handleRubricEvaluation = (evaluations: Record<string, { levelId: string, marks: number }>) => {
    setRubricEvaluations(evaluations);
    
    // Calculate total marks based on rubric
    if (homework && homework.rubrics) {
      const selectedRubric = homework.rubrics.find(r => r.id === selectedRubricId);
      if (selectedRubric) {
        let totalMarks = 0;
        Object.values(evaluations).forEach(evaluation => {
          totalMarks += evaluation.marks;
        });
        
        // Find the subjective question to apply marks to
        const subjectiveQuestion = homework.questions.find(q => q.questionType === 'subjective');
        if (subjectiveQuestion) {
          handleMarksChange(subjectiveQuestion._id, Math.min(totalMarks, subjectiveQuestion.marks));
        }
      }
    }
  };

  // Apply AI assessment
  const applyAIAssessment = (questionId: string) => {
    if (!aiAssessment || currentSubjectiveQuestionId !== questionId) return;
    
    const question = homework?.questions.find(q => q._id === questionId);
    if (!question) return;
    
    // Calculate marks based on max marks and suggested marks
    const maxMarks = question.marks;
    const suggestedMarks = Math.min(aiAssessment.suggestedMarks, maxMarks);
    
    handleMarksChange(questionId, suggestedMarks);
    handleFeedbackChange(questionId, aiAssessment.feedback);
    handleCorrectnessChange(questionId, suggestedMarks >= (maxMarks * 0.7));
  };

  // Submit grades
  const handleSubmit = async () => {
    // Validate all questions are graded
    const ungradedQuestions = grades.filter(grade => grade.marks === undefined);
    if (ungradedQuestions.length > 0) {
      setError('Please grade all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      // Calculate total obtained marks
      const totalObtainedMarks = grades.reduce((sum, grade) => sum + (grade.marks || 0), 0);
      
      // Prepare data with annotations
      const submissionData = {
        answers: grades.map(grade => ({
          ...grade,
          annotations: annotations[grade.questionId] || []
        })),
        feedback: overallFeedback,
        rubricEvaluations: selectedRubricId ? rubricEvaluations : undefined
      };
      
      // In real implementation:
      // await axios.put(`/api/v1/homework-submissions/${submissionId}/grade`, submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and redirect after delay
      setSuccess(true);
      setTimeout(() => {
        router.push(`/teacher/homework/${homeworkId}`);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit grades:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to submit grades.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  // Calculate total marks
  const calculateTotalMarks = () => {
    return grades.reduce((sum, grade) => sum + (grade.marks || 0), 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grade Homework Submission</h1>
        <Link 
          href={`/teacher/homework/${homeworkId}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Submissions
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
            Grades submitted successfully! Redirecting...
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : homework && submission ? (
        <>
          {/* Submission Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
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
                
                {/* Homework Attachments */}
                {homework.attachments && homework.attachments.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Homework Materials:</h3>
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
                
                {/* Version info if available */}
                {homework.version && (
                  <div className="mt-2 text-xs text-gray-500">
                    Version: {homework.version}
                    {homework.previousVersions && homework.previousVersions.length > 0 && (
                      <span> ({homework.previousVersions.length} previous versions)</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-indigo-800 font-medium mb-2">Student Information</h3>
                <p className="text-indigo-700 mb-1">{submission.studentId.fullName}</p>
                <p className="text-indigo-600 text-sm mb-1">{submission.studentId.email}</p>
                <p className="text-indigo-600 text-sm">
                  Submitted: {formatDate(submission.submittedAt)}
                  {submission.status === 'late' && ' (Late)'}
                </p>
                
                {submission.timeSpent && (
                  <div className="flex items-center text-sm text-indigo-600 mt-2">
                    <FiClock className="mr-1" />
                    <span>Time spent: {submission.timeSpent} minutes</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-md">
              <div className="text-gray-700">
                <span className="font-medium">Total Marks: </span>
                <span className="text-lg">{calculateTotalMarks()} / {submission.totalMarks}</span>
              </div>
              
              <div className="text-sm text-gray-500">
                {grades.filter(g => g.marks !== undefined).length} of {grades.length} questions graded
              </div>
            </div>
          </div>
          
          {/* Questions and Grading */}
          <div className="space-y-8 mb-8">
            {homework.questions.map((question, index) => {
              const answer = submission.answers.find(a => a.questionId === question._id);
              const grade = grades.find(g => g.questionId === question._id);
              
              if (!answer || !grade) return null;
              
              return (
                <div key={question._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">
                        Question {index + 1} <span className="text-gray-500">({question.marks} {question.marks === 1 ? 'mark' : 'marks'})</span>
                      </h3>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Type:</span>
                        <span className="text-sm font-medium capitalize">{question.questionType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
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
                    
                    {/* Student's Answer */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Student's Answer:</h4>
                      
                      {question.questionType === 'objective' ? (
                        <div className="space-y-2">
                          {question.options.map(option => {
                            const isSelected = answer.selectedOptions.includes(option._id);
                            const isCorrectOption = option.isCorrect;
                            
                            return (
                              <div 
                                key={option._id}
                                className={`p-3 border rounded-md ${
                                  isSelected 
                                    ? 'bg-indigo-50 border-indigo-300' 
                                    : 'bg-white border-gray-200'
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
                                      isCorrectOption 
                                        ? 'text-green-700 font-medium' 
                                        : 'text-gray-700'
                                    }`}>
                                      {option.text}
                                      {isCorrectOption && ' (Correct)'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Text Annotator for subjective answers */}
                          <TextAnnotator
                            content={answer.answerText || 'No answer provided'}
                            annotations={annotations[question._id] || []}
                            onAnnotationsChange={(newAnnotations) => handleAnnotationsChange(question._id, newAnnotations)}
                            readOnly={false}
                          />
                          
                          {/* Answer Attachments */}
                          {answer.attachments && answer.attachments.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700 mb-1">Student Attachments:</p>
                              <FileUpload
                                attachments={answer.attachments}
                                onChange={() => {}} // Read-only
                                disabled={true}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Grading Section */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Grading:</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Marks (out of {question.marks})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={question.marks}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={grade.marks || 0}
                              onChange={(e) => handleMarksChange(question._id, Math.min(parseInt(e.target.value) || 0, question.marks))}
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback for Student
                            </label>
                            <RichTextEditor
                              value={grade.feedback || ''}
                              onChange={(value) => handleFeedbackChange(question._id, value)}
                              placeholder="Provide feedback on this answer..."
                              height="min-h-[150px]"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`correct-${question._id}`}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={grade.isCorrect || false}
                              onChange={(e) => handleCorrectnessChange(question._id, e.target.checked)}
                            />
                            <label htmlFor={`correct-${question._id}`} className="ml-2 text-sm text-gray-700">
                              Mark as correct
                            </label>
                          </div>
                        </div>
                        
                        {/* AI Assessment Section (for subjective questions) */}
                        {question.questionType === 'subjective' && (
                          <div className="bg-indigo-50 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="text-sm font-medium text-indigo-800">AI Assessment Tool</h5>
                              <button
                                type="button"
                                className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2 py-1 rounded-md flex items-center"
                                title="Get AI assistance for grading this answer"
                              >
                                <FiHelpCircle className="mr-1" />
                                How it works
                              </button>
                            </div>
                            
                            {aiAssessmentLoading && currentSubjectiveQuestionId === question._id ? (
                              <div className="flex justify-center my-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                              </div>
                            ) : aiAssessment && currentSubjectiveQuestionId === question._id ? (
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-indigo-700 mb-1">Similarity Score</p>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        aiAssessment.similarityScore >= 70 ? 'bg-green-600' :
                                        aiAssessment.similarityScore >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                                      }`}
                                      style={{ width: `${aiAssessment.similarityScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-indigo-700">Suggested marks:</span>
                                  <span className="font-medium">{aiAssessment.suggestedMarks} / {question.marks}</span>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-indigo-700 mb-1">Suggested feedback:</p>
                                  <p className="text-sm text-indigo-900">{aiAssessment.feedback}</p>
                                </div>
                                
                                <div className="pt-2">
                                  <button
                                    type="button"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md text-sm"
                                    onClick={() => applyAIAssessment(question._id)}
                                  >
                                    Apply AI Assessment
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <p className="text-sm text-indigo-700 mb-3">
                                  Let AI help you assess this subjective answer
                                </p>
                                <button
                                  type="button"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md text-sm"
                                  onClick={() => getAIAssessment(question._id)}
                                  disabled={!answer.answerText}
                                >
                                  Get AI Assessment
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Rubrics Evaluation Section */}
          {homework.questions.some(q => q.questionType === 'subjective') && homework.rubrics && homework.rubrics.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <FiClipboard className="text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold">Assessment Rubrics</h2>
              </div>
              
              <RubricEvaluator
                rubrics={homework.rubrics}
                selectedRubricId={selectedRubricId}
                onRubricSelect={handleRubricSelect}
                onRubricEvaluation={handleRubricEvaluation}
                initialEvaluations={rubricEvaluations}
              />
            </div>
          )}
          
          {/* Overall Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <FiMessageSquare className="text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Overall Feedback</h2>
            </div>
            
            <RichTextEditor
              value={overallFeedback}
              onChange={setOverallFeedback}
              placeholder="Provide overall feedback for the student..."
              height="min-h-[150px]"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Link
              href={`/teacher/homework/${homeworkId}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </Link>
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
                  Submit Grades
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Submission not found or no longer available.</p>
        </div>
      )}
    </div>
  );
};

export default HomeworkGradingPage; 