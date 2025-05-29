'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiFileText, FiPlus, FiCalendar, FiClock, FiUsers, FiCheckCircle,
  FiAlertCircle, FiX, FiEye, FiEdit, FiDownload, FiSearch, FiFilter,
  FiMoreVertical, FiTarget, FiBarChart, FiBook, FiSend, FiUpload,
  FiTrash2, FiCopy, FiFlag
} from 'react-icons/fi';

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: Date;
  assignedDate: Date;
  totalMarks: number;
  instructions: string;
  attachments: string[];
  status: 'active' | 'completed' | 'overdue' | 'draft';
  submissions: {
    total: number;
    submitted: number;
    graded: number;
    avgScore: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: Date;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  score?: number;
  feedback?: string;
  attachments: string[];
}

const TeacherHomeworkPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Mock homework data
    const mockHomeworks: Homework[] = [
      {
        id: '1',
        title: 'Quadratic Equations Practice',
        description: 'Solve the given quadratic equations using different methods',
        subject: 'Mathematics',
        class: '10th Grade A',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        totalMarks: 50,
        instructions: 'Show all working steps clearly. Use both factoring and quadratic formula methods.',
        attachments: ['equations_worksheet.pdf'],
        status: 'active',
        submissions: {
          total: 32,
          submitted: 28,
          graded: 15,
          avgScore: 82
        },
        difficulty: 'medium',
        estimatedTime: 60
      },
      {
        id: '2',
        title: 'Essay on Photosynthesis',
        description: 'Write a detailed essay explaining the process of photosynthesis',
        subject: 'Biology',
        class: '9th Grade B',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        totalMarks: 30,
        instructions: 'Essay should be 500-800 words. Include diagrams if possible.',
        attachments: [],
        status: 'overdue',
        submissions: {
          total: 25,
          submitted: 22,
          graded: 22,
          avgScore: 75
        },
        difficulty: 'easy',
        estimatedTime: 90
      },
      {
        id: '3',
        title: 'Python Programming Project',
        description: 'Create a simple calculator program using Python',
        subject: 'Computer Science',
        class: '11th Grade A',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        totalMarks: 100,
        instructions: 'Program should include all basic arithmetic operations and error handling.',
        attachments: ['project_requirements.pdf', 'sample_code.py'],
        status: 'active',
        submissions: {
          total: 18,
          submitted: 8,
          graded: 0,
          avgScore: 0
        },
        difficulty: 'hard',
        estimatedTime: 180
      }
    ];

    const mockSubmissions: Submission[] = [
      {
        id: '1',
        studentName: 'John Doe',
        studentId: 'STU001',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'graded',
        score: 45,
        feedback: 'Good work! Minor calculation error in question 3.',
        attachments: ['john_homework.pdf']
      },
      {
        id: '2',
        studentName: 'Alice Smith',
        studentId: 'STU002',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'submitted',
        attachments: ['alice_homework.pdf']
      },
      {
        id: '3',
        studentName: 'Bob Johnson',
        studentId: 'STU003',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'late',
        score: 38,
        feedback: 'Late submission. Need to show more working steps.',
        attachments: ['bob_homework.pdf']
      }
    ];

    setHomeworks(mockHomeworks);
    setSubmissions(mockSubmissions);
  }, []);

  const handleHomeworkSelect = (homework: Homework) => {
    setSelectedHomework(homework);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'late': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredHomeworks = homeworks.filter(hw => {
    const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || hw.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || hw.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const subjects = Array.from(new Set(homeworks.map(hw => hw.subject)));

  if (viewMode === 'detail' && selectedHomework) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('list')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Homework
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedHomework.title}</h1>
            <p className="text-gray-600">{selectedHomework.subject} • {selectedHomework.class}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiDownload className="h-4 w-4" />
              Export Results
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit Assignment
            </button>
          </div>
        </div>

        {/* Assignment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-blue-600" />}
              title="Total Students"
              value={selectedHomework.submissions.total}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiCheckCircle size={20} className="text-green-600" />}
              title="Submitted"
              value={selectedHomework.submissions.submitted}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiTarget size={20} className="text-purple-600" />}
              title="Graded"
              value={selectedHomework.submissions.graded}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiBarChart size={20} className="text-orange-600" />}
              title="Average Score"
              value={selectedHomework.submissions.avgScore || 0}
              unit="%"
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Submissions */}
          <div className="xl:col-span-2">
            <Card title="Student Submissions" className="p-6">
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{submission.studentName}</h4>
                        <p className="text-sm text-gray-600">{submission.studentId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Submitted:</span>
                        <div className="font-medium">{submission.submittedAt.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <div className="font-medium">
                          {submission.score ? `${submission.score}/${selectedHomework.totalMarks}` : 'Not graded'}
                        </div>
                      </div>
                    </div>

                    {submission.feedback && (
                      <div className="mb-3">
                        <span className="text-gray-600 text-sm">Feedback:</span>
                        <p className="text-sm mt-1">{submission.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        <FiEye className="h-3 w-3" />
                        View
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                        <FiEdit className="h-3 w-3" />
                        Grade
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        <FiDownload className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Assignment Details */}
          <div className="space-y-6">
            <Card title="Assignment Details" className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedHomework.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                  <p className="text-sm text-gray-600">{selectedHomework.instructions}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Due Date:</span>
                    <div className="font-medium">{selectedHomework.dueDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Marks:</span>
                    <div className="font-medium">{selectedHomework.totalMarks}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedHomework.difficulty)}`}>
                      {selectedHomework.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Time:</span>
                    <div className="font-medium">{selectedHomework.estimatedTime} min</div>
                  </div>
                </div>

                {selectedHomework.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedHomework.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FiFileText className="h-4 w-4 text-gray-400" />
                          <span>{attachment}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiDownload className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSend className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Send Reminder</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiCopy className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Duplicate Assignment</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiCalendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Extend Deadline</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Delete Assignment</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Homework Management</h1>
          <p className="text-gray-600 mt-1">Create and manage homework assignments</p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="h-4 w-4" />
          Create Homework
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiFileText size={20} className="text-blue-600" />}
            title="Total Assignments"
            value={homeworks.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiClock size={20} className="text-orange-600" />}
            title="Active"
            value={homeworks.filter(hw => hw.status === 'active').length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiAlertCircle size={20} className="text-red-600" />}
            title="Overdue"
            value={homeworks.filter(hw => hw.status === 'overdue').length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiCheckCircle size={20} className="text-green-600" />}
            title="Completed"
            value={homeworks.filter(hw => hw.status === 'completed').length}
          />
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search homework..."
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
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

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomeworks.map((homework) => (
          <div 
            key={homework.id} 
            className="cursor-pointer" 
            onClick={() => handleHomeworkSelect(homework)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{homework.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(homework.status)}`}>
                      {homework.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                      {homework.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{homework.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiBook className="h-4 w-4" />
                      {homework.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      {homework.class}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      Due: {homework.dueDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      {homework.estimatedTime} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {homework.submissions.submitted}/{homework.submissions.total}
                    </div>
                    <div className="text-xs text-gray-500">Submitted</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {homework.submissions.graded}
                    </div>
                    <div className="text-xs text-gray-500">Graded</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {homework.submissions.avgScore || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {homework.attachments.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiFileText className="h-3 w-3" />
                      {homework.attachments.length} attachment{homework.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    <FiEye className="h-3 w-3" />
                    View Details
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                    <FiEdit className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredHomeworks.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No homework found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first assignment</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create Homework
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherHomeworkPage; 