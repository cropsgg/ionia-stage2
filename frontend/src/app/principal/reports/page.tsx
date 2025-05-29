 'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiBarChart, FiTrendingUp, FiDownload, FiCalendar, FiFilter,
  FiUsers, FiBook, FiTarget, FiStar, FiActivity, FiPieChart,
  FiFileText, FiRefreshCw, FiEye, FiSettings, FiClock
} from 'react-icons/fi';

interface ReportData {
  id: string;
  title: string;
  type: 'performance' | 'attendance' | 'financial' | 'enrollment' | 'behavior';
  dateRange: string;
  generatedBy: string;
  generatedAt: Date;
  status: 'ready' | 'generating' | 'scheduled';
  summary: string;
  keyMetrics: {
    label: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

const PrincipalReportsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const mockReports: ReportData[] = [
      {
        id: '1',
        title: 'Monthly Performance Report',
        type: 'performance',
        dateRange: 'November 2024',
        generatedBy: 'System',
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'ready',
        summary: 'Overall school performance shows 3.2% improvement compared to last month',
        keyMetrics: [
          { label: 'Average Grade', value: '82.3%', change: 2.1, trend: 'up' },
          { label: 'Pass Rate', value: '94.5%', change: 1.8, trend: 'up' },
          { label: 'Student Satisfaction', value: '4.2/5', change: 0.3, trend: 'up' }
        ]
      },
      {
        id: '2',
        title: 'Attendance Analytics',
        type: 'attendance',
        dateRange: 'November 2024',
        generatedBy: 'System',
        generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'ready',
        summary: 'School attendance rate maintained above 90% across all grades',
        keyMetrics: [
          { label: 'Overall Attendance', value: '94.2%', change: -0.5, trend: 'down' },
          { label: 'Chronic Absenteeism', value: '5.8%', change: -1.2, trend: 'up' },
          { label: 'On-Time Rate', value: '89.1%', change: 2.3, trend: 'up' }
        ]
      },
      {
        id: '3',
        title: 'Financial Summary',
        type: 'financial',
        dateRange: 'Q2 2024',
        generatedBy: user?.name || 'Principal',
        generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'ready',
        summary: 'Budget utilization at 67% with positive variance in key areas',
        keyMetrics: [
          { label: 'Budget Used', value: '$2.4M', change: 5.2, trend: 'up' },
          { label: 'Remaining Budget', value: '$1.2M', change: -5.2, trend: 'down' },
          { label: 'Cost per Student', value: '$1,890', change: -2.1, trend: 'up' }
        ]
      },
      {
        id: '4',
        title: 'Enrollment Trends',
        type: 'enrollment',
        dateRange: '2024-2025',
        generatedBy: 'Admissions',
        generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'ready',
        summary: 'New enrollments up 8% compared to previous academic year',
        keyMetrics: [
          { label: 'Total Students', value: '1,247', change: 8.2, trend: 'up' },
          { label: 'New Enrollments', value: '156', change: 12.5, trend: 'up' },
          { label: 'Retention Rate', value: '96.8%', change: 1.4, trend: 'up' }
        ]
      }
    ];

    setReports(mockReports);
  }, [user]);

  const handleGenerateReport = (type: string) => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-blue-600 bg-blue-100';
      case 'attendance': return 'text-green-600 bg-green-100';
      case 'financial': return 'text-purple-600 bg-purple-100';
      case 'enrollment': return 'text-orange-600 bg-orange-100';
      case 'behavior': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-yellow-600 bg-yellow-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <FiTrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <div className="h-3 w-3" />;
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedCategory === 'all') return true;
    return report.type === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into school performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button 
            onClick={() => handleGenerateReport('custom')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={isGenerating}
          >
            <FiFileText className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-blue-600" />}
            title="Total Students"
            value={1247}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-green-600" />}
            title="Attendance Rate"
            value={94.2}
            unit="%"
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiStar size={20} className="text-yellow-600" />}
            title="Avg Performance"
            value={82.3}
            unit="%"
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-purple-600" />}
            title="Active Classes"
            value={42}
          />
        </Card>
      </div>

      {/* Report Categories */}
      <Card title="Report Categories" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button 
            onClick={() => handleGenerateReport('performance')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 text-center transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiBarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-1">Performance</h3>
            <p className="text-sm text-gray-600">Academic results & trends</p>
          </button>

          <button 
            onClick={() => handleGenerateReport('attendance')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 text-center transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-1">Attendance</h3>
            <p className="text-sm text-gray-600">Student attendance analytics</p>
          </button>

          <button 
            onClick={() => handleGenerateReport('financial')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 text-center transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiPieChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-1">Financial</h3>
            <p className="text-sm text-gray-600">Budget & expenditure</p>
          </button>

          <button 
            onClick={() => handleGenerateReport('enrollment')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 text-center transition-colors"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiActivity className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium mb-1">Enrollment</h3>
            <p className="text-sm text-gray-600">Student enrollment trends</p>
          </button>

          <button 
            onClick={() => handleGenerateReport('behavior')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-red-50 text-center transition-colors"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiTarget className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-medium mb-1">Behavior</h3>
            <p className="text-sm text-gray-600">Disciplinary reports</p>
          </button>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <FiFilter className="h-4 w-4 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Reports</option>
          <option value="performance">Performance</option>
          <option value="attendance">Attendance</option>
          <option value="financial">Financial</option>
          <option value="enrollment">Enrollment</option>
          <option value="behavior">Behavior</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                  <FiBarChart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{report.dateRange}</span>
                    <span>•</span>
                    <span>Generated by {report.generatedBy}</span>
                    <span>•</span>
                    <span>{report.generatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                  <FiEye className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                  <FiDownload className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{report.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.keyMetrics.map((metric, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    {metric.change && getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                    {metric.change && (
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrincipalReportsPage;