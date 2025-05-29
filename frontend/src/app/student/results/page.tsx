/* Placeholder Student Results page */
'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import { 
  FiTrendingUp, FiTrendingDown, FiBarChart2, FiCalendar, FiDownload, 
  FiEye, FiFilter, FiRefreshCw, FiAward, FiTarget, FiBookOpen,
  FiCheckCircle, FiClock, FiStar, FiPieChart, FiActivity
} from 'react-icons/fi';

interface Grade {
  id: string;
  assignmentTitle: string;
  subject: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  score: number;
  maxScore: number;
  percentage: number;
  submittedDate: Date;
  gradedDate: Date;
  teacherName: string;
  feedback?: string;
  rubricScores?: { criteria: string; score: number; maxScore: number }[];
  timeSpent?: number; // in minutes
  attempts?: number;
}

interface SubjectAnalytics {
  subject: string;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  totalAssignments: number;
  trend: 'up' | 'down' | 'stable';
  recentGrades: number[];
  improvementAreas: string[];
  strengths: string[];
}

interface PerformanceTrend {
  period: string;
  grade: number;
  subject: string;
}

const StudentResults = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjectAnalytics, setSubjectAnalytics] = useState<SubjectAnalytics[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

  // Mock data
  useEffect(() => {
    const mockGrades: Grade[] = [
      {
        id: '1',
        assignmentTitle: 'Quadratic Equations Test',
        subject: 'Mathematics',
        type: 'exam',
        score: 87,
        maxScore: 100,
        percentage: 87,
        submittedDate: new Date(2024, 0, 15),
        gradedDate: new Date(2024, 0, 17),
        teacherName: 'Mr. Johnson',
        feedback: 'Excellent work on factoring problems. Work on word problems for even better results.',
        rubricScores: [
          { criteria: 'Problem Solving', score: 28, maxScore: 30 },
          { criteria: 'Calculations', score: 35, maxScore: 40 },
          { criteria: 'Work Shown', score: 24, maxScore: 30 }
        ],
        timeSpent: 45
      },
      {
        id: '2',
        assignmentTitle: 'Physics Lab Report',
        subject: 'Science',
        type: 'assignment',
        score: 92,
        maxScore: 100,
        percentage: 92,
        submittedDate: new Date(2024, 0, 12),
        gradedDate: new Date(2024, 0, 14),
        teacherName: 'Ms. Smith',
        feedback: 'Outstanding analysis and clear presentation of data. Great attention to detail.',
        timeSpent: 120
      },
      {
        id: '3',
        assignmentTitle: 'Shakespeare Quiz',
        subject: 'English',
        type: 'quiz',
        score: 78,
        maxScore: 100,
        percentage: 78,
        submittedDate: new Date(2024, 0, 10),
        gradedDate: new Date(2024, 0, 10),
        teacherName: 'Mrs. Davis',
        feedback: 'Good understanding of themes. Review character analysis techniques.',
        attempts: 1,
        timeSpent: 25
      },
      {
        id: '4',
        assignmentTitle: 'Ancient Civilizations Essay',
        subject: 'History',
        type: 'assignment',
        score: 85,
        maxScore: 100,
        percentage: 85,
        submittedDate: new Date(2024, 0, 8),
        gradedDate: new Date(2024, 0, 11),
        teacherName: 'Mr. Wilson',
        feedback: 'Well-researched essay with good supporting evidence. Improve conclusion structure.',
        timeSpent: 180
      },
      {
        id: '5',
        assignmentTitle: 'Algebra Practice Set',
        subject: 'Mathematics',
        type: 'assignment',
        score: 95,
        maxScore: 100,
        percentage: 95,
        submittedDate: new Date(2024, 0, 5),
        gradedDate: new Date(2024, 0, 6),
        teacherName: 'Mr. Johnson',
        feedback: 'Perfect execution! Excellent understanding of algebraic concepts.',
        timeSpent: 60
      }
    ];

    const mockAnalytics: SubjectAnalytics[] = [
      {
        subject: 'Mathematics',
        averageGrade: 91,
        highestGrade: 95,
        lowestGrade: 87,
        totalAssignments: 8,
        trend: 'up',
        recentGrades: [82, 87, 89, 91, 95],
        improvementAreas: ['Word Problems', 'Complex Equations'],
        strengths: ['Basic Algebra', 'Factoring', 'Graphing']
      },
      {
        subject: 'Science',
        averageGrade: 88,
        highestGrade: 92,
        lowestGrade: 83,
        totalAssignments: 6,
        trend: 'stable',
        recentGrades: [85, 88, 83, 90, 92],
        improvementAreas: ['Laboratory Techniques'],
        strengths: ['Theoretical Concepts', 'Data Analysis', 'Report Writing']
      },
      {
        subject: 'English',
        averageGrade: 82,
        highestGrade: 88,
        lowestGrade: 75,
        totalAssignments: 7,
        trend: 'down',
        recentGrades: [88, 85, 82, 78, 75],
        improvementAreas: ['Literary Analysis', 'Essay Structure', 'Vocabulary'],
        strengths: ['Grammar', 'Creative Writing']
      },
      {
        subject: 'History',
        averageGrade: 86,
        highestGrade: 90,
        lowestGrade: 82,
        totalAssignments: 5,
        trend: 'up',
        recentGrades: [82, 84, 86, 88, 90],
        improvementAreas: ['Date Memorization'],
        strengths: ['Analysis', 'Research', 'Essay Writing', 'Source Evaluation']
      }
    ];

    setGrades(mockGrades);
    setSubjectAnalytics(mockAnalytics);
  }, []);

  const filteredGrades = grades.filter(grade => {
    if (selectedSubject !== 'all' && grade.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && grade.type !== selectedType) return false;
    return true;
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColorText = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <FiTrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <div className="h-1 w-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <FiBookOpen className="h-4 w-4" />;
      case 'quiz': return <FiClock className="h-4 w-4" />;
      case 'assignment': return <FiCheckCircle className="h-4 w-4" />;
      case 'project': return <FiStar className="h-4 w-4" />;
      default: return <FiCheckCircle className="h-4 w-4" />;
    }
  };

  const calculateOverallGPA = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((sum, grade) => sum + grade.percentage, 0);
    return (totalPoints / grades.length / 100 * 4).toFixed(2);
  };

  const getSubjects = () => {
    return Array.from(new Set(grades.map(grade => grade.subject)));
  };

  const renderGradesList = () => (
    <div className="space-y-4">
      {filteredGrades.map((grade) => (
        <Card key={grade.id} className="p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getTypeIcon(grade.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{grade.assignmentTitle}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{grade.subject}</span>
                  <span>•</span>
                  <span>{grade.teacherName}</span>
                  <span>•</span>
                  <span className="capitalize">{grade.type}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getGradeColorText(grade.percentage)}`}>
                {grade.percentage}%
              </div>
              <div className="text-sm text-gray-500">
                {grade.score}/{grade.maxScore} points
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Submitted:</span>
              <div className="font-medium">{grade.submittedDate.toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-500">Graded:</span>
              <div className="font-medium">{grade.gradedDate.toLocaleDateString()}</div>
            </div>
            {grade.timeSpent && (
              <div>
                <span className="text-gray-500">Time Spent:</span>
                <div className="font-medium">{grade.timeSpent} minutes</div>
              </div>
            )}
            {grade.attempts && (
              <div>
                <span className="text-gray-500">Attempts:</span>
                <div className="font-medium">{grade.attempts}</div>
              </div>
            )}
          </div>

          {grade.feedback && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
              <h4 className="font-medium text-blue-900 mb-1">Teacher Feedback</h4>
              <p className="text-blue-800 text-sm">{grade.feedback}</p>
            </div>
          )}

          {grade.rubricScores && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Rubric Breakdown</h4>
              {grade.rubricScores.map((rubric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{rubric.criteria}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(rubric.score / rubric.maxScore) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{rubric.score}/{rubric.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
              <FiEye className="inline h-4 w-4 mr-1" />
              View Details
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
              <FiDownload className="inline h-4 w-4 mr-1" />
              Download
            </button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Subject Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjectAnalytics.map((subject, index) => (
          <Card key={index} className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${getGradeColorText(subject.averageGrade)}`}>
                  {subject.averageGrade}%
                </span>
                {getTrendIcon(subject.trend)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{subject.highestGrade}%</div>
                <div className="text-xs text-gray-500">Highest</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{subject.averageGrade}%</div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{subject.lowestGrade}%</div>
                <div className="text-xs text-gray-500">Lowest</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Recent Trend</h4>
              <div className="flex items-end gap-1 h-16">
                {subject.recentGrades.map((grade, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${(grade / 100) * 100}%` }}
                    title={`${grade}%`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {subject.strengths.map((strength, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Improvement Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {subject.improvementAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grade Distribution */}
      <Card title="Grade Distribution" className="p-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {grades.filter(g => g.percentage >= 90).length}
            </div>
            <div className="text-sm text-gray-600">A Grades (90-100%)</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {grades.filter(g => g.percentage >= 80 && g.percentage < 90).length}
            </div>
            <div className="text-sm text-gray-600">B Grades (80-89%)</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {grades.filter(g => g.percentage >= 70 && g.percentage < 80).length}
            </div>
            <div className="text-sm text-gray-600">C Grades (70-79%)</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {grades.filter(g => g.percentage < 70).length}
            </div>
            <div className="text-sm text-gray-600">Below C (&lt;70%)</div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600 mt-1">Track your academic performance and analyze your progress</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'analytics' : 'list')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {viewMode === 'list' ? <FiBarChart2 className="h-4 w-4" /> : <FiCheckCircle className="h-4 w-4" />}
            {viewMode === 'list' ? 'Analytics View' : 'List View'}
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export Report
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiTrendingUp size={20} className="text-blue-600" />}
            title="Overall GPA"
            value={calculateOverallGPA()}
            trend={{
              value: 0.1,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiAward size={20} className="text-green-600" />}
            title="Total Assignments"
            value={grades.length}
            unit="completed"
            trend={{
              value: 3,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTarget size={20} className="text-purple-600" />}
            title="Average Score"
            value={Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length || 0)}
            unit="%"
            trend={{
              value: 2.5,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiActivity size={20} className="text-orange-600" />}
            title="Subjects"
            value={getSubjects().length}
            unit="active"
          />
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            {getSubjects().map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="assignment">Assignments</option>
            <option value="quiz">Quizzes</option>
            <option value="exam">Exams</option>
            <option value="project">Projects</option>
          </select>

          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'semester')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>

          <div className="flex items-center gap-2">
            <FiFilter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredGrades.length} results</span>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      {viewMode === 'list' ? renderGradesList() : renderAnalytics()}

      {filteredGrades.length === 0 && (
        <Card className="p-8 text-center">
          <FiBarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </Card>
      )}
    </div>
  );
};

export default StudentResults; 