'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiUsers, FiBook, FiTrendingUp, FiCalendar, FiMapPin,
  FiAlertCircle, FiCheckCircle, FiClock, FiStar, FiTarget,
  FiBarChart, FiActivity, FiDollarSign, FiAward, FiUserCheck,
  FiFileText, FiMail, FiSettings, FiEye, FiGlobe, FiDatabase,
  FiShield, FiServer, FiWifi, FiCpu
} from 'react-icons/fi';
import Link from 'next/link';

interface SystemStats {
  totalSchools: number;
  totalRegions: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  activeUsers: number;
  systemUptime: string;
  avgPerformance: number;
  avgAttendance: number;
  totalRevenue: number;
  pendingApprovals: number;
  criticalAlerts: number;
}

interface RegionalData {
  region: string;
  schools: number;
  students: number;
  performance: number;
  attendance: number;
  status: 'excellent' | 'good' | 'needs_attention';
}

interface SystemActivity {
  id: string;
  type: 'school_registration' | 'user_signup' | 'system_alert' | 'payment' | 'upgrade';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  school?: string;
  region?: string;
}

interface SchoolMetrics {
  id: string;
  name: string;
  region: string;
  students: number;
  performance: number;
  attendance: number;
  status: 'active' | 'inactive' | 'trial' | 'suspended';
  lastActive: Date;
  plan: 'basic' | 'premium' | 'enterprise';
}

const SuperAdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [recentActivities, setRecentActivities] = useState<SystemActivity[]>([]);
  const [topSchools, setTopSchools] = useState<SchoolMetrics[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Mock system-wide statistics
    const mockStats: SystemStats = {
      totalSchools: 247,
      totalRegions: 12,
      totalStudents: 128547,
      totalTeachers: 8934,
      totalAdmins: 345,
      activeUsers: 137826,
      systemUptime: '99.98%',
      avgPerformance: 84.2,
      avgAttendance: 92.7,
      totalRevenue: 2847500,
      pendingApprovals: 23,
      criticalAlerts: 3
    };

    const mockRegionalData: RegionalData[] = [
      { region: 'North America', schools: 89, students: 45234, performance: 86.5, attendance: 94.2, status: 'excellent' },
      { region: 'Europe', schools: 67, students: 32145, performance: 82.1, attendance: 91.8, status: 'good' },
      { region: 'Asia Pacific', schools: 54, students: 28967, performance: 88.3, attendance: 95.1, status: 'excellent' },
      { region: 'Latin America', schools: 23, students: 12456, performance: 78.9, attendance: 89.4, status: 'needs_attention' },
      { region: 'Middle East', schools: 14, students: 9745, performance: 81.7, attendance: 92.3, status: 'good' }
    ];

    const mockActivities: SystemActivity[] = [
      {
        id: '1',
        type: 'school_registration',
        title: 'New School Registration',
        description: 'Lincoln High School registered in North America region',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        priority: 'medium',
        school: 'Lincoln High School',
        region: 'North America'
      },
      {
        id: '2',
        type: 'system_alert',
        title: 'System Performance Alert',
        description: 'High CPU usage detected in EU-West servers',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Premium Upgrade',
        description: 'Riverside Academy upgraded to Enterprise plan',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        priority: 'low',
        school: 'Riverside Academy'
      },
      {
        id: '4',
        type: 'user_signup',
        title: 'Bulk User Registration',
        description: '150 new students registered across 5 schools',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ];

    const mockTopSchools: SchoolMetrics[] = [
      {
        id: '1',
        name: 'Excellence Academy',
        region: 'North America',
        students: 1247,
        performance: 94.5,
        attendance: 97.8,
        status: 'active',
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
        plan: 'enterprise'
      },
      {
        id: '2',
        name: 'Innovation Institute',
        region: 'Europe',
        students: 892,
        performance: 91.2,
        attendance: 95.4,
        status: 'active',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        plan: 'premium'
      },
      {
        id: '3',
        name: 'Future Leaders School',
        region: 'Asia Pacific',
        students: 1156,
        performance: 89.8,
        attendance: 96.2,
        status: 'active',
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        plan: 'enterprise'
      },
      {
        id: '4',
        name: 'Bright Minds Academy',
        region: 'North America',
        students: 734,
        performance: 88.7,
        attendance: 94.1,
        status: 'active',
        lastActive: new Date(Date.now() - 45 * 60 * 1000),
        plan: 'premium'
      }
    ];

    setStats(mockStats);
    setRegionalData(mockRegionalData);
    setRecentActivities(mockActivities);
    setTopSchools(mockTopSchools);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_attention': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'school_registration': return <FiMapPin className="h-4 w-4" />;
      case 'user_signup': return <FiUserCheck className="h-4 w-4" />;
      case 'system_alert': return <FiAlertCircle className="h-4 w-4" />;
      case 'payment': return <FiDollarSign className="h-4 w-4" />;
      case 'upgrade': return <FiTrendingUp className="h-4 w-4" />;
      default: return <FiActivity className="h-4 w-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      case 'premium': return 'text-blue-600 bg-blue-100';
      case 'basic': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}! Manage your global education network.</p>
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
            href="/super-admin/reports"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiBarChart className="h-4 w-4" />
            Global Reports
          </Link>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiMapPin size={20} className="text-blue-600" />}
            title="Total Schools"
            value={stats.totalSchools}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiGlobe size={20} className="text-green-600" />}
            title="Regions"
            value={stats.totalRegions}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-purple-600" />}
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiServer size={20} className="text-orange-600" />}
            title="System Uptime"
            value={stats.systemUptime}
          />
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiUserCheck size={20} className="text-indigo-600" />}
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiDollarSign size={20} className="text-green-600" />}
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiAlertCircle size={20} className="text-red-600" />}
            title="Critical Alerts"
            value={stats.criticalAlerts}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiClock size={20} className="text-yellow-600" />}
            title="Pending Approvals"
            value={stats.pendingApprovals}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Regional Performance */}
        <div className="xl:col-span-2">
          <Card title="Regional Performance" className="p-6">
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      <FiGlobe className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{region.region}</h4>
                      <p className="text-sm text-gray-600">{region.schools} schools • {region.students.toLocaleString()} students</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{region.performance}%</div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{region.attendance}%</div>
                        <div className="text-xs text-gray-500">Attendance</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(region.status)}`}>
                        {region.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Activities */}
        <div>
          <Card title="System Activities" className="p-6">
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
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{activity.timestamp.toLocaleTimeString()}</span>
                      {activity.region && <span>• {activity.region}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link 
                href="/super-admin/reports" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FiEye className="h-3 w-3" />
                View all activities
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Performing Schools */}
      <Card title="Top Performing Schools" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSchools.map((school) => (
            <div key={school.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{school.name}</h4>
                  <p className="text-sm text-gray-600">{school.region}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(school.plan)}`}>
                  {school.plan}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{school.students.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance:</span>
                  <span className="font-medium text-green-600">{school.performance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium text-blue-600">{school.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Global Management" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/super-admin/schools" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiMapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">School Management</h3>
              <p className="text-sm text-gray-600">Manage all schools</p>
            </div>
          </Link>

          <Link href="/super-admin/users" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiUsers className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">User Management</h3>
              <p className="text-sm text-gray-600">Global user oversight</p>
            </div>
          </Link>

          <Link href="/super-admin/regions" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiGlobe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Regional Management</h3>
              <p className="text-sm text-gray-600">Manage regions</p>
            </div>
          </Link>

          <Link href="/super-admin/settings" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiSettings className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium mb-1">System Settings</h3>
              <p className="text-sm text-gray-600">Global configuration</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard; 