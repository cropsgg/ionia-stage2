'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiBook, FiUsers, FiCalendar, FiClock, FiPlus, FiSearch, FiFilter,
  FiMoreVertical, FiEdit, FiTrash2, FiEye, FiTarget, FiStar,
  FiBarChart, FiActivity, FiUserCheck, FiFileText,
  FiDownload, FiUpload, FiSettings, FiRefreshCw, FiMapPin
} from 'react-icons/fi';

interface ClassData {
  id: string;
  name: string;
  grade: number;
  section: string;
  teacher: string;
  teacherId: string;
  subject?: string;
  totalStudents: number;
  maxCapacity: number;
  room: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  averagePerformance: number;
  attendanceRate: number;
  status: 'active' | 'inactive' | 'completed';
  semester: string;
  description?: string;
  createdDate: Date;
}

const PrincipalClassesPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedGradeView, setSelectedGradeView] = useState<number | null>(null);

  useEffect(() => {
    // Mock classes data for grades 1-12
    const mockClasses: ClassData[] = [
      // Grade 1 Classes
      {
        id: '1',
        name: 'Grade 1A',
        grade: 1,
        section: 'A',
        teacher: 'Ms. Sarah Johnson',
        teacherId: 'T001',
        totalStudents: 25,
        maxCapacity: 30,
        room: 'Room 101',
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '12:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '12:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '12:00' },
          { day: 'Thursday', startTime: '09:00', endTime: '12:00' },
          { day: 'Friday', startTime: '09:00', endTime: '12:00' }
        ],
        averagePerformance: 85,
        attendanceRate: 95,
        status: 'active',
        semester: 'Fall 2024',
        description: 'Primary class focusing on basic literacy and numeracy',
        createdDate: new Date(2024, 8, 1)
      },
      {
        id: '2',
        name: 'Grade 1B',
        grade: 1,
        section: 'B',
        teacher: 'Mr. David Wilson',
        teacherId: 'T002',
        totalStudents: 28,
        maxCapacity: 30,
        room: 'Room 102',
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '12:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '12:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '12:00' },
          { day: 'Thursday', startTime: '09:00', endTime: '12:00' },
          { day: 'Friday', startTime: '09:00', endTime: '12:00' }
        ],
        averagePerformance: 82,
        attendanceRate: 93,
        status: 'active',
        semester: 'Fall 2024',
        createdDate: new Date(2024, 8, 1)
      },
      // Grade 6 Classes
      {
        id: '6',
        name: 'Grade 6A - Mathematics',
        grade: 6,
        section: 'A',
        teacher: 'Dr. Emily Rodriguez',
        teacherId: 'T006',
        subject: 'Mathematics',
        totalStudents: 32,
        maxCapacity: 35,
        room: 'Room 201',
        schedule: [
          { day: 'Monday', startTime: '10:00', endTime: '11:30' },
          { day: 'Wednesday', startTime: '10:00', endTime: '11:30' },
          { day: 'Friday', startTime: '10:00', endTime: '11:30' }
        ],
        averagePerformance: 78,
        attendanceRate: 89,
        status: 'active',
        semester: 'Fall 2024',
        description: 'Advanced mathematics for middle school students',
        createdDate: new Date(2024, 7, 15)
      },
      // Grade 10 Classes
      {
        id: '10',
        name: 'Grade 10A - Physics',
        grade: 10,
        section: 'A',
        teacher: 'Prof. Michael Chen',
        teacherId: 'T010',
        subject: 'Physics',
        totalStudents: 28,
        maxCapacity: 30,
        room: 'Lab 301',
        schedule: [
          { day: 'Tuesday', startTime: '11:00', endTime: '12:30' },
          { day: 'Thursday', startTime: '11:00', endTime: '12:30' }
        ],
        averagePerformance: 73,
        attendanceRate: 91,
        status: 'active',
        semester: 'Fall 2024',
        description: 'Introduction to Physics with laboratory work',
        createdDate: new Date(2024, 7, 20)
      },
      // Grade 12 Classes
      {
        id: '12',
        name: 'Grade 12A - Computer Science',
        grade: 12,
        section: 'A',
        teacher: 'Ms. Jennifer Park',
        teacherId: 'T012',
        subject: 'Computer Science',
        totalStudents: 24,
        maxCapacity: 25,
        room: 'Computer Lab',
        schedule: [
          { day: 'Monday', startTime: '14:00', endTime: '16:00' },
          { day: 'Wednesday', startTime: '14:00', endTime: '16:00' },
          { day: 'Friday', startTime: '14:00', endTime: '16:00' }
        ],
        averagePerformance: 88,
        attendanceRate: 97,
        status: 'active',
        semester: 'Fall 2024',
        description: 'Advanced Computer Science and Programming',
        createdDate: new Date(2024, 7, 25)
      }
    ];

    setClasses(mockClasses);
  }, []);

  const handleClassSelect = (classData: ClassData) => {
    setSelectedClass(classData);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 5) return 'text-blue-600 bg-blue-100';
    if (grade <= 8) return 'text-green-600 bg-green-100';
    if (grade <= 10) return 'text-purple-600 bg-purple-100';
    return 'text-orange-600 bg-orange-100';
  };

  const filteredClasses = classes.filter(classData => {
    const matchesSearch = classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classData.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (classData.subject && classData.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGrade = filterGrade === 'all' || classData.grade.toString() === filterGrade;
    const matchesStatus = filterStatus === 'all' || classData.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const grades = Array.from(new Set(classes.map(c => c.grade))).sort((a, b) => a - b);
  const totalStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
  const avgPerformance = classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.averagePerformance, 0) / classes.length) : 0;
  const avgAttendance = classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length) : 0;

  if (viewMode === 'detail' && selectedClass) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('grid')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Classes
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedClass.name}</h1>
            <p className="text-gray-600">{selectedClass.teacher} • {selectedClass.room}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit Class
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiDownload className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-blue-600" />}
              title="Students"
              value={`${selectedClass.totalStudents}/${selectedClass.maxCapacity}`}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiStar size={20} className="text-yellow-600" />}
              title="Performance"
              value={selectedClass.averagePerformance}
              unit="%"
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiTarget size={20} className="text-green-600" />}
              title="Attendance"
              value={selectedClass.attendanceRate}
              unit="%"
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiMapPin size={20} className="text-purple-600" />}
              title="Room"
              value={selectedClass.room}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Class Information */}
          <div className="xl:col-span-2">
            <Card title="Class Information" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Class Name</label>
                      <p className="font-medium">{selectedClass.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Grade</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(selectedClass.grade)}`}>
                        Grade {selectedClass.grade}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Section</label>
                      <p className="font-medium">{selectedClass.section}</p>
                    </div>
                    {selectedClass.subject && (
                      <div>
                        <label className="text-sm text-gray-600">Subject</label>
                        <p className="font-medium">{selectedClass.subject}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-600">Semester</label>
                      <p className="font-medium">{selectedClass.semester}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Teacher & Logistics</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Teacher</label>
                      <p className="font-medium">{selectedClass.teacher}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Room</label>
                      <p className="font-medium">{selectedClass.room}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Capacity</label>
                      <p className="font-medium">{selectedClass.totalStudents}/{selectedClass.maxCapacity} students</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClass.status)}`}>
                        {selectedClass.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Created</label>
                      <p className="font-medium">{selectedClass.createdDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedClass.description && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedClass.description}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Schedule & Actions */}
          <div className="space-y-6">
            <Card title="Schedule" className="p-6">
              <div className="space-y-3">
                {selectedClass.schedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.day}</p>
                      <p className="text-sm text-gray-600">{schedule.startTime} - {schedule.endTime}</p>
                    </div>
                    <FiClock className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiUsers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Manage Students</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBarChart className="h-4 w-4 text-green-600" />
                  <span className="text-sm">View Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiCalendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Update Schedule</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSettings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Class Settings</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Manage all grades 1-12 classes and sections</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            Create Class
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-blue-600" />}
            title="Total Classes"
            value={classes.length}
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
            icon={<FiStar size={20} className="text-yellow-600" />}
            title="Avg Performance"
            value={avgPerformance}
            unit="%"
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-purple-600" />}
            title="Avg Attendance"
            value={avgAttendance}
            unit="%"
          />
        </Card>
      </div>

      {/* Grade Overview */}
      <Card title="Classes by Grade" className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({length: 12}, (_, i) => i + 1).map((grade) => {
            const gradeClasses = classes.filter(c => c.grade === grade);
            const gradeStudents = gradeClasses.reduce((sum, c) => sum + c.totalStudents, 0);
            
            return (
              <div 
                key={grade}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedGradeView(grade)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${getGradeColor(grade)}`}>
                    <span className="font-bold">{grade}</span>
                  </div>
                  <div className="text-sm font-medium">Grade {grade}</div>
                  <div className="text-xs text-gray-600">{gradeClasses.length} classes</div>
                  <div className="text-xs text-gray-600">{gradeStudents} students</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search classes..."
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
            <option key={grade} value={grade.toString()}>Grade {grade}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classData) => (
          <div
            key={classData.id}
            className="cursor-pointer"
            onClick={() => handleClassSelect(classData)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classData.name}</h3>
                  <p className="text-sm text-gray-600">{classData.teacher}</p>
                  {classData.subject && (
                    <p className="text-xs text-gray-500">{classData.subject}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(classData.grade)}`}>
                    Grade {classData.grade}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{classData.totalStudents}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{classData.averagePerformance}%</div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{classData.room}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium">{classData.attendanceRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classData.status)}`}>
                    {classData.status}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <FiBook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create New Class
          </button>
        </div>
      )}
    </div>
  );
};

export default PrincipalClassesPage; 