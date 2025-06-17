'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiArrowDown, FiArrowUp, FiClock, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import ClassPerformanceChart from '@/components/charts/ClassPerformanceChart';
import StudentAttentionNeeds from '@/components/charts/StudentAttentionNeeds';
import analyticsService, { TeacherAnalyticsData } from '@/services/analyticsService';
import { useRouter } from 'next/navigation';

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

const TeacherAnalyticsDashboard = () => {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<TeacherAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'averageScore' | 'completionRate' | 'improvementRate'>('averageScore');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // In a real application, we would get the actual teacher ID from authentication/context
        const teacherId = 'current-teacher';
        const data = await analyticsService.getTeacherAnalytics(teacherId);
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
      const reportUrl = await analyticsService.generateReport('teacher-analytics', {
        teacherId: 'current-teacher',
        timeFrame
      });
      
      // Open report in new tab or trigger download
      window.open(reportUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Unable to generate report. Please try again later.');
    }
  };

  const handleStudentClick = (studentId: string) => {
    // Navigate to student detail page
    router.push(`/teacher/students/${studentId}`);
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
          <h1 className="text-2xl font-bold text-gray-800">Teacher Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor class performance and identify students needing support</p>
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
          value={`${analyticsData.classPerformance.reduce((sum, c) => sum + c.averageScore, 0) / analyticsData.classPerformance.length}%`}
          icon={<FiUsers size={20} />}
          change={2.5} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${analyticsData.classPerformance.reduce((sum, c) => sum + c.completionRate, 0) / analyticsData.classPerformance.length}%`}
          icon={<FiCheckCircle size={20} />}
          change={1.8} // Example change value
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Students Needing Attention"
          value={analyticsData.studentProgress.filter(s => s.needsAttention).length}
          description={`Out of ${analyticsData.studentProgress.length} students`}
          icon={<FiAlertCircle size={20} />}
          change={-2.0} // Example change value - negative is good here
          changeLabel="vs. last period"
        />
        
        <StatCard
          title="Pending Grades"
          value={analyticsData.gradingStats.pendingGrades}
          description={`${analyticsData.gradingStats.completedGrades} completed`}
          icon={<FiClock size={20} />}
          change={-5.0} // Example change value
          changeLabel="vs. last period"
        />
      </div>
      
      {/* Class Performance Chart */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Class Performance Comparison</h3>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSelectedMetric('averageScore')}
                className={`px-3 py-1 text-xs font-medium rounded-l-md border ${
                  selectedMetric === 'averageScore'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Score
              </button>
              <button
                onClick={() => setSelectedMetric('completionRate')}
                className={`px-3 py-1 text-xs font-medium border-t border-b ${
                  selectedMetric === 'completionRate'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Completion
              </button>
              <button
                onClick={() => setSelectedMetric('improvementRate')}
                className={`px-3 py-1 text-xs font-medium rounded-r-md border ${
                  selectedMetric === 'improvementRate'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Improvement
              </button>
            </div>
          </div>
          
          <ClassPerformanceChart 
            data={analyticsData.classPerformance} 
            metric={selectedMetric}
            title="" // Title is handled above
          />
        </div>
      </div>
      
      {/* Two-column layout for additional insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Students Needing Attention */}
        <StudentAttentionNeeds 
          students={analyticsData.studentProgress}
          onStudentClick={handleStudentClick}
        />
        
        {/* Challenging Topics */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Challenging Topics</h3>
            <p className="text-sm text-gray-500">Topics where students are struggling the most</p>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {analyticsData.topicChallenges
                .sort((a, b) => b.failRate - a.failRate)
                .map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{topic.topic}</h4>
                        <p className="text-xs text-gray-500">Average Score: {topic.averageScore}%</p>
                      </div>
                      <div className="text-red-500 text-sm font-medium">
                        {topic.failRate}% fail rate
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          topic.averageScore >= 70 ? 'bg-green-600' :
                          topic.averageScore >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${topic.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Grading Stats */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Grading Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Average Grading Time</p>
            <p className="text-xl font-semibold text-indigo-700">{analyticsData.gradingStats.averageGradingTime} hours</p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Pending Grades</p>
            <p className="text-xl font-semibold text-amber-600">{analyticsData.gradingStats.pendingGrades}</p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Completed Grades</p>
            <p className="text-xl font-semibold text-green-600">{analyticsData.gradingStats.completedGrades}</p>
          </div>
        </div>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-indigo-600"
            style={{ 
              width: `${(analyticsData.gradingStats.completedGrades / 
                (analyticsData.gradingStats.completedGrades + analyticsData.gradingStats.pendingGrades)) * 100}%` 
            }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-500 text-right">
          {((analyticsData.gradingStats.completedGrades / 
            (analyticsData.gradingStats.completedGrades + analyticsData.gradingStats.pendingGrades)) * 100).toFixed(1)}% complete
        </p>
      </div>
      
      {/* Action Recommendations */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-indigo-800 mb-2">Recommended Actions</h3>
        <ul className="space-y-2 text-indigo-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">1</span>
            <span>Review student understanding of <strong>Calculus</strong> concepts - this is the most challenging topic.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">2</span>
            <span>Schedule check-ins with the 3 students whose performance is declining.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-indigo-800 mr-2">3</span>
            <span>Grade 5 pending submissions to provide timely feedback.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherAnalyticsDashboard; 