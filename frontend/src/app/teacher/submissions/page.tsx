'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiFileText, FiUser, FiCalendar, FiClock, FiCheckCircle, FiX,
  FiEye, FiEdit, FiDownload, FiSearch, FiFilter, FiMoreVertical,
  FiStar, FiMessageSquare, FiUpload, FiSave, FiAlertCircle,
  FiTarget, FiBarChart, FiBook, FiUsers, FiFlag, FiRefreshCw
} from 'react-icons/fi';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  studentAvatar?: string;
  assignmentTitle: string;
  assignmentId: string;
  subject: string;
  class: string;
  submittedAt: Date;
  dueDate: Date;
  status: 'pending' | 'graded' | 'late' | 'resubmitted';
  score?: number;
  totalMarks: number;
  feedback?: string;
  attachments: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  gradedAt?: Date;
  gradedBy?: string;
  isLate: boolean;
  attempts: number;
}

const TeacherSubmissionsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [gradingMode, setGradingMode] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  // Grading form state
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: '',
    rubricGrades: {}
  });

  useEffect(() => {
    // Mock submissions data
    const mockSubmissions: Submission[] = [
      {
        id: '1',
        studentName: 'John Doe',
        studentId: 'STU001',
        assignmentTitle: 'Quadratic Equations Practice',
        assignmentId: 'HW001',
        subject: 'Mathematics',
        class: '10th Grade A',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending',
        totalMarks: 50,
        attachments: [
          {
            name: 'john_homework.pdf',
            type: 'PDF',
            size: '2.3 MB',
            url: '/uploads/john_homework.pdf'
          }
        ],
        isLate: false,
        attempts: 1
      },
      {
        id: '2',
        studentName: 'Alice Smith',
        studentId: 'STU002',
        assignmentTitle: 'Essay on Photosynthesis',
        assignmentId: 'HW002',
        subject: 'Biology',
        class: '9th Grade B',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'graded',
        score: 42,
        totalMarks: 50,
        feedback: 'Excellent work! Your explanation of the light-dependent reactions was particularly well done. Consider adding more detail about the Calvin cycle.',
        attachments: [
          {
            name: 'photosynthesis_essay.docx',
            type: 'DOCX',
            size: '1.8 MB',
            url: '/uploads/photosynthesis_essay.docx'
          }
        ],
        gradedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        gradedBy: user?.name,
        isLate: true,
        attempts: 1
      },
      {
        id: '3',
        studentName: 'Bob Johnson',
        studentId: 'STU003',
        assignmentTitle: 'Python Programming Project',
        assignmentId: 'HW003',
        subject: 'Computer Science',
        class: '11th Grade A',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        totalMarks: 100,
        attachments: [
          {
            name: 'calculator.py',
            type: 'PY',
            size: '5.2 KB',
            url: '/uploads/calculator.py'
          },
          {
            name: 'readme.txt',
            type: 'TXT',
            size: '1.1 KB',
            url: '/uploads/readme.txt'
          }
        ],
        isLate: false,
        attempts: 2
      },
      {
        id: '4',
        studentName: 'Emma Wilson',
        studentId: 'STU004',
        assignmentTitle: 'History Timeline Project',
        assignmentId: 'HW004',
        subject: 'History',
        class: '10th Grade B',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'late',
        totalMarks: 75,
        attachments: [
          {
            name: 'timeline_project.pptx',
            type: 'PPTX',
            size: '12.5 MB',
            url: '/uploads/timeline_project.pptx'
          }
        ],
        isLate: true,
        attempts: 1
      }
    ];

    setSubmissions(mockSubmissions);
  }, [user]);

  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || '',
      rubricGrades: {}
    });
    setViewMode('detail');
  };

  const handleGradeSubmit = () => {
    if (selectedSubmission) {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === selectedSubmission.id 
          ? {
              ...sub,
              score: parseInt(gradeData.score),
              feedback: gradeData.feedback,
              status: 'graded' as const,
              gradedAt: new Date(),
              gradedBy: user?.name
            }
          : sub
      );
      setSubmissions(updatedSubmissions);
      setGradingMode(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'late': return 'text-red-600 bg-red-100';
      case 'resubmitted': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx':
      case 'doc': return '📝';
      case 'pptx':
      case 'ppt': return '📊';
      case 'py': return '🐍';
      case 'txt': return '📃';
      default: return '📁';
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || sub.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const subjects = Array.from(new Set(submissions.map(sub => sub.subject)));
  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
  const gradedCount = submissions.filter(sub => sub.status === 'graded').length;
  const lateCount = submissions.filter(sub => sub.isLate).length;

  if (viewMode === 'detail' && selectedSubmission) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('list')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Submissions
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedSubmission.assignmentTitle}</h1>
            <p className="text-gray-600">{selectedSubmission.studentName} • {selectedSubmission.subject}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedSubmission.status === 'pending' && (
              <button 
                onClick={() => setGradingMode(!gradingMode)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiEdit className="h-4 w-4" />
                {gradingMode ? 'Cancel Grading' : 'Start Grading'}
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiDownload className="h-4 w-4" />
              Download All
            </button>
          </div>
        </div>

        {/* Submission Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiUser size={20} className="text-blue-600" />}
              title="Student"
              value={selectedSubmission.studentName}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiCalendar size={20} className="text-green-600" />}
              title="Submitted"
              value={selectedSubmission.submittedAt.toLocaleDateString()}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiTarget size={20} className="text-purple-600" />}
              title="Score"
              value={selectedSubmission.score ? `${selectedSubmission.score}/${selectedSubmission.totalMarks}` : 'Not graded'}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiFlag size={20} className={selectedSubmission.isLate ? "text-red-600" : "text-green-600"} />}
              title="Status"
              value={selectedSubmission.isLate ? 'Late' : 'On Time'}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Attachments */}
            <Card title="Submitted Files" className="p-6">
              <div className="space-y-3">
                {selectedSubmission.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                      <div>
                        <h4 className="font-medium">{attachment.name}</h4>
                        <p className="text-sm text-gray-600">{attachment.type} • {attachment.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <FiDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Grading Section */}
            {gradingMode && (
              <Card title="Grade Submission" className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score (out of {selectedSubmission.totalMarks})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedSubmission.totalMarks}
                      value={gradeData.score}
                      onChange={(e) => setGradeData({...gradeData, score: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter score"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Provide detailed feedback for the student..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleGradeSubmit}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiSave className="h-4 w-4" />
                      Save Grade
                    </button>
                    <button 
                      onClick={() => setGradingMode(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiX className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Previous Feedback */}
            {selectedSubmission.feedback && !gradingMode && (
              <Card title="Feedback" className="p-6">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Teacher Feedback</span>
                      {selectedSubmission.gradedAt && (
                        <span className="text-xs text-green-600">
                          {selectedSubmission.gradedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-green-700">{selectedSubmission.feedback}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Submission Details" className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedSubmission.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span>{selectedSubmission.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span>{selectedSubmission.class}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assignment Details</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span>{selectedSubmission.dueDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span>{selectedSubmission.submittedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attempts:</span>
                      <span>{selectedSubmission.attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSubmission.isLate && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Late Submission</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Submitted {Math.ceil((selectedSubmission.submittedAt.getTime() - selectedSubmission.dueDate.getTime()) / (1000 * 60 * 60 * 24))} day(s) late
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiMessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Send Message</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiRefreshCw className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Request Resubmission</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiDownload className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Download Submission</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiFlag className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Flag for Review</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Submissions</h1>
          <p className="text-gray-600 mt-1">Review and grade student work</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiFileText size={20} className="text-blue-600" />}
            title="Total Submissions"
            value={submissions.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiClock size={20} className="text-orange-600" />}
            title="Pending Review"
            value={pendingCount}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiCheckCircle size={20} className="text-green-600" />}
            title="Graded"
            value={gradedCount}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiAlertCircle size={20} className="text-red-600" />}
            title="Late Submissions"
            value={lateCount}
          />
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="graded">Graded</option>
          <option value="late">Late</option>
          <option value="resubmitted">Resubmitted</option>
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div 
            key={submission.id} 
            className="cursor-pointer" 
            onClick={() => handleSubmissionSelect(submission)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {submission.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{submission.assignmentTitle}</h3>
                      <p className="text-gray-600">{submission.studentName} • {submission.studentId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                    {submission.isLate && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                        Late
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiBook className="h-4 w-4" />
                      {submission.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      {submission.class}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      Submitted: {submission.submittedAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFileText className="h-4 w-4" />
                      {submission.attachments.length} file{submission.attachments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {submission.score ? `${submission.score}/${submission.totalMarks}` : '—'}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {submission.score ? Math.round((submission.score / submission.totalMarks) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">Grade</div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-500">No submissions match your current filters</p>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissionsPage; 