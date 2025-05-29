'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import EmptyState from '@/components/ui/EmptyState';
import { 
  FiUsers, FiFileText, FiClock, FiBarChart2, FiTrendingUp, 
  FiCheckCircle, FiAlertTriangle, FiCalendar, FiBook, FiAward,
  FiGrid, FiPlus, FiEye, FiMessageSquare, FiActivity
} from 'react-icons/fi';
import Link from 'next/link';

interface ClassData {
  id: string;
  name: string;
  section: string;
  subject: string;
  studentCount: number;
  averagePerformance: number;
  recentActivity: number;
  pendingSubmissions: number;
  nextClass?: Date;
}

interface StudentAlert {
  id: string;
  studentName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  classId: string;
  className: string;
}

interface RecentSubmission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  className: string;
  submittedAt: Date;
  status: 'pending' | 'graded';
}

const TeacherDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [studentAlerts, setStudentAlerts] = useState<StudentAlert[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);

  // Mock data
  useEffect(() => {
    const mockClasses: ClassData[] = [
      {
        id: '1',
        name: 'Class 10A',
        section: 'A',
        subject: 'Mathematics',
        studentCount: 32,
        averagePerformance: 78,
        recentActivity: 5,
        pendingSubmissions: 8,
        nextClass: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        id: '2',
        name: 'Class 9B',
        section: 'B',
        subject: 'Mathematics',
        studentCount: 28,
        averagePerformance: 82,
        recentActivity: 3,
        pendingSubmissions: 12,
        nextClass: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
      },
      {
        id: '3',
        name: 'Class 11C',
        section: 'C',
        subject: 'Advanced Mathematics',
        studentCount: 24,
        averagePerformance: 85,
        recentActivity: 2,
        pendingSubmissions: 3,
        nextClass: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      }
    ];

    const mockAlerts: StudentAlert[] = [
      {
        id: '1',
        studentName: 'John Smith',
        issue: 'Missing last 3 assignments',
        severity: 'high',
        classId: '1',
        className: 'Class 10A'
      },
      {
        id: '2',
        studentName: 'Sarah Johnson',
        issue: 'Performance declining (65% → 45%)',
        severity: 'medium',
        classId: '2',
        className: 'Class 9B'
      },
      {
        id: '3',
        studentName: 'Mike Davis',
        issue: 'Frequently late submissions',
        severity: 'low',
        classId: '1',
        className: 'Class 10A'
      }
    ];

    const mockSubmissions: RecentSubmission[] = [
      {
        id: '1',
        studentName: 'Emma Wilson',
        assignmentTitle: 'Quadratic Equations',
        className: 'Class 10A',
        submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        status: 'pending'
      },
      {
        id: '2',
        studentName: 'Alex Brown',
        assignmentTitle: 'Algebra Review',
        className: 'Class 9B',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending'
      },
      {
        id: '3',
        studentName: 'Lisa Chen',
        assignmentTitle: 'Calculus Problems',
        className: 'Class 11C',
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: 'graded'
      }
    ];

    setClasses(mockClasses);
    setStudentAlerts(mockAlerts);
    setRecentSubmissions(mockSubmissions);
  }, []);

  const getTotalStudents = () => classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const getTotalPendingSubmissions = () => classes.reduce((sum, cls) => sum + cls.pendingSubmissions, 0);
  const getAverageClassPerformance = () => {
    if (classes.length === 0) return 0;
    return Math.round(classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / classes.length);
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <FiAlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <FiClock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <FiActivity className="h-4 w-4 text-blue-600" />;
      default: return <FiActivity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeUntilClass = (nextClass: Date) => {
    const now = new Date();
    const diffMs = nextClass.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Starting soon';
    if (diffHours < 24) return `in ${diffHours}h`;
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName?.split(' ')[0]}! 👨‍🏫</h1>
          <p className="text-gray-600 mt-1">Manage your classes and track student progress</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-blue-600" />}
            title="Total Students"
            value={getTotalStudents()}
            unit="students"
            trend={{
              value: 8,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiFileText size={20} className="text-orange-600" />}
            title="Pending Reviews"
            value={getTotalPendingSubmissions()}
            unit="submissions"
            trend={{
              value: 12,
              isPositive: false
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiBarChart2 size={20} className="text-green-600" />}
            title="Average Performance"
            value={getAverageClassPerformance()}
            unit="%"
            trend={{
              value: 4.2,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-purple-600" />}
            title="Classes Teaching"
            value={classes.length}
            unit="classes"
          />
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card title="Quick Actions" className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/teacher/homework" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiPlus className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-900">Create Assignment</span>
            </div>
          </Link>
          
          <Link href="/teacher/submissions" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiEye className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-900">Review Submissions</span>
            </div>
          </Link>
          
          <Link href="/teacher/classes" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiUsers className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-900">Manage Classes</span>
            </div>
          </Link>
          
          <Link href="/teacher/content" className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiBook className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-900">Content Library</span>
            </div>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Classes & Submissions */}
        <div className="xl:col-span-2 space-y-6">
          {/* My Classes */}
          <Card title="My Classes" className="p-5">
            {classes.length === 0 ? (
              <EmptyState 
                icon={<FiUsers className="h-8 w-8" />}
                title="No Classes Assigned"
                description="Contact your administrator to get assigned to classes."
                compact
              />
            ) : (
              <div className="space-y-4">
                {classes.map((classData) => (
                  <div key={classData.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{classData.name}</h3>
                        <p className="text-sm text-gray-600">{classData.subject}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {classData.studentCount} students
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{classData.averagePerformance}%</div>
                        <div className="text-xs text-gray-500">Avg Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">{classData.pendingSubmissions}</div>
                        <div className="text-xs text-gray-500">Pending Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{classData.recentActivity}</div>
                        <div className="text-xs text-gray-500">Recent Activity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {classData.nextClass && formatTimeUntilClass(classData.nextClass)}
                        </div>
                        <div className="text-xs text-gray-500">Next Class</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        href={`/teacher/classes/${classData.id}`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Class
                      </Link>
                      <Link 
                        href={`/teacher/submissions?class=${classData.id}`}
                        className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Review ({classData.pendingSubmissions})
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Submissions */}
          <Card title="Recent Submissions" className="p-5">
            {recentSubmissions.length === 0 ? (
              <EmptyState 
                icon={<FiFileText className="h-8 w-8" />}
                title="No Recent Submissions"
                description="Student submissions will appear here when received."
                compact
              />
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        submission.status === 'pending' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {submission.status === 'pending' ? 
                          <FiClock className="h-4 w-4 text-orange-600" /> :
                          <FiCheckCircle className="h-4 w-4 text-green-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{submission.studentName}</p>
                        <p className="text-sm text-gray-600">{submission.assignmentTitle}</p>
                        <p className="text-xs text-gray-500">{submission.className} • {getTimeAgo(submission.submittedAt)}</p>
                      </div>
                    </div>
                    
                    {submission.status === 'pending' && (
                      <Link 
                        href={`/teacher/submissions/${submission.id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Review
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Alerts & Schedule */}
        <div className="space-y-6">
          {/* Student Alerts */}
          <Card title="Student Alerts" className="p-5">
            {studentAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <FiCheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm">All students are on track!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 border-l-4 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.studentName}</h4>
                        <p className="text-sm text-gray-600">{alert.issue}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.className}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Teaching Schedule */}
          <Card title="Today's Schedule" className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Class 10A - Mathematics</p>
                  <p className="text-sm text-gray-600">9:00 AM - 10:00 AM</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Current</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Class 9B - Mathematics</p>
                  <p className="text-sm text-gray-600">11:00 AM - 12:00 PM</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Next</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Class 11C - Advanced Math</p>
                  <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Later</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="This Week" className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Assignments Graded</span>
                </div>
                <span className="text-lg font-bold text-green-600">23</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiUsers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Student Interactions</span>
                </div>
                <span className="text-lg font-bold text-blue-600">45</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiAward className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Classes Taught</span>
                </div>
                <span className="text-lg font-bold text-purple-600">15</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;