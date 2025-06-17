'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiArrowDown, FiArrowUp, FiClock, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import StudentPerformanceChart from '@/components/charts/StudentPerformanceChart';
import SubjectPerformanceRadar from '@/components/charts/SubjectPerformanceRadar';
import StrengthWeaknessChart from '@/components/charts/StrengthWeaknessChart';
import analyticsService, { StudentAnalyticsData } from '@/services/analyticsService';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
}> = ({ title, value, description, icon, change, changeLabel }) => (
  <div className="bg-white p-5 rounded-lg shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">
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

const StudentAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<StudentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // In a real application, we would get the actual student ID from authentication/context
        const studentId = 'current-student';
        const data = await analyticsService.getStudentAnalytics(studentId);
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
      const reportUrl = await analyticsService.generateReport('student-progress', {
        studentId: 'current-student',
        timeFrame
      });
      
      // Open report in new tab or trigger download
      window.open(reportUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Unable to generate report. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
          <h1 className="text-2xl font-bold text-gray-800">My Performance Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your progress and identify areas for improvement</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                timeFrame === 'week'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeFrame === 'month'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                timeFrame === 'year'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <button
            onClick={handleExportReport}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Average Score"
          value={`${analyticsData.averageScore}%`}
          icon={<FiFileText size={20} />}
          change={3.2} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${analyticsData.completionRate}%`}
          icon={<FiCheckCircle size={20} />}
          change={-1.5} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="On-Time Submissions"
          value={`${analyticsData.submissionTrend.onTime}%`}
          icon={<FiClock size={20} />}
          change={2.8} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Positive Feedback"
          value={`${analyticsData.feedback.positive}%`}
          icon={<FiAlertCircle size={20} />}
          change={5.4} // Example change value
          changeLabel="vs. last period"
        />
      </div>
      
      {/* Performance Over Time Chart */}
      <div className="mb-6">
        <StudentPerformanceChart 
          data={analyticsData.performanceOverTime} 
          title="Performance Trend" 
        />
      </div>
      
      {/* Two-column layout for additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Subject Performance Radar */}
        <SubjectPerformanceRadar 
          data={analyticsData.subjectPerformance}
          title="Performance By Subject"
        />
        
        {/* Strengths & Weaknesses */}
        <StrengthWeaknessChart 
          data={analyticsData.topicPerformance}
          title="Strengths & Improvement Areas"
        />
      </div>
      
      {/* Submission Trends */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Trends</h3>
        <div className="flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0">
          <div className="text-center">
            <p className="text-sm text-gray-500">On Time</p>
            <p className="text-2xl font-bold text-green-600">{analyticsData.submissionTrend.onTime}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Late</p>
            <p className="text-2xl font-bold text-yellow-500">{analyticsData.submissionTrend.late}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Missed</p>
            <p className="text-2xl font-bold text-red-500">{analyticsData.submissionTrend.missed}%</p>
          </div>
        </div>
      </div>
      
      {/* Feedback Distribution */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Teacher Feedback Distribution</h3>
        <div className="flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0">
          <div className="text-center">
            <p className="text-sm text-gray-500">Positive</p>
            <p className="text-2xl font-bold text-green-600">{analyticsData.feedback.positive}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Neutral</p>
            <p className="text-2xl font-bold text-blue-500">{analyticsData.feedback.neutral}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Constructive</p>
            <p className="text-2xl font-bold text-amber-500">{analyticsData.feedback.constructive}%</p>
          </div>
        </div>
      </div>
      
      {/* Personalized Recommendations */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-indigo-800 mb-2">Personalized Recommendations</h3>
        <ul className="space-y-2 text-indigo-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">1</span>
            <span>Focus more on Geometry topics to improve your Mathematics score.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">2</span>
            <span>Review your Chemistry notes and practice more problems - this seems to be an area for improvement.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">3</span>
            <span>Continue your excellent work in Literature - you're showing strong comprehension skills.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentAnalyticsDashboard; 