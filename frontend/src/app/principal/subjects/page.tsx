'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiBook, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit,
  FiTrash2, FiEye, FiUsers, FiTarget, FiStar, FiActivity,
  FiSettings, FiBarChart, FiClock, FiDownload
} from 'react-icons/fi';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  credits: number;
  level: 'elementary' | 'middle' | 'high';
  prerequisites: string[];
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  averagePerformance: number;
  status: 'active' | 'inactive' | 'under_review';
  syllabus: {
    totalUnits: number;
    completedUnits: number;
    currentUnit: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PrincipalSubjectsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        code: 'MATH',
        description: 'Comprehensive mathematics curriculum covering algebra, geometry, calculus, and statistics',
        department: 'Mathematics',
        credits: 4,
        level: 'high',
        prerequisites: [],
        totalTeachers: 8,
        totalStudents: 324,
        totalClasses: 18,
        averagePerformance: 82.5,
        status: 'active',
        syllabus: {
          totalUnits: 12,
          completedUnits: 8,
          currentUnit: 'Quadratic Functions'
        },
        createdAt: new Date(2023, 8, 1),
        updatedAt: new Date(2024, 10, 15)
      },
      {
        id: '2',
        name: 'English Language Arts',
        code: 'ELA',
        description: 'Language arts curriculum focusing on reading, writing, speaking, and listening skills',
        department: 'English',
        credits: 4,
        level: 'high',
        prerequisites: [],
        totalTeachers: 6,
        totalStudents: 298,
        totalClasses: 15,
        averagePerformance: 78.9,
        status: 'active',
        syllabus: {
          totalUnits: 10,
          completedUnits: 6,
          currentUnit: 'Literary Analysis'
        },
        createdAt: new Date(2023, 8, 1),
        updatedAt: new Date(2024, 10, 12)
      },
      {
        id: '3',
        name: 'Physics',
        code: 'PHYS',
        description: 'Introduction to physics principles including mechanics, thermodynamics, and electromagnetism',
        department: 'Science',
        credits: 3,
        level: 'high',
        prerequisites: ['MATH'],
        totalTeachers: 4,
        totalStudents: 156,
        totalClasses: 8,
        averagePerformance: 75.3,
        status: 'active',
        syllabus: {
          totalUnits: 15,
          completedUnits: 9,
          currentUnit: 'Wave Motion'
        },
        createdAt: new Date(2023, 8, 1),
        updatedAt: new Date(2024, 10, 20)
      },
      {
        id: '4',
        name: 'Elementary Science',
        code: 'ESCI',
        description: 'Basic science concepts for elementary students including nature, weather, and simple experiments',
        department: 'Science',
        credits: 2,
        level: 'elementary',
        prerequisites: [],
        totalTeachers: 12,
        totalStudents: 445,
        totalClasses: 22,
        averagePerformance: 87.2,
        status: 'active',
        syllabus: {
          totalUnits: 8,
          completedUnits: 5,
          currentUnit: 'Plants and Animals'
        },
        createdAt: new Date(2023, 8, 1),
        updatedAt: new Date(2024, 10, 18)
      },
      {
        id: '5',
        name: 'Computer Science',
        code: 'CS',
        description: 'Programming fundamentals, algorithms, and computer science principles',
        department: 'Technology',
        credits: 3,
        level: 'high',
        prerequisites: ['MATH'],
        totalTeachers: 3,
        totalStudents: 89,
        totalClasses: 5,
        averagePerformance: 84.7,
        status: 'under_review',
        syllabus: {
          totalUnits: 14,
          completedUnits: 10,
          currentUnit: 'Object-Oriented Programming'
        },
        createdAt: new Date(2023, 8, 1),
        updatedAt: new Date(2024, 10, 25)
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
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'elementary': return 'text-blue-600 bg-blue-100';
      case 'middle': return 'text-green-600 bg-green-100';
      case 'high': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || subject.department === filterDepartment;
    const matchesLevel = filterLevel === 'all' || subject.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || subject.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus;
  });

  const departments = Array.from(new Set(subjects.map(s => s.department)));
  const totalStudents = subjects.reduce((sum, s) => sum + s.totalStudents, 0);
  const totalTeachers = subjects.reduce((sum, s) => sum + s.totalTeachers, 0);
  const avgPerformance = subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + s.averagePerformance, 0) / subjects.length) : 0;

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
            <p className="text-gray-600">{selectedSubject.code} • {selectedSubject.department}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit Subject
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="h-4 w-4" />
              Export Data
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
              icon={<FiUsers size={20} className="text-green-600" />}
              title="Teachers"
              value={selectedSubject.totalTeachers}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiBook size={20} className="text-purple-600" />}
              title="Classes"
              value={selectedSubject.totalClasses}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiStar size={20} className="text-yellow-600" />}
              title="Performance"
              value={selectedSubject.averagePerformance}
              unit="%"
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Subject Information */}
          <div className="xl:col-span-2">
            <Card title="Subject Information" className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Subject Name</label>
                      <p className="font-medium">{selectedSubject.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Subject Code</label>
                      <p className="font-medium">{selectedSubject.code}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Department</label>
                      <p className="font-medium">{selectedSubject.department}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Credits</label>
                      <p className="font-medium">{selectedSubject.credits}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Level</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedSubject.level)}`}>
                        {selectedSubject.level}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubject.status)}`}>
                        {selectedSubject.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedSubject.description}</p>
                </div>

                {selectedSubject.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubject.prerequisites.map((prereq, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Syllabus Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Units Completed</span>
                        <span>{selectedSubject.syllabus.completedUnits}/{selectedSubject.syllabus.totalUnits}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(selectedSubject.syllabus.completedUnits / selectedSubject.syllabus.totalUnits) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Current Unit</label>
                      <p className="font-medium">{selectedSubject.syllabus.currentUnit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEdit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit Curriculum</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiUsers className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Manage Teachers</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBarChart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">View Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBook className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Update Syllabus</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSettings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Subject Settings</span>
                </button>
              </div>
            </Card>

            <Card title="Statistics" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate:</span>
                  <span className="font-medium">{Math.round((selectedSubject.syllabus.completedUnits / selectedSubject.syllabus.totalUnits) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Student-Teacher Ratio:</span>
                  <span className="font-medium">{Math.round(selectedSubject.totalStudents / selectedSubject.totalTeachers)}:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Class Size:</span>
                  <span className="font-medium">{Math.round(selectedSubject.totalStudents / selectedSubject.totalClasses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="font-medium">{selectedSubject.updatedAt.toLocaleDateString()}</span>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600 mt-1">Manage subjects and academic programs</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiPlus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-blue-600" />}
            title="Total Subjects"
            value={subjects.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-green-600" />}
            title="Total Students"
            value={totalStudents}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-purple-600" />}
            title="Total Teachers"
            value={totalTeachers}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiStar size={20} className="text-yellow-600" />}
            title="Avg Performance"
            value={avgPerformance}
            unit="%"
          />
        </Card>
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
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="elementary">Elementary</option>
          <option value="middle">Middle School</option>
          <option value="high">High School</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="under_review">Under Review</option>
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
                  <p className="text-sm text-gray-600">{subject.code} • {subject.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(subject.level)}`}>
                    {subject.level}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{subject.totalStudents}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{subject.averagePerformance}%</div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Teachers:</span>
                  <span className="font-medium">{subject.totalTeachers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Classes:</span>
                  <span className="font-medium">{subject.totalClasses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}>
                    {subject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <FiBook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Subject
          </button>
        </div>
      )}
    </div>
  );
};

export default PrincipalSubjectsPage; 