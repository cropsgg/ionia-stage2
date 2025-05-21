import axios from 'axios';
import { ScheduleReportData } from '@/components/report/ScheduleReportModal';

// Student Analytics Types
export type StudentPerformanceData = {
  date: string;
  score: number;
  average: number;
  classAverage: number;
};

export type SubjectPerformanceData = {
  subject: string;
  score: number;
  average: number;
};

export type TopicPerformanceData = {
  topic: string;
  score: number;
  isStrength: boolean;
};

export type StudentAnalyticsData = {
  performanceOverTime: StudentPerformanceData[];
  subjectPerformance: SubjectPerformanceData[];
  topicPerformance: TopicPerformanceData[];
  completionRate: number;
  averageScore: number;
  submissionTrend: {
    onTime: number;
    late: number;
    missed: number;
  };
  feedback: {
    positive: number;
    neutral: number;
    constructive: number;
  };
};

// Teacher Analytics Types
export type ClassPerformanceData = {
  className: string;
  averageScore: number;
  completionRate: number;
  improvementRate: number;
};

export type StudentProgressData = {
  studentId: string;
  studentName: string;
  averageScore: number;
  completionRate: number;
  trend: 'improving' | 'stable' | 'declining';
  needsAttention: boolean;
};

export type TeacherAnalyticsData = {
  classPerformance: ClassPerformanceData[];
  studentProgress: StudentProgressData[];
  topicChallenges: {
    topic: string;
    averageScore: number;
    failRate: number;
  }[];
  gradingStats: {
    averageGradingTime: number;
    pendingGrades: number;
    completedGrades: number;
  };
};

// School Admin Analytics Types
export type SchoolPerformanceData = {
  subject: string;
  averageScore: number;
  passRate: number;
  trend: 'up' | 'down' | 'stable';
};

export type ClassComparisonData = {
  className: string;
  averageScore: number;
  homeworkCompletionRate: number;
};

export type SchoolAnalyticsData = {
  overallPerformance: {
    averageScore: number;
    passRate: number;
    homeworkCompletionRate: number;
  };
  subjectPerformance: SchoolPerformanceData[];
  classComparison: ClassComparisonData[];
  teacherStats: {
    teacherId: string;
    teacherName: string;
    averageClassScore: number;
    homeworkAssigned: number;
    gradingCompletionRate: number;
  }[];
};

// Attendance & Engagement Types
export type AttendanceData = {
  date: string;
  present: number;
  absent: number;
  late: number;
};

export type EngagementSummary = {
  highlyEngaged: number;
  moderatelyEngaged: number;
  minimallyEngaged: number;
};

export type ClassAttendanceData = {
  attendanceData: AttendanceData[];
  engagementSummary: EngagementSummary;
  attendanceRate: number;
  attendanceTrend: 'improving' | 'stable' | 'declining';
};

// Analytics Service
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Mock data generators (will be replaced with actual API calls)
const generateMockStudentAnalytics = (): StudentAnalyticsData => {
  // Mock data for student performance over time
  const performanceOverTime: StudentPerformanceData[] = [];
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - 7 * i);
    performanceOverTime.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(60 + Math.random() * 35),
      average: Math.floor(65 + Math.random() * 15),
      classAverage: Math.floor(60 + Math.random() * 15)
    });
  }
  
  // Mock data for subject performance
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  const subjectPerformance: SubjectPerformanceData[] = subjects.map(subject => ({
    subject,
    score: Math.floor(50 + Math.random() * 45),
    average: Math.floor(55 + Math.random() * 25)
  }));
  
  // Mock data for topic performance
  const topics = [
    'Algebra', 'Geometry', 'Calculus', 'Biology', 'Chemistry',
    'Grammar', 'Literature', 'World History', 'Geography', 'Painting'
  ];
  const topicPerformance: TopicPerformanceData[] = topics.map(topic => {
    const score = Math.floor(40 + Math.random() * 55);
    return {
      topic,
      score,
      isStrength: score >= 70
    };
  });
  
  return {
    performanceOverTime: performanceOverTime.reverse(), // newest date first
    subjectPerformance,
    topicPerformance: topicPerformance.sort((a, b) => b.score - a.score),
    completionRate: Math.floor(75 + Math.random() * 20),
    averageScore: Math.floor(65 + Math.random() * 20),
    submissionTrend: {
      onTime: Math.floor(70 + Math.random() * 25),
      late: Math.floor(5 + Math.random() * 15),
      missed: Math.floor(1 + Math.random() * 10)
    },
    feedback: {
      positive: Math.floor(60 + Math.random() * 35),
      neutral: Math.floor(10 + Math.random() * 20),
      constructive: Math.floor(5 + Math.random() * 15)
    }
  };
};

const generateMockTeacherAnalytics = (): TeacherAnalyticsData => {
  // Mock data for class performance
  const classes = ['Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 9C'];
  const classPerformance: ClassPerformanceData[] = classes.map(className => ({
    className,
    averageScore: Math.floor(60 + Math.random() * 25),
    completionRate: Math.floor(70 + Math.random() * 25),
    improvementRate: Math.floor(-5 + Math.random() * 15)
  }));
  
  // Mock data for student progress
  const studentNames = [
    'Emma Johnson', 'Noah Smith', 'Olivia Williams', 'Liam Brown',
    'Ava Jones', 'Lucas Garcia', 'Sophia Miller', 'Mason Davis'
  ];
  const studentProgress: StudentProgressData[] = studentNames.map((name, index) => {
    const averageScore = Math.floor(55 + Math.random() * 40);
    const completionRate = Math.floor(65 + Math.random() * 30);
    const trendOptions: Array<'improving' | 'stable' | 'declining'> = ['improving', 'stable', 'declining'];
    const trend = trendOptions[Math.floor(Math.random() * trendOptions.length)];
    const needsAttention = averageScore < 70 || completionRate < 80 || trend === 'declining';
    
    return {
      studentId: `student-${index + 1}`,
      studentName: name,
      averageScore,
      completionRate,
      trend,
      needsAttention
    };
  });
  
  // Mock data for topic challenges
  const topics = ['Algebra', 'Geometry', 'Calculus', 'Biology', 'Chemistry'];
  const topicChallenges = topics.map(topic => ({
    topic,
    averageScore: Math.floor(50 + Math.random() * 30),
    failRate: Math.floor(10 + Math.random() * 25)
  }));
  
  return {
    classPerformance,
    studentProgress,
    topicChallenges,
    gradingStats: {
      averageGradingTime: Math.floor(24 + Math.random() * 24), // hours
      pendingGrades: Math.floor(Math.random() * 25),
      completedGrades: Math.floor(75 + Math.random() * 150)
    }
  };
};

const generateMockSchoolAnalytics = (): SchoolAnalyticsData => {
  // Mock data for subject performance
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art'];
  const trendOptions: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
  const subjectPerformance: SchoolPerformanceData[] = subjects.map(subject => ({
    subject,
    averageScore: Math.floor(60 + Math.random() * 25),
    passRate: Math.floor(75 + Math.random() * 20),
    trend: trendOptions[Math.floor(Math.random() * trendOptions.length)]
  }));
  
  // Mock data for class comparison
  const classes = ['Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B', 'Grade 9A', 'Grade 9B'];
  const classComparison: ClassComparisonData[] = classes.map(className => ({
    className,
    averageScore: Math.floor(60 + Math.random() * 25),
    homeworkCompletionRate: Math.floor(70 + Math.random() * 25)
  })).sort((a, b) => b.averageScore - a.averageScore);
  
  // Mock data for teacher stats
  const teachers = ['John Smith', 'Maria Garcia', 'Robert Johnson', 'Sarah Lee', 'David Wilson'];
  const teacherStats = teachers.map((name, index) => ({
    teacherId: `teacher-${index + 1}`,
    teacherName: name,
    averageClassScore: Math.floor(65 + Math.random() * 20),
    homeworkAssigned: Math.floor(10 + Math.random() * 20),
    gradingCompletionRate: Math.floor(75 + Math.random() * 20)
  }));
  
  return {
    overallPerformance: {
      averageScore: Math.floor(70 + Math.random() * 15),
      passRate: Math.floor(80 + Math.random() * 15),
      homeworkCompletionRate: Math.floor(75 + Math.random() * 20)
    },
    subjectPerformance,
    classComparison,
    teacherStats
  };
};

// Generate mock attendance data
const generateMockAttendanceData = (): ClassAttendanceData => {
  // Generate last 14 days of attendance data
  const attendanceData: AttendanceData[] = [];
  const now = new Date();
  const totalStudents = 25; // Example class size
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random but somewhat realistic attendance numbers
    const presentPercentage = 0.8 + Math.random() * 0.15 - 0.1; // 70-95% present
    const latePercentage = Math.random() * 0.1; // 0-10% late
    
    const present = Math.floor(totalStudents * presentPercentage);
    const late = Math.floor(totalStudents * latePercentage);
    const absent = totalStudents - present - late;
    
    attendanceData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present,
      absent,
      late
    });
  }
  
  // Generate engagement summary
  const engagementSummary: EngagementSummary = {
    highlyEngaged: Math.floor(totalStudents * (0.5 + Math.random() * 0.2)), // 50-70%
    moderatelyEngaged: Math.floor(totalStudents * (0.2 + Math.random() * 0.1)), // 20-30%
    minimallyEngaged: 0 // Will calculate below
  };
  
  // Ensure the total equals totalStudents
  engagementSummary.minimallyEngaged = totalStudents - 
    engagementSummary.highlyEngaged - 
    engagementSummary.moderatelyEngaged;
  
  // Calculate overall attendance rate
  let totalPresents = 0;
  let totalStudentDays = 0;
  
  attendanceData.forEach(day => {
    totalPresents += day.present;
    totalStudentDays += day.present + day.absent + day.late;
  });
  
  const attendanceRate = Math.round((totalPresents / totalStudentDays) * 100);
  
  // Determine trend - in a real app this would compare to previous periods
  const trendOptions: Array<'improving' | 'stable' | 'declining'> = ['improving', 'stable', 'declining'];
  const attendanceTrend = trendOptions[Math.floor(Math.random() * trendOptions.length)];
  
  return {
    attendanceData,
    engagementSummary,
    attendanceRate,
    attendanceTrend
  };
};

// Analytics service methods
const analyticsService = {
  // Student analytics
  getStudentAnalytics: async (studentId: string): Promise<StudentAnalyticsData> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/analytics/student/${studentId}`);
      // return response.data.data;
      
      // Mock implementation:
      return generateMockStudentAnalytics();
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      throw error;
    }
  },
  
  // Teacher analytics
  getTeacherAnalytics: async (teacherId: string): Promise<TeacherAnalyticsData> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/analytics/teacher/${teacherId}`);
      // return response.data.data;
      
      // Mock implementation:
      return generateMockTeacherAnalytics();
    } catch (error) {
      console.error('Error fetching teacher analytics:', error);
      throw error;
    }
  },
  
  // Class analytics for a specific class
  getClassAnalytics: async (classId: string): Promise<any> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/analytics/class/${classId}`);
      // return response.data.data;
      
      // Mock implementation:
      return {
        ...generateMockTeacherAnalytics(),
        classId
      };
    } catch (error) {
      console.error('Error fetching class analytics:', error);
      throw error;
    }
  },
  
  // School admin analytics
  getSchoolAnalytics: async (schoolId: string): Promise<SchoolAnalyticsData> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/analytics/school/${schoolId}`);
      // return response.data.data;
      
      // Mock implementation:
      return generateMockSchoolAnalytics();
    } catch (error) {
      console.error('Error fetching school analytics:', error);
      throw error;
    }
  },
  
  // Class attendance and engagement data
  getClassAttendance: async (classId: string): Promise<ClassAttendanceData> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/analytics/class/${classId}/attendance`);
      // return response.data.data;
      
      // Mock implementation:
      return generateMockAttendanceData();
    } catch (error) {
      console.error('Error fetching class attendance data:', error);
      throw error;
    }
  },
  
  // Generate reports
  generateReport: async (reportType: string, params: any): Promise<string> => {
    try {
      // In real implementation:
      // const response = await axios.post(`${API_URL}/reports/generate`, {
      //   reportType,
      //   params
      // });
      // return response.data.data.reportUrl;
      
      // Mock implementation:
      return 'https://example.com/reports/mock-report.pdf';
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
  
  // Schedule automated reports
  scheduleReport: async (scheduleData: ScheduleReportData): Promise<{ id: string; message: string }> => {
    try {
      // In real implementation:
      // const response = await axios.post(`${API_URL}/reports/schedule`, scheduleData);
      // return response.data.data;
      
      // Mock implementation:
      console.log('Scheduling report with settings:', scheduleData);
      return {
        id: `report-schedule-${Date.now()}`,
        message: `Report scheduled successfully. First delivery: ${getNextDeliveryDate(scheduleData)}`
      };
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  },
  
  // Get scheduled reports
  getScheduledReports: async (): Promise<Array<{
    id: string;
    reportType: string;
    frequency: string;
    nextDelivery: string;
    recipients: string[];
  }>> => {
    try {
      // In real implementation:
      // const response = await axios.get(`${API_URL}/reports/scheduled`);
      // return response.data.data;
      
      // Mock implementation:
      return [
        {
          id: 'report-schedule-1',
          reportType: 'Student Performance',
          frequency: 'Weekly (Monday)',
          nextDelivery: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
          recipients: ['teacher@example.com', 'admin@example.com']
        },
        {
          id: 'report-schedule-2',
          reportType: 'School Summary',
          frequency: 'Monthly (1st)',
          nextDelivery: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString(),
          recipients: ['principal@example.com']
        }
      ];
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  },
  
  // Delete a scheduled report
  deleteScheduledReport: async (reportId: string): Promise<void> => {
    try {
      // In real implementation:
      // await axios.delete(`${API_URL}/reports/scheduled/${reportId}`);
      
      // Mock implementation:
      console.log(`Deleting scheduled report: ${reportId}`);
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      throw error;
    }
  }
};

// Helper function to calculate next delivery date based on schedule
const getNextDeliveryDate = (scheduleData: ScheduleReportData): string => {
  const now = new Date();
  let nextDate: Date;
  
  switch(scheduleData.frequency) {
    case 'daily':
      nextDate = new Date(now.getTime() + 86400000); // tomorrow
      break;
    case 'weekly':
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = daysOfWeek.indexOf(scheduleData.dayOfWeek || 'Monday');
      const currentDay = now.getDay();
      const daysToAdd = (targetDay + 7 - currentDay) % 7;
      nextDate = new Date(now.getTime() + 86400000 * (daysToAdd || 7));
      break;
    case 'monthly':
      const targetDate = parseInt(scheduleData.dayOfMonth || '1', 10);
      if (now.getDate() >= targetDate) {
        // Move to next month
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, targetDate);
      } else {
        // Still time this month
        nextDate = new Date(now.getFullYear(), now.getMonth(), targetDate);
      }
      break;
    case 'quarterly':
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      const nextQuarterStartMonth = (currentQuarter + 1) * 3;
      nextDate = new Date(now.getFullYear(), nextQuarterStartMonth, 1);
      break;
    default:
      nextDate = new Date(now.getTime() + 86400000); // default to tomorrow
  }
  
  return nextDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default analyticsService; 