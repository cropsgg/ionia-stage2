import React, { useState, useEffect } from 'react';
import { FiArrowDown, FiArrowUp, FiCheck, FiX } from 'react-icons/fi';

type Student = {
  id: string;
  name: string;
  email: string;
  submissionId: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  submittedAt: string;
};

type Question = {
  id: string;
  questionText: string;
  questionType: 'objective' | 'subjective';
  marks: number;
};

type BatchGradeData = {
  [studentId: string]: {
    [questionId: string]: {
      marks: number;
      feedback?: string;
      isCorrect?: boolean;
    };
  };
};

type BatchGraderProps = {
  homeworkId: string;
  homeworkTitle: string;
  students: Student[];
  questions: Question[];
  onGradeSubmit: (gradeData: BatchGradeData) => Promise<void>;
  onStudentSelect: (studentId: string, submissionId: string) => void;
};

const BatchGrader: React.FC<BatchGraderProps> = ({
  homeworkId,
  homeworkTitle,
  students,
  questions,
  onGradeSubmit,
  onStudentSelect,
}) => {
  const [gradeData, setGradeData] = useState<BatchGradeData>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'submittedAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [submitting, setSubmitting] = useState(false);

  // Initialize grade data
  useEffect(() => {
    const initialData: BatchGradeData = {};
    
    students.forEach(student => {
      initialData[student.id] = {};
      questions.forEach(question => {
        initialData[student.id][question.id] = {
          marks: 0,
          feedback: '',
          isCorrect: false,
        };
      });
    });
    
    setGradeData(initialData);
  }, [students, questions]);

  const handleSort = (field: 'name' | 'status' | 'submittedAt') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else {
      // Sort by submission date
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const handleGradeChange = (studentId: string, questionId: string, value: number) => {
    const maxMarks = questions.find(q => q.id === questionId)?.marks || 0;
    const clampedValue = Math.min(Math.max(0, value), maxMarks);
    
    setGradeData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [questionId]: {
          ...prev[studentId][questionId],
          marks: clampedValue,
          isCorrect: clampedValue > (maxMarks * 0.5), // Auto-set correctness based on score
        },
      },
    }));
  };

  const handleFeedbackChange = (studentId: string, questionId: string, feedback: string) => {
    setGradeData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [questionId]: {
          ...prev[studentId][questionId],
          feedback,
        },
      },
    }));
  };

  const handleCorrectnessChange = (studentId: string, questionId: string, isCorrect: boolean) => {
    setGradeData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [questionId]: {
          ...prev[studentId][questionId],
          isCorrect,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onGradeSubmit(gradeData);
      // Success handling could go here
    } catch (error) {
      console.error('Failed to submit batch grades:', error);
      // Error handling could go here
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalMarks = (studentId: string) => {
    let total = 0;
    const studentGrades = gradeData[studentId];
    
    if (studentGrades) {
      Object.values(studentGrades).forEach(grade => {
        total += grade.marks || 0;
      });
    }
    
    return total;
  };

  const getMaxTotalMarks = () => {
    let total = 0;
    questions.forEach(question => {
      total += question.marks;
    });
    return total;
  };

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Batch Grading: {homeworkTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">Grade all student submissions at once</p>
      </div>
      
      {/* Question Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 flex space-x-4 overflow-x-auto">
        <button
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
            selectedQuestion === null
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          onClick={() => setSelectedQuestion(null)}
        >
          All Questions
        </button>
        
        {questions.map(question => (
          <button
            key={question.id}
            className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              selectedQuestion === question.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedQuestion(question.id)}
          >
            Q{questions.findIndex(q => q.id === question.id) + 1}
            {question.questionType === 'objective' && ' (Obj)'}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center"
                  onClick={() => handleSort('name')}
                >
                  Student
                  {sortBy === 'name' && (
                    sortDirection === 'asc' ? <FiArrowDown className="ml-1" /> : <FiArrowUp className="ml-1" />
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortBy === 'status' && (
                    sortDirection === 'asc' ? <FiArrowDown className="ml-1" /> : <FiArrowUp className="ml-1" />
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center"
                  onClick={() => handleSort('submittedAt')}
                >
                  Submitted
                  {sortBy === 'submittedAt' && (
                    sortDirection === 'asc' ? <FiArrowDown className="ml-1" /> : <FiArrowUp className="ml-1" />
                  )}
                </button>
              </th>
              
              {(selectedQuestion === null ? questions : questions.filter(q => q.id === selectedQuestion)).map(question => (
                <th 
                  key={question.id} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {`Question ${questions.findIndex(q => q.id === question.id) + 1} (${question.marks} pts)`}
                </th>
              ))}
              
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(student.status)}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(student.submittedAt)}
                </td>
                
                {(selectedQuestion === null ? questions : questions.filter(q => q.id === selectedQuestion)).map(question => (
                  <td key={`${student.id}-${question.id}`} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max={question.marks}
                          value={gradeData[student.id]?.[question.id]?.marks || 0}
                          onChange={(e) => handleGradeChange(student.id, question.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <span className="text-sm text-gray-500 ml-1">/ {question.marks}</span>
                      </div>
                      
                      {question.questionType === 'objective' && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`correct-${student.id}-${question.id}`}
                            checked={gradeData[student.id]?.[question.id]?.isCorrect || false}
                            onChange={(e) => handleCorrectnessChange(student.id, question.id, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`correct-${student.id}-${question.id}`} className="ml-2 text-xs text-gray-700">
                            Correct
                          </label>
                        </div>
                      )}
                      
                      {selectedQuestion && (
                        <div>
                          <input
                            type="text"
                            placeholder="Feedback..."
                            value={gradeData[student.id]?.[question.id]?.feedback || ''}
                            onChange={(e) => handleFeedbackChange(student.id, question.id, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                ))}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className="font-medium">{getTotalMarks(student.id)}</span>
                  <span className="text-gray-500"> / {getMaxTotalMarks()}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => onStudentSelect(student.id, student.submissionId)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <FiCheck className="mr-2" />
              Submit All Grades
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchGrader; 