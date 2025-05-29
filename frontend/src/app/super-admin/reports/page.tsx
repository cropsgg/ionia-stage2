'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiBarChart, FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown,
  FiUsers, FiMapPin, FiDollarSign, FiTarget, FiStar, FiClock,
  FiGlobe, FiFilter, FiRefreshCw, FiEye, FiPieChart, FiActivity
} from 'react-icons/fi';

interface ReportMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalUsers: number;
  userGrowth: number;
  totalSchools: number;
  schoolGrowth: number;
  avgPerformance: number;
  performanceChange: number;
  avgAttendance: number;
  attendanceChange: number;
  systemUptime: number;
}

interface RegionalReport {
  region: string;
  schools: number;
  students: number;
  teachers: number;
  revenue: number;
  growth: number;
  performance: number;
  attendance: number;
}

const SuperAdminReportsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [regionalReports, setRegionalReports] = useState<RegionalReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReportType, setSelectedReportType] = useState('overview');

  useEffect(() => {
    // Mock comprehensive metrics
    const mockMetrics: ReportMetrics = {
      totalRevenue: 2847500,
      revenueGrowth: 12.5,
      totalUsers: 137826,
      userGrowth: 8.3,
      totalSchools: 247,
      schoolGrowth: 5.2,
      avgPerformance: 84.2,
      performanceChange: 2.1,
      avgAttendance: 92.7,
      attendanceChange: 1.8,
      systemUptime: 99.98
    };

    const mockRegionalReports: RegionalReport[] = [
      {
        region: 'North America',
        schools: 89,
        students: 45234,
        teachers: 2876,
        revenue: 1245000,
        growth: 15.2,
        performance: 86.5,
        attendance: 94.2
      },
      {
        region: 'Europe',
        schools: 67,
        students: 32145,
        teachers: 2143,
        revenue: 892000,
        growth: 11.8,
        performance: 82.1,
        attendance: 91.8
      },
      {
        region: 'Asia Pacific',
        schools: 54,
        students: 28967,
        teachers: 1845,
        revenue: 567000,
        growth: 18.7,
        performance: 88.3,
        attendance: 95.1
      },
      {
        region: 'Latin America',
        schools: 23,
        students: 12456,
        teachers: 789,
        revenue: 156000,
        growth: 8.4,
        performance: 78.9,
        attendance: 89.4
      },
      {
        region: 'Middle East',
        schools: 14,
        students: 9745,
        teachers: 634,
        revenue: 98500,
        growth: 22.3,
        performance: 81.7,
        attendance: 92.3
      }
    ];

    setMetrics(mockMetrics);
    setRegionalReports(mockRegionalReports);
  }, [selectedPeriod]);

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <FiTrendingUp className="h-4 w-4" /> : <FiTrendingDown className="h-4 w-4" />;
  };

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights across all schools and regions</p>
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiDownload className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(metrics.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getGrowthColor(metrics.revenueGrowth)}`}>
                {metrics.revenueGrowth > 0 ? '+' : ''}{metrics.revenueGrowth}%
              </span>
              <span className={getGrowthColor(metrics.revenueGrowth)}>
                {getGrowthIcon(metrics.revenueGrowth)}
              </span>
              <FiDollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getGrowthColor(metrics.userGrowth)}`}>
                {metrics.userGrowth > 0 ? '+' : ''}{metrics.userGrowth}%
              </span>
              <span className={getGrowthColor(metrics.userGrowth)}>
                {getGrowthIcon(metrics.userGrowth)}
              </span>
              <FiUsers className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalSchools}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getGrowthColor(metrics.schoolGrowth)}`}>
                {metrics.schoolGrowth > 0 ? '+' : ''}{metrics.schoolGrowth}%
              </span>
              <span className={getGrowthColor(metrics.schoolGrowth)}>
                {getGrowthIcon(metrics.schoolGrowth)}
              </span>
              <FiMapPin className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiStar size={20} className="text-yellow-600" />}
            title="Avg Performance"
            value={metrics.avgPerformance}
            unit="%"
          />
          <div className={`flex items-center gap-1 mt-2 text-sm ${getGrowthColor(metrics.performanceChange)}`}>
            {getGrowthIcon(metrics.performanceChange)}
            {metrics.performanceChange > 0 ? '+' : ''}{metrics.performanceChange}% vs last period
          </div>
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-green-600" />}
            title="Avg Attendance"
            value={metrics.avgAttendance}
            unit="%"
          />
          <div className={`flex items-center gap-1 mt-2 text-sm ${getGrowthColor(metrics.attendanceChange)}`}>
            {getGrowthIcon(metrics.attendanceChange)}
            {metrics.attendanceChange > 0 ? '+' : ''}{metrics.attendanceChange}% vs last period
          </div>
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiActivity size={20} className="text-orange-600" />}
            title="System Uptime"
            value={metrics.systemUptime}
            unit="%"
          />
          <div className="text-sm text-green-600 mt-2">
            Excellent system reliability
          </div>
        </Card>
      </div>

      {/* Report Type Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedReportType('overview')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              selectedReportType === 'overview' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiBarChart className="h-8 w-8 mx-auto mb-2" />
            <h4 className="font-medium">System Overview</h4>
            <p className="text-sm text-gray-600">Global metrics & KPIs</p>
          </button>

          <button
            onClick={() => setSelectedReportType('regional')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              selectedReportType === 'regional' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiGlobe className="h-8 w-8 mx-auto mb-2" />
            <h4 className="font-medium">Regional Analysis</h4>
            <p className="text-sm text-gray-600">Performance by region</p>
          </button>

          <button
            onClick={() => setSelectedReportType('financial')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              selectedReportType === 'financial' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiDollarSign className="h-8 w-8 mx-auto mb-2" />
            <h4 className="font-medium">Financial Reports</h4>
            <p className="text-sm text-gray-600">Revenue & subscriptions</p>
          </button>

          <button
            onClick={() => setSelectedReportType('usage')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              selectedReportType === 'usage' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiPieChart className="h-8 w-8 mx-auto mb-2" />
            <h4 className="font-medium">Usage Analytics</h4>
            <p className="text-sm text-gray-600">User engagement metrics</p>
          </button>
        </div>
      </Card>

      {/* Regional Performance Report */}
      <Card title="Regional Performance Analysis" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Region</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Schools</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Students</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Teachers</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Growth</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Performance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {regionalReports.map((report, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{report.region}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">{report.schools}</td>
                  <td className="py-3 px-4 text-right">{report.students.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{report.teachers.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">${report.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`flex items-center justify-end gap-1 ${getGrowthColor(report.growth)}`}>
                      {getGrowthIcon(report.growth)}
                      {report.growth > 0 ? '+' : ''}{report.growth}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-green-600">{report.performance}%</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-blue-600">{report.attendance}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Options */}
      <Card title="Export Reports" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Comprehensive Report</h4>
            <p className="text-sm text-gray-600 mb-4">Complete analytics across all metrics and regions</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiDownload className="h-4 w-4" />
              Download PDF
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
            <p className="text-sm text-gray-600 mb-4">Raw data for custom analysis and reporting</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiDownload className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Executive Summary</h4>
            <p className="text-sm text-gray-600 mb-4">High-level overview for stakeholders</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <FiDownload className="h-4 w-4" />
              Generate Summary
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminReportsPage; 