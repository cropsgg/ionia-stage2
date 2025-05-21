import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

type StudentProgress = {
  studentId: string;
  studentName: string;
  averageScore: number;
  completionRate: number;
  trend: 'improving' | 'stable' | 'declining';
  needsAttention: boolean;
};

type StudentAttentionNeedsProps = {
  students: StudentProgress[];
  title?: string;
  onStudentClick?: (studentId: string) => void;
};

const StudentAttentionNeeds: React.FC<StudentAttentionNeedsProps> = ({
  students,
  title = 'Students Needing Attention',
  onStudentClick
}) => {
  // Filter students who need attention
  const attentionNeededStudents = students.filter(student => student.needsAttention);
  const otherStudents = students.filter(student => !student.needsAttention);
  
  // Sort students who need attention by average score (lowest first)
  attentionNeededStudents.sort((a, b) => a.averageScore - b.averageScore);
  
  // Get trend icon
  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <FiArrowUp className="text-green-500" />;
      case 'declining':
        return <FiArrowDown className="text-red-500" />;
      case 'stable':
      default:
        return <FiMinus className="text-gray-500" />;
    }
  };
  
  // Get reason for attention
  const getAttentionReason = (student: StudentProgress) => {
    if (student.averageScore < 60) return 'Low score';
    if (student.completionRate < 75) return 'Low completion';
    if (student.trend === 'declining') return 'Declining performance';
    return 'Multiple factors';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <FiAlertTriangle className="text-amber-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
        <span className="text-amber-500 bg-amber-50 text-sm font-medium px-2 py-1 rounded-full">
          {attentionNeededStudents.length} students
        </span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {attentionNeededStudents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No students currently need attention.</p>
          </div>
        ) : (
          attentionNeededStudents.map(student => (
            <div 
              key={student.studentId}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onStudentClick && onStudentClick(student.studentId)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{student.studentName}</h4>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                      Score: <span className={student.averageScore < 60 ? 'text-red-500 font-medium' : 'text-gray-700'}>
                        {student.averageScore}%
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Completion: <span className={student.completionRate < 75 ? 'text-red-500 font-medium' : 'text-gray-700'}>
                        {student.completionRate}%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-gray-500">
                    Trend: {getTrendIcon(student.trend)}
                  </div>
                  <div className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded">
                    {getAttentionReason(student)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {attentionNeededStudents.length > 0 && otherStudents.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Other Students</h4>
            <span className="text-green-600 text-xs">{otherStudents.length} students on track</span>
          </div>
        </div>
      )}
      
      {otherStudents.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {otherStudents.slice(0, 3).map(student => (
              <div 
                key={student.studentId}
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onStudentClick && onStudentClick(student.studentId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">{student.studentName}</h4>
                    <div className="flex space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Score: <span className="text-gray-700">{student.averageScore}%</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {getTrendIcon(student.trend)}
                  </div>
                </div>
              </div>
            ))}
            
            {otherStudents.length > 3 && (
              <div className="p-3 text-center">
                <button 
                  className="text-indigo-600 text-sm hover:text-indigo-800"
                  onClick={() => {}} // You could expand to show more students here
                >
                  Show {otherStudents.length - 3} more students
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttentionNeeds; 