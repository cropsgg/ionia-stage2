'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiUsers, FiBookOpen, FiTrendingUp, FiCalendar, FiMail, FiPhone, FiMapPin,
  FiEye, FiMessageSquare, FiEdit, FiPlus, FiFilter, FiSearch, FiMoreVertical,
  FiAward, FiUser, FiBarChart, FiClock, FiTarget, FiCheck, FiX, FiStar,
  FiDownload, FiUpload, FiUserCheck, FiUserX, FiActivity, FiClipboard,
  FiSettings, FiSend, FiPaperclip, FiChevronDown, FiChevronUp, FiSave
} from 'react-icons/fi';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  profilePicture?: string;
  performance: {
    averageGrade: number;
    attendance: number;
    completionRate: number;
    assignments: { name: string; grade: number; date: Date }[];
    quizzes: { name: string; score: number; date: Date }[];
  };
  attendance: {
    date: Date;
    status: 'present' | 'absent' | 'late';
  }[];
  recentActivity: string;
  behavioralNotes: { note: string; date: Date; type: 'positive' | 'neutral' | 'concern' }[];
  parentContact: {
    name: string;
    phone: string;
    email: string;
    relation: string;
  };
  medicalInfo: string;
  emergencyContact: string;
  joiningDate: Date;
}

interface ClassData {
  id: string;
  name: string;
  section: string;
  subject: string;
  grade: string;
  academicYear: string;
  studentCount: number;
  averagePerformance: number;
  attendanceRate: number;
  completionRate: number;
  schedule: { day: string; time: string; duration: string }[];
  classroom: string;
  students: Student[];
  announcements: {
    id: string;
    title: string;
    content: string;
    date: Date;
    priority: 'low' | 'medium' | 'high';
    type: 'general' | 'assignment' | 'exam' | 'event';
  }[];
  upcomingActivities: {
    id: string;
    title: string;
    type: 'assignment' | 'quiz' | 'exam' | 'project';
    dueDate: Date;
    status: 'draft' | 'published' | 'closed';
  }[];
  recentGrades: {
    studentId: string;
    studentName: string;
    assignment: string;
    grade: number;
    date: Date;
  }[];
}

const TeacherClassesPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail' | 'student' | 'attendance' | 'grades'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const mockClasses: ClassData[] = [
      {
        id: '1',
        name: '10th Grade Mathematics',
        section: 'A',
        subject: 'Mathematics',
        grade: '10',
        academicYear: '2024-25',
        studentCount: 32,
        averagePerformance: 82.5,
        attendanceRate: 94.2,
        completionRate: 88.7,
        schedule: [
          { day: 'Monday', time: '9:00 AM', duration: '45 min' },
          { day: 'Wednesday', time: '10:00 AM', duration: '45 min' },
          { day: 'Friday', time: '11:00 AM', duration: '45 min' }
        ],
        classroom: 'Room 201',
        students: [
          {
            id: '1',
            name: 'Emma Wilson',
            rollNumber: '10A001',
            email: 'emma.wilson@student.edu',
            phone: '+1-555-0101',
            performance: {
              averageGrade: 88.5,
              attendance: 96.8,
              completionRate: 92.3,
              assignments: [
                { name: 'Algebra Quiz', grade: 85, date: new Date(2024, 0, 15) },
                { name: 'Geometry Assignment', grade: 92, date: new Date(2024, 0, 10) }
              ],
              quizzes: [
                { name: 'Weekly Quiz 1', score: 88, date: new Date(2024, 0, 12) }
              ]
            },
            attendance: [
              { date: new Date(2024, 0, 15), status: 'present' },
              { date: new Date(2024, 0, 14), status: 'present' },
              { date: new Date(2024, 0, 13), status: 'late' }
            ],
            recentActivity: 'Submitted Calculus Assignment - 2 hours ago',
            behavioralNotes: [
              { note: 'Excellent problem-solving skills', date: new Date(2024, 0, 10), type: 'positive' },
              { note: 'Helps struggling classmates', date: new Date(2024, 0, 8), type: 'positive' }
            ],
            parentContact: {
              name: 'Sarah Wilson',
              phone: '+1-555-0102',
              email: 'sarah.wilson@parent.com',
              relation: 'Mother'
            },
            medicalInfo: 'No known allergies',
            emergencyContact: '+1-555-0103',
            joiningDate: new Date(2023, 8, 1)
          },
          {
            id: '2',
            name: 'James Rodriguez',
            rollNumber: '10A002',
            email: 'james.rodriguez@student.edu',
            phone: '+1-555-0104',
            performance: {
              averageGrade: 76.2,
              attendance: 89.4,
              completionRate: 78.9,
              assignments: [
                { name: 'Algebra Quiz', grade: 72, date: new Date(2024, 0, 15) },
                { name: 'Geometry Assignment', grade: 80, date: new Date(2024, 0, 10) }
              ],
              quizzes: [
                { name: 'Weekly Quiz 1', score: 75, date: new Date(2024, 0, 12) }
              ]
            },
            attendance: [
              { date: new Date(2024, 0, 15), status: 'absent' },
              { date: new Date(2024, 0, 14), status: 'present' },
              { date: new Date(2024, 0, 13), status: 'present' }
            ],
            recentActivity: 'Missed submission deadline - 1 day ago',
            behavioralNotes: [
              { note: 'Needs more focus during lectures', date: new Date(2024, 0, 12), type: 'concern' },
              { note: 'Shows improvement in recent tests', date: new Date(2024, 0, 5), type: 'positive' }
            ],
            parentContact: {
              name: 'Carlos Rodriguez',
              phone: '+1-555-0105',
              email: 'carlos.rodriguez@parent.com',
              relation: 'Father'
            },
            medicalInfo: 'Requires prescription glasses',
            emergencyContact: '+1-555-0106',
            joiningDate: new Date(2023, 8, 1)
          }
        ],
        announcements: [
          {
            id: '1',
            title: 'Midterm Exam Schedule',
            content: 'Midterm exams will be conducted from February 15-20. Please prepare accordingly.',
            date: new Date(2024, 0, 10),
            priority: 'high',
            type: 'exam'
          },
          {
            id: '2',
            title: 'Assignment Submission',
            content: 'Chapter 5 assignment is due this Friday. Late submissions will have grade penalties.',
            date: new Date(2024, 0, 8),
            priority: 'medium',
            type: 'assignment'
          }
        ],
        upcomingActivities: [
          {
            id: '1',
            title: 'Quadratic Equations Quiz',
            type: 'quiz',
            dueDate: new Date(2024, 0, 20),
            status: 'published'
          },
          {
            id: '2',
            title: 'Geometry Project',
            type: 'project',
            dueDate: new Date(2024, 0, 25),
            status: 'draft'
          }
        ],
        recentGrades: [
          { studentId: '1', studentName: 'Emma Wilson', assignment: 'Algebra Quiz', grade: 85, date: new Date(2024, 0, 15) },
          { studentId: '2', studentName: 'James Rodriguez', assignment: 'Algebra Quiz', grade: 72, date: new Date(2024, 0, 15) }
        ]
      }
    ];

    setClasses(mockClasses);
    if (mockClasses.length > 0) {
      setSelectedClass(mockClasses[0]);
      setViewMode('detail');
    }
  }, []);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setViewMode('student');
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present': return <FiCheck className="h-4 w-4 text-green-600" />;
      case 'absent': return <FiX className="h-4 w-4 text-red-600" />;
      case 'late': return <FiClock className="h-4 w-4 text-yellow-600" />;
      default: return <FiUser className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (!selectedClass) {
    return <div>Loading...</div>;
  }

  // Student Detail View
  if (viewMode === 'student' && selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('detail')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Class
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedStudent.name}</h1>
            <p className="text-gray-600">Roll: {selectedStudent.rollNumber} • {selectedClass.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiMessageSquare className="h-4 w-4" />
              Message Parent
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiEdit className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiBarChart size={20} className="text-blue-600" />}
              title="Average Grade"
              value={selectedStudent.performance.averageGrade}
              unit="%"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              icon={<FiCalendar size={20} className="text-green-600" />}
              title="Attendance"
              value={selectedStudent.performance.attendance}
              unit="%"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              icon={<FiTarget size={20} className="text-purple-600" />}
              title="Completion Rate"
              value={selectedStudent.performance.completionRate}
              unit="%"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              icon={<FiActivity size={20} className="text-orange-600" />}
              title="Assignments"
              value={selectedStudent.performance.assignments.length}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card title="Recent Performance" className="p-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Recent Assignments</h4>
                {selectedStudent.performance.assignments.map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">{assignment.name}</p>
                      <p className="text-sm text-gray-500">{assignment.date.toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(assignment.grade)}`}>
                      {assignment.grade}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Behavioral Notes" className="p-6">
              <div className="space-y-3">
                {selectedStudent.behavioralNotes.map((note, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${
                    note.type === 'positive' ? 'bg-green-50 border-green-200' :
                    note.type === 'concern' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{note.note}</p>
                      <span className="text-xs text-gray-500">{note.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <FiPlus className="h-4 w-4" />
                  Add Note
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Contact Information" className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Student</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Parent/Guardian</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedStudent.parentContact.name}</p>
                    <p className="text-gray-600">{selectedStudent.parentContact.relation}</p>
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span>{selectedStudent.parentContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span>{selectedStudent.parentContact.email}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Send Progress Report
                </button>
              </div>
            </Card>

            <Card title="Recent Attendance" className="p-6">
              <div className="space-y-3">
                {selectedStudent.attendance.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{record.date.toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      {getAttendanceIcon(record.status)}
                      <span className={`text-sm capitalize ${
                        record.status === 'present' ? 'text-green-600' :
                        record.status === 'absent' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Class Detail View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{selectedClass.name}</h1>
          <p className="text-gray-600">Section {selectedClass.section} • {selectedClass.studentCount} Students • {selectedClass.classroom}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            New Activity
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-blue-600" />}
            title="Total Students"
            value={selectedClass.studentCount}
          />
        </Card>
        <Card className="p-5">
          <StatBlock
            icon={<FiBarChart size={20} className="text-green-600" />}
            title="Avg Performance"
            value={selectedClass.averagePerformance}
            unit="%"
          />
        </Card>
        <Card className="p-5">
          <StatBlock
            icon={<FiCalendar size={20} className="text-purple-600" />}
            title="Attendance Rate"
            value={selectedClass.attendanceRate}
            unit="%"
          />
        </Card>
        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-orange-600" />}
            title="Completion Rate"
            value={selectedClass.completionRate}
            unit="%"
          />
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <FiBarChart className="h-4 w-4" /> },
            { id: 'students', label: 'Students', icon: <FiUsers className="h-4 w-4" /> },
            { id: 'attendance', label: 'Attendance', icon: <FiCalendar className="h-4 w-4" /> },
            { id: 'grades', label: 'Grades', icon: <FiStar className="h-4 w-4" /> },
            { id: 'activities', label: 'Activities', icon: <FiClipboard className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card title="Recent Announcements" className="p-6">
              <div className="space-y-4">
                {selectedClass.announcements.map((announcement) => (
                  <div key={announcement.id} className={`p-4 border rounded-lg ${getPriorityColor(announcement.priority)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <span className="text-xs px-2 py-1 bg-white rounded-full">
                        {announcement.type}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">{announcement.date.toLocaleDateString()}</p>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <FiPlus className="h-4 w-4" />
                  New Announcement
                </button>
              </div>
            </Card>

            <Card title="Recent Grades" className="p-6">
              <div className="space-y-3">
                {selectedClass.recentGrades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">{grade.studentName}</p>
                      <p className="text-sm text-gray-600">{grade.assignment}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(grade.grade)}`}>
                        {grade.grade}%
                      </span>
                      <p className="text-xs text-gray-500">{grade.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Class Schedule" className="p-6">
              <div className="space-y-3">
                {selectedClass.schedule.map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{session.day}</p>
                      <p className="text-sm text-gray-600">{session.time}</p>
                    </div>
                    <span className="text-sm text-gray-500">{session.duration}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Upcoming Activities" className="p-6">
              <div className="space-y-3">
                {selectedClass.upcomingActivities.map((activity) => (
                  <div key={activity.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'published' ? 'bg-green-100 text-green-800' :
                        activity.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{activity.type}</p>
                    <p className="text-xs text-gray-500">Due: {activity.dueDate.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <Card title="Student List" className="p-6">
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiUserCheck className="h-4 w-4" />
              Mark Attendance
            </button>
          </div>

          <div className="space-y-3">
            {selectedClass.students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleStudentSelect(student)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{student.performance.averageGrade}%</div>
                    <div className="text-xs text-gray-500">Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{student.performance.attendance}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card title="Attendance Management" className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiSave className="h-4 w-4" />
              Save Attendance
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedClass.students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                    <FiCheck className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg">
                    <FiClock className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'grades' && (
        <Card title="Grade Management" className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Assignments & Grades</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiPlus className="h-4 w-4" />
              Add Assignment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Assignment</th>
                  <th className="text-left py-3 px-4">Grade</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.recentGrades.map((grade, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{grade.studentName}</td>
                    <td className="py-3 px-4">{grade.assignment}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(grade.grade)}`}>
                        {grade.grade}%
                      </span>
                    </td>
                    <td className="py-3 px-4">{grade.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'activities' && (
        <Card title="Class Activities" className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Assignments & Activities</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiClipboard className="h-4 w-4" />
                Assignment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FiPlus className="h-4 w-4" />
                New Quiz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedClass.upcomingActivities.map((activity) => (
              <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'published' ? 'bg-green-100 text-green-800' :
                    activity.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 capitalize">{activity.type}</p>
                <p className="text-sm text-gray-500 mb-3">Due: {activity.dueDate.toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button className="flex-1 text-center py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                    Edit
                  </button>
                  <button className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherClassesPage; 