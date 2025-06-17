'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiArrowDown, FiArrowUp, FiBarChart2, FiUsers, FiBookOpen, FiTrendingUp } from 'react-icons/fi';
import analyticsService, { SchoolAnalyticsData } from '@/services/analyticsService';

// Reusable stat card component
const StatCard = ({ title, value, description, icon, change, changeLabel }) => (
  <div className="bg-white p-5 rounded-lg shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="p-2 bg-blue-50 rounded-md text-blue-600">
        {icon}
      </div>
    </div>
    
    {typeof change !== 'undefined' && (
      <div className="mt-2 flex items-center">
        <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {change >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
          {Math.abs(change)}%
        </span>
        {changeLabel && <span className="text-xs text-gray-500 ml-2">{changeLabel}</span>}
      </div>
    )}
  </div>
);

// Subject performance card component
const SubjectPerformanceCard = ({ subject, averageScore, passRate, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend === 'up' ? <FiArrowUp /> : trend === 'down' ? <FiArrowDown /> : <FiTrendingUp />;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-800">{subject}</h3>
        <div className={`flex items-center ${trendColor}`}>
          {trendIcon}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Average Score</span>
            <span>{averageScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${averageScore}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Pass Rate</span>
            <span>{passRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${passRate}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Teacher performance card component
const TeacherPerformanceCard = ({ teacherName, averageClassScore, homeworkAssigned, gradingCompletionRate }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-800 mb-2">{teacherName}</h3>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="text-center">
          <p className="text-xs text-gray-500">Avg. Score</p>
          <p className="text-sm font-medium">{averageClassScore}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">HW Assigned</p>
          <p className="text-sm font-medium">{homeworkAssigned}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Grading Rate</p>
          <p className="text-sm font-medium">{gradingCompletionRate}%</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-blue-600 h-1.5 rounded-full" 
          style={{ width: `${averageClassScore}%` }}
        ></div>
      </div>
    </div>
  );
};

// Class comparison component
const ClassComparisonTable = ({ classes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Homework Completion
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((classItem, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {classItem.className}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-2">{classItem.averageScore}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        classItem.averageScore >= 80 ? 'bg-green-500' : 
                        classItem.averageScore >= 70 ? 'bg-blue-500' : 
                        classItem.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${classItem.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-2">{classItem.homeworkCompletionRate}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${classItem.homeworkCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SchoolAdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // In a real application, we would get the actual school ID from context
        const schoolId = 'current-school';
        const data = await analyticsService.getSchoolAnalytics(schoolId);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Unable to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeFrame]);

  const handleExportReport = async () => {
    try {
      const reportUrl = await analyticsService.generateReport('school-analytics', {
        schoolId: 'current-school',
        timeFrame
      });
      
      window.open(reportUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Unable to generate report. Please try again later.');
    }
  };

  const handleScheduleReport = () => {
    // This would open a modal for scheduling reports
    alert("Report scheduling functionality will be implemented here");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">School Performance Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive analytics across all classes and teachers</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                timeFrame === 'week'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeFrame === 'month'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                timeFrame === 'year'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiDownload className="mr-2" />
              Export Report
            </button>
            
            <button
              onClick={handleScheduleReport}
              className="inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              <FiBarChart2 className="mr-2" />
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
      
      {/* Key School Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="School Average Score"
          value={`${analyticsData.overallPerformance.averageScore}%`}
          icon={<FiBarChart2 size={20} />}
          change={2.1} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Pass Rate"
          value={`${analyticsData.overallPerformance.passRate}%`}
          icon={<FiUsers size={20} />}
          change={1.5} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Homework Completion"
          value={`${analyticsData.overallPerformance.homeworkCompletionRate}%`}
          icon={<FiBookOpen size={20} />}
          change={3.2} // Example change value
          changeLabel="vs. last period"
        />
      </div>
      
      {/* Subject Performance */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.subjectPerformance.map((subject, index) => (
            <SubjectPerformanceCard 
              key={index}
              subject={subject.subject}
              averageScore={subject.averageScore}
              passRate={subject.passRate}
              trend={subject.trend}
            />
          ))}
        </div>
      </div>
      
      {/* Class Comparison */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Comparison</h2>
        <ClassComparisonTable classes={analyticsData.classComparison} />
      </div>
      
      {/* Teacher Performance */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.teacherStats.map((teacher, index) => (
            <TeacherPerformanceCard 
              key={index}
              teacherName={teacher.teacherName}
              averageClassScore={teacher.averageClassScore}
              homeworkAssigned={teacher.homeworkAssigned}
              gradingCompletionRate={teacher.gradingCompletionRate}
            />
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Time-series visualization will be implemented here</p>
          <p className="text-sm mt-2">Showing performance trends over the selected time period</p>
        </div>
      </div>
      
      {/* Improvement Recommendations */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">School Improvement Recommendations</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 mr-2">1</span>
            <span>Focus on improving Science performance across all classes, where scores are declining.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 mr-2">2</span>
            <span>Consider additional support for Grade 9B, which has the lowest completion rates.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 mr-2">3</span>
            <span>Review Mathematics curriculum as this subject has the widest performance variance across classes.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard; 