'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiPlus, FiX } from 'react-icons/fi';

// Define types
type ClassType = {
  _id: string;
  name: string;
};

type SubjectType = {
  _id: string;
  name: string;
  subjectCode?: string;
};

type OptionType = {
  text: string;
  isCorrect: boolean;
};

type QuestionType = {
  questionText: string;
  questionType: 'objective' | 'subjective';
  options: OptionType[];
  marks: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | null;
};

type FormDataType = {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  dueDate: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  personalizationEnabled: boolean;
  adaptiveDifficulty: boolean;
  learningStylePreference: boolean;
  questions: QuestionType[];
};

// Mock data for initial development
const MOCK_CLASSES: ClassType[] = [
  { _id: '1', name: 'Grade 10A' },
  { _id: '2', name: 'Grade 9B' },
];

const MOCK_SUBJECTS: SubjectType[] = [
  { _id: '201', name: 'Mathematics', subjectCode: 'MATH' },
  { _id: '202', name: 'Physics', subjectCode: 'PHYS' },
];

const CreateHomeworkPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState<ClassType[]>(MOCK_CLASSES);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    dueDate: '',
    difficultyLevel: 'medium',
    personalizationEnabled: false,
    adaptiveDifficulty: false,
    learningStylePreference: false,
    questions: [
      {
        questionText: '',
        questionType: 'objective',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
        marks: 1,
        difficultyLevel: 'medium',
        learningStyle: null,
      },
    ],
  });

  // Fetch classes and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In real implementation:
        // const classesResponse = await axios.get('/api/v1/classes');
        // setClasses(classesResponse.data.data.classes);
        
        // Using mock data for now
        setClasses(MOCK_CLASSES);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        // Don't show error for classes loading, just keep mocks
      }
    };

    fetchData();
  }, []);

  // When class selection changes, fetch subjects for that class
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.classId) {
        setSubjects([]);
        return;
      }

      try {
        // In real implementation:
        // const response = await axios.get(`/api/v1/classes/${formData.classId}`);
        // const classSubjects = response.data.data.class.subjects;
        // setSubjects(classSubjects);
        
        // Using mock data for now
        setSubjects(MOCK_SUBJECTS);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        // Don't show error for subjects loading, just keep mocks
      }
    };

    fetchSubjects();
  }, [formData.classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      
      if (field === 'isCorrect' && value === true) {
        // For objective questions, if it's not explicitly multiple choice,
        // treat it as single-select (radio button behavior)
        const isSingleSelect = true; // Always single select for now (could add multiple choice option later)
        
        if (isSingleSelect) {
          updatedOptions.forEach((opt, idx) => {
            updatedOptions[idx] = { ...opt, isCorrect: idx === optionIndex };
          });
        } else {
          updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], isCorrect: value };
        }
      } else {
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
      }
      
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          questionType: 'objective',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
          marks: 1,
          difficultyLevel: 'medium',
          learningStyle: null,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length === 1) {
      return; // Don't remove the last question
    }
    
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const addOption = (questionIndex: number) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [
          ...updatedQuestions[questionIndex].options,
          { text: '', isCorrect: false },
        ],
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (formData.questions[questionIndex].options.length <= 2) {
      return; // Keep at least 2 options
    }
    
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex),
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.title || !formData.classId || !formData.subjectId || !formData.dueDate) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate questions
      for (const question of formData.questions) {
        if (!question.questionText) {
          throw new Error('All questions must have text');
        }
        
        if (question.questionType === 'objective') {
          // Check that at least one option is marked as correct
          const hasCorrectOption = question.options.some(opt => opt.isCorrect);
          if (!hasCorrectOption) {
            throw new Error('Each objective question must have at least one correct answer');
          }
          
          // Check that all options have text
          const emptyOption = question.options.find(opt => !opt.text);
          if (emptyOption) {
            throw new Error('All options must have text');
          }
        }
      }
      
      // In real implementation:
      // const response = await axios.post('/api/v1/homework', formData);
      
      // Simulate success for now
      console.log('Homework would be created with data:', formData);
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/teacher/homework');
      }, 500);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to create homework.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Homework</h1>
        <Link 
          href="/teacher/homework"
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
      
      {/* Homework Creation Form */}
      <div className="bg-white rounded-md shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Homework Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Physics Homework - Forces and Motion"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Provide details about this homework"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="classId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subjectId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                  disabled={!formData.classId || subjects.length === 0}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} {subject.subjectCode ? `(${subject.subjectCode})` : ''}
                    </option>
                  ))}
                </select>
                {formData.classId && subjects.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    No subjects available for this class
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Difficulty Level
                </label>
                <select
                  name="difficultyLevel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 rounded-md">
                <h3 className="font-medium text-indigo-800 mb-3">Personalization Options</h3>
                
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="personalizationEnabled"
                    name="personalizationEnabled"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.personalizationEnabled}
                    onChange={handleChange}
                  />
                  <label htmlFor="personalizationEnabled" className="ml-2 text-sm text-gray-700">
                    Enable personalization
                  </label>
                </div>
                
                {formData.personalizationEnabled && (
                  <>
                    <div className="flex items-center mb-3 ml-6">
                      <input
                        type="checkbox"
                        id="adaptiveDifficulty"
                        name="adaptiveDifficulty"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={formData.adaptiveDifficulty}
                        onChange={handleChange}
                      />
                      <label htmlFor="adaptiveDifficulty" className="ml-2 text-sm text-gray-700">
                        Adapt difficulty based on student performance
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-3 ml-6">
                      <input
                        type="checkbox"
                        id="learningStylePreference"
                        name="learningStylePreference"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={formData.learningStylePreference}
                        onChange={handleChange}
                      />
                      <label htmlFor="learningStylePreference" className="ml-2 text-sm text-gray-700">
                        Adapt to learning style preferences
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Questions Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Questions</h2>
            
            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-8 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Question {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800"
                    disabled={formData.questions.length === 1}
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={2}
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={question.questionType}
                      onChange={(e) => handleQuestionChange(questionIndex, 'questionType', e.target.value)}
                    >
                      <option value="objective">Multiple Choice</option>
                      <option value="subjective">Subjective/Essay</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={question.marks}
                      onChange={(e) => handleQuestionChange(questionIndex, 'marks', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={question.difficultyLevel}
                      onChange={(e) => handleQuestionChange(questionIndex, 'difficultyLevel', e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                
                {formData.personalizationEnabled && formData.learningStylePreference && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Style (Optional)
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={question.learningStyle || ''}
                      onChange={(e) => handleQuestionChange(questionIndex, 'learningStyle', e.target.value || null)}
                    >
                      <option value="">Not Specified</option>
                      <option value="visual">Visual</option>
                      <option value="auditory">Auditory</option>
                      <option value="reading">Reading/Writing</option>
                      <option value="kinesthetic">Kinesthetic</option>
                    </select>
                  </div>
                )}
                
                {question.questionType === 'objective' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options <span className="text-red-500">*</span>
                    </label>
                    
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                        />
                        <input
                          type="text"
                          className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          className="ml-2 text-red-600 hover:text-red-800"
                          disabled={question.options.length <= 2}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addQuestion}
              className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
            >
              <FiPlus className="mr-2" /> Add Question
            </button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-end">
              <Link
                href="/teacher/homework"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Create Homework
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHomeworkPage; 