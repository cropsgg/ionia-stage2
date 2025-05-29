'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiBook, FiUsers, FiFileText, FiCalendar, FiPlus, FiEdit,
  FiMoreVertical, FiSearch, FiFilter, FiTarget, FiTrendingUp,
  FiClock, FiCheckCircle, FiAlertCircle, FiEye, FiDownload,
  FiBarChart, FiActivity
} from 'react-icons/fi';

interface Assignment {
  id: string;
  title: string;
  type: 'homework' | 'quiz' | 'test' | 'project';
  dueDate: Date;
  status: 'active' | 'completed' | 'overdue';
  submissions: number;
  totalStudents: number;
  averageScore?: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  grade: string;
  totalStudents: number;
  totalClasses: number;
  averagePerformance: number;
  completionRate: number;
  nextClass: Date;
  assignments: Assignment[];
  recentActivity: string;
  syllabus: {
    completed: number;
    total: number;
    currentTopic: string;
  };
}

const TeacherSubjectsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    // Mock subjects data
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Advanced Mathematics covering Algebra, Geometry, and Calculus',
        grade: '10th Grade',
        totalStudents: 85,
        totalClasses: 3,
        averagePerformance: 78,
        completionRate: 85,
        nextClass: new Date(Date.now() + 24 * 60 * 60 * 1000),
        recentActivity: 'Quiz 5 submitted by 32 students',
        syllabus: {
          completed: 12,
          total: 20,
          currentTopic: 'Quadratic Equations'
        },
        assignments: [
          {
            id: '1',
            title: 'Quadratic Equations Practice',
            type: 'homework',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: 'active',
            submissions: 28,
            totalStudents: 32,
            averageScore: 82
          },
          {
            id: '2',
            title: 'Algebra Quiz',
            type: 'quiz',
            dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'completed',
            submissions: 32,
            totalStudents: 32,
            averageScore: 76
          }
        ]
      },
      {
        id: '2',
        name: 'Physics',
        code: 'PHY201',
        description: 'Introduction to Physics - Mechanics, Waves, and Thermodynamics',
        grade: '11th Grade',
        totalStudents: 45,
        totalClasses: 2,
        averagePerformance: 72,
        completionRate: 79,
        nextClass: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        recentActivity: 'Lab report submissions pending',
        syllabus: {
          completed: 8,
          total: 15,
          currentTopic: 'Newton\'s Laws of Motion'
        },
        assignments: [
          {
            id: '3',
            title: 'Motion and Forces Lab',
            type: 'project',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            status: 'active',
            submissions: 12,
            totalStudents: 25
          }
        ]
      },
      {
        id: '3',
        name: 'Computer Science',
        code: 'CS301',
        description: 'Programming Fundamentals with Python',
        grade: '12th Grade',
        totalStudents: 38,
        totalClasses: 2,
        averagePerformance: 84,
        completionRate: 92,
        nextClass: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        recentActivity: 'New coding assignment posted',
        syllabus: {
          completed: 15,
          total: 18,
          currentTopic: 'Object-Oriented Programming'
        },
        assignments: []
      }
    ];

    setSubjects(mockSubjects);
  }, []);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return <FiFileText className="h-4 w-4" />;
      case 'quiz': return <FiCheckCircle className="h-4 w-4" />;
      case 'test': return <FiTarget className="h-4 w-4" />;
      case 'project': return <FiActivity className="h-4 w-4" />;
      default: return <FiFileText className="h-4 w-4" />;
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || subject.grade.includes(filterGrade);
    return matchesSearch && matchesGrade;
  });

  const grades = Array.from(new Set(subjects.map(subject => subject.grade.split(' ')[0])));

  if (viewMode === 'detail' && selectedSubject) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('grid')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Subjects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedSubject.name}</h1>
            <p className="text-gray-600">{selectedSubject.code} • {selectedSubject.grade}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiPlus className="h-4 w-4" />
              Create Assignment
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit Subject
            </button>
          </div>
        </div>

        {/* Subject Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-blue-600" />}
              title="Total Students"
              value={selectedSubject.totalStudents}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiBarChart size={20} className="text-green-600" />}
              title="Average Performance"
              value={selectedSubject.averagePerformance}
              unit="%"
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiTarget size={20} className="text-purple-600" />}
              title="Completion Rate"
              value={selectedSubject.completionRate}
              unit="%"
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiActivity size={20} className="text-orange-600" />}
              title="Syllabus Progress"
              value={Math.round((selectedSubject.syllabus.completed / selectedSubject.syllabus.total) * 100)}
              unit="%"
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Assignments */}
          <div className="xl:col-span-2">
            <Card title="Assignments" className="p-6">
              <div className="space-y-4">
                {selectedSubject.assignments.length > 0 ? (
                  selectedSubject.assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">
                            {getTypeIcon(assignment.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{assignment.type}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Due:</span>
                          <div className="font-medium">{assignment.dueDate.toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Submissions:</span>
                          <div className="font-medium">{assignment.submissions}/{assignment.totalStudents}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Score:</span>
                          <div className="font-medium">{assignment.averageScore || 'N/A'}{assignment.averageScore ? '%' : ''}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          <FiEye className="h-3 w-3" />
                          View
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                          <FiDownload className="h-3 w-3" />
                          Export
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No assignments yet</p>
                    <button className="mt-2 text-blue-600 hover:text-blue-800">Create your first assignment</button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Subject Info & Progress */}
          <div className="space-y-6">
            <Card title="Subject Information" className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedSubject.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Next Class</h4>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{selectedSubject.nextClass.toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Classes</h4>
                  <p className="text-sm text-gray-600">{selectedSubject.totalClasses} classes assigned</p>
                </div>
              </div>
            </Card>

            <Card title="Syllabus Progress" className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{selectedSubject.syllabus.completed}/{selectedSubject.syllabus.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(selectedSubject.syllabus.completed / selectedSubject.syllabus.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Topic</h4>
                  <p className="text-sm text-gray-600">{selectedSubject.syllabus.currentTopic}</p>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                  Update Progress
                </button>
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiFileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Create Assignment</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBarChart className="h-4 w-4 text-green-600" />
                  <span className="text-sm">View Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiDownload className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Export Grades</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiCalendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Schedule Class</span>
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
          <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
          <p className="text-gray-600 mt-1">Manage your subjects and curriculum</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiPlus className="h-4 w-4" />
          Add New Subject
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>{grade}th Grade</option>
          ))}
        </select>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="cursor-pointer"
            onClick={() => handleSubjectSelect(subject)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                  <p className="text-xs text-gray-500">{subject.grade}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{subject.totalStudents}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{subject.averagePerformance}%</div>
                  <div className="text-xs text-gray-500">Avg Performance</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Syllabus:</span>
                  <span className="font-medium">{Math.round((subject.syllabus.completed / subject.syllabus.total) * 100)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-medium">{subject.completionRate}%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiClock className="h-3 w-3" />
                  <span>{subject.recentActivity}</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSubjectsPage; 