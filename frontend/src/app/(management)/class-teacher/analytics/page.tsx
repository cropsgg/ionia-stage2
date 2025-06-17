'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiArrowDown, FiArrowUp, FiUsers, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';
import AttendanceEngagementChart from '@/components/charts/AttendanceEngagementChart';
import SubjectPerformanceRadar from '@/components/charts/SubjectPerformanceRadar';
import StudentAttentionNeeds from '@/components/charts/StudentAttentionNeeds';
import analyticsService, { 
  ClassAttendanceData, 
  SubjectPerformanceData, 
  StudentProgressData 
} from '@/services/analyticsService';
import { useRouter } from 'next/navigation';

type ClassTeacherDashboardProps = {
  classId?: string;
};

// Reusable stat card component
const StatCard = ({ title, value, description, icon, change, changeLabel, status = 'neutral' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-semibold ${getStatusColor()}`}>{value}</p>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="p-2 bg-green-50 rounded-md text-green-600">
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
};

const ClassTeacherDashboard: React.FC<ClassTeacherDashboardProps> = ({ classId = 'current-class' }) => {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<ClassAttendanceData | null>(null);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformanceData[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch attendance data
        const attendance = await analyticsService.getClassAttendance(classId);
        setAttendanceData(attendance);
        
        // Fetch class analytics to get subject and student data
        const classData = await analyticsService.getClassAnalytics(classId);
        
        // Extract subject performance from the class data
        // This is a simplification; in a real app, we'd have specific endpoints
        const subjects: SubjectPerformanceData[] = [
          { subject: 'Mathematics', score: 78, average: 72 },
          { subject: 'Science', score: 82, average: 75 },
          { subject: 'English', score: 75, average: 71 },
          { subject: 'History', score: 68, average: 65 },
          { subject: 'Art', score: 88, average: 82 }
        ];
        setSubjectPerformance(subjects);
        
        // Extract student progress data
        setStudentProgress(classData.studentProgress);
      } catch (err) {
        console.error('Failed to fetch class teacher analytics data:', err);
        setError('Unable to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [classId, timeFrame]);

  const handleExportReport = async () => {
    try {
      const reportUrl = await analyticsService.generateReport('class-teacher-report', {
        classId,
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
    router.push(`/class-teacher/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">No analytics data available for this class.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Overview Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive view across all subjects for your class</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                timeFrame === 'week'
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeFrame === 'month'
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                timeFrame === 'year'
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <button
            onClick={handleExportReport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceData.attendanceRate}%`}
          icon={<FiUsers size={20} />}
          change={attendanceData.attendanceTrend === 'improving' ? 2.3 : (attendanceData.attendanceTrend === 'declining' ? -1.8 : 0)}
          changeLabel="vs. last period"
          status={attendanceData.attendanceRate >= 90 ? 'positive' : attendanceData.attendanceRate >= 80 ? 'neutral' : 'negative'}
        />
        
        <StatCard
          title="Highly Engaged"
          value={`${Math.round((attendanceData.engagementSummary.highlyEngaged / 
            (attendanceData.engagementSummary.highlyEngaged + 
             attendanceData.engagementSummary.moderatelyEngaged + 
             attendanceData.engagementSummary.minimallyEngaged)) * 100)}%`}
          icon={<FiCheckCircle size={20} />}
          change={1.5}
          changeLabel="vs. last period"
          status="positive"
        />
        
        <StatCard
          title="Needs Attention"
          value={studentProgress.filter(s => s.needsAttention).length}
          description={`Out of ${studentProgress.length} students`}
          icon={<FiAlertTriangle size={20} />}
          change={-2.0}
          changeLabel="vs. last period"
          status="warning"
        />
        
        <StatCard
          title="Average Performance"
          value={`${Math.round(subjectPerformance.reduce((sum, s) => sum + s.score, 0) / subjectPerformance.length)}%`}
          icon={<FiClock size={20} />}
          change={0.8}
          changeLabel="vs. last period"
          status="neutral"
        />
      </div>
      
      {/* Attendance & Engagement Chart */}
      <div className="mb-6">
        <AttendanceEngagementChart 
          attendanceData={attendanceData.attendanceData}
          engagementSummary={attendanceData.engagementSummary}
          title="Class Attendance & Engagement"
          period={`Last ${attendanceData.attendanceData.length} days`}
        />
      </div>
      
      {/* Two-column layout for additional insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Subject Performance Radar */}
        <SubjectPerformanceRadar 
          data={subjectPerformance}
          title="Performance Across Subjects"
        />
        
        {/* Students Needing Attention */}
        <StudentAttentionNeeds 
          students={studentProgress}
          title="Students Requiring Support"
          onStudentClick={handleStudentClick}
        />
      </div>
      
      {/* Insights & Recommendations */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-800 mb-2">Class Insights</h3>
        <ul className="space-y-2 text-green-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 mr-2">1</span>
            <span>Science shows the strongest performance across the class, with an average score of 82%.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 mr-2">2</span>
            <span>History requires additional focus, as it has the lowest average score at 68%.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 mr-2">3</span>
            <span>Consider implementing extra support sessions for the 3 students who are showing declining performance.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 mr-2">4</span>
            <span>Attendance is {attendanceData.attendanceRate >= 90 ? 'excellent' : attendanceData.attendanceRate >= 80 ? 'good but could improve' : 'concerning and requires attention'}.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClassTeacherDashboard; 