'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiUsers, FiBook, FiTrendingUp, FiCalendar,
  FiAlertCircle, FiCheckCircle, FiClock, FiStar, FiTarget,
  FiBarChart, FiActivity, FiDollarSign, FiAward, FiUserCheck,
  FiFileText, FiMail, FiSettings, FiEye
} from 'react-icons/fi';
import Link from 'next/link';

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  attendanceRate: number;
  performanceAverage: number;
  activeAnnouncements: number;
  pendingApprovals: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'announcement' | 'report' | 'attendance';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

interface PerformanceData {
  grade: string;
  average: number;
  change: number;
  students: number;
}

const PrincipalDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Mock data for school statistics
    const mockStats: SchoolStats = {
      totalStudents: 1247,
      totalTeachers: 68,
      totalClasses: 42,
      totalSubjects: 15,
      attendanceRate: 94.5,
      performanceAverage: 82.3,
      activeAnnouncements: 8,
      pendingApprovals: 12
    };

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'enrollment',
        title: 'New Student Enrollment',
        description: '15 new students enrolled in Grade 9',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: '2',
        type: 'announcement',
        title: 'Parent-Teacher Meeting',
        description: 'Scheduled for next week across all grades',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '3',
        type: 'report',
        title: 'Monthly Performance Report',
        description: 'Grade 10 performance review completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        priority: 'low'
      },
      {
        id: '4',
        type: 'attendance',
        title: 'Attendance Alert',
        description: 'Grade 8B attendance below threshold',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        priority: 'high'
      }
    ];

    const mockPerformance: PerformanceData[] = [
      { grade: 'Grade 12', average: 87.2, change: 2.1, students: 98 },
      { grade: 'Grade 11', average: 84.5, change: -1.2, students: 105 },
      { grade: 'Grade 10', average: 82.8, change: 3.4, students: 112 },
      { grade: 'Grade 9', average: 79.6, change: 1.8, students: 118 },
      { grade: 'Grade 8', average: 81.3, change: 0.5, students: 108 }
    ];

    setStats(mockStats);
    setRecentActivities(mockActivities);
    setPerformanceData(mockPerformance);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <FiUserCheck className="h-4 w-4" />;
      case 'announcement': return <FiMail className="h-4 w-4" />;
      case 'report': return <FiFileText className="h-4 w-4" />;
      case 'attendance': return <FiClock className="h-4 w-4" />;
      default: return <FiActivity className="h-4 w-4" />;
    }
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Principal Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}! Here's your school overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Link
            href="/principal/reports"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiBarChart className="h-4 w-4" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-blue-600" />}
            title="Total Students"
            value={stats.totalStudents}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-green-600" />}
            title="Teachers"
            value={stats.totalTeachers}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-purple-600" />}
            title="Active Classes"
            value={stats.totalClasses}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-orange-600" />}
            title="Attendance Rate"
            value={stats.attendanceRate}
            unit="%"
          />
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiStar size={20} className="text-yellow-600" />}
            title="Performance Avg"
            value={stats.performanceAverage}
            unit="%"
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiMail size={20} className="text-indigo-600" />}
            title="Announcements"
            value={stats.activeAnnouncements}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiAlertCircle size={20} className="text-red-600" />}
            title="Pending Approvals"
            value={stats.pendingApprovals}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-cyan-600" />}
            title="Subjects"
            value={stats.totalSubjects}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance by Grade */}
        <div className="xl:col-span-2">
          <Card title="Performance by Grade" className="p-6">
            <div className="space-y-4">
              {performanceData.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {grade.grade.split(' ')[1]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{grade.grade}</h4>
                      <p className="text-sm text-gray-600">{grade.students} students</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{grade.average}%</div>
                    <div className={`text-sm flex items-center gap-1 ${
                      grade.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <FiTrendingUp className={`h-3 w-3 ${grade.change < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(grade.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card title="Recent Activities" className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="text-blue-600 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link 
                href="/principal/reports" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiEye className="h-3 w-3" />
                View all activities
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/principal/users" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">Students, Teachers & Staff</p>
            </div>
          </Link>

          <Link href="/principal/classes" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiBook className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">Class Management</h3>
              <p className="text-sm text-gray-600">All Grades 1-12</p>
            </div>
          </Link>

          <Link href="/principal/announcements" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiMail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Announcements</h3>
              <p className="text-sm text-gray-600">School-wide Communication</p>
            </div>
          </Link>

          <Link href="/principal/settings" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiSettings className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium mb-1">School Settings</h3>
              <p className="text-sm text-gray-600">Configuration & Policies</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PrincipalDashboard; 