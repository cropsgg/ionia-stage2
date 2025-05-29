/* Placeholder Student Learning Profile page */
'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import { 
  FiUser, FiTrendingUp, FiClock, FiTarget, FiAward, FiBookOpen,
  FiActivity, FiBarChart2, FiPieChart, FiCalendar, FiStar,
  FiCheckCircle, FiAlertTriangle, FiZap, FiEye, FiRefreshCw
} from 'react-icons/fi';

interface LearningData {
  subjectPerformance: {
    subject: string;
    currentGrade: number;
    previousGrade: number;
    trend: 'up' | 'down' | 'stable';
    completedAssignments: number;
    totalAssignments: number;
    averageTimeSpent: number; // in minutes
    strongTopics: string[];
    weakTopics: string[];
  }[];
  overallStats: {
    gpa: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
    averageSubmissionTime: number; // hours before deadline
    studyStreak: number;
    totalStudyHours: number;
  };
  learningPatterns: {
    preferredStudyTime: string;
    learningStyle: string;
    strongestDays: string[];
    weakestDays: string[];
    focusPatterns: { time: string; focus: number }[];
    productivityScore: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedDate: Date;
    category: string;
  }[];
  recommendations: {
    id: string;
    type: 'study_method' | 'schedule' | 'resource' | 'focus_area';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact: string;
  }[];
  weeklyGoals: {
    id: string;
    goal: string;
    target: number;
    current: number;
    unit: string;
    deadline: Date;
    status: 'on_track' | 'behind' | 'completed' | 'overdue';
  }[];
}

const LearningProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'semester'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'goals' | 'achievements'>('overview');

  // Mock data
  useEffect(() => {
    const mockData: LearningData = {
      subjectPerformance: [
        {
          subject: 'Mathematics',
          currentGrade: 87,
          previousGrade: 82,
          trend: 'up',
          completedAssignments: 12,
          totalAssignments: 15,
          averageTimeSpent: 45,
          strongTopics: ['Algebra', 'Geometry'],
          weakTopics: ['Calculus', 'Statistics']
        },
        {
          subject: 'Science',
          currentGrade: 91,
          previousGrade: 89,
          trend: 'up',
          completedAssignments: 10,
          totalAssignments: 12,
          averageTimeSpent: 38,
          strongTopics: ['Physics', 'Chemistry'],
          weakTopics: ['Biology']
        },
        {
          subject: 'English',
          currentGrade: 78,
          previousGrade: 85,
          trend: 'down',
          completedAssignments: 8,
          totalAssignments: 10,
          averageTimeSpent: 52,
          strongTopics: ['Grammar', 'Writing'],
          weakTopics: ['Literature Analysis', 'Poetry']
        },
        {
          subject: 'History',
          currentGrade: 83,
          previousGrade: 83,
          trend: 'stable',
          completedAssignments: 9,
          totalAssignments: 11,
          averageTimeSpent: 35,
          strongTopics: ['Ancient History', 'Geography'],
          weakTopics: ['Modern History']
        }
      ],
      overallStats: {
        gpa: 3.4,
        attendanceRate: 96,
        assignmentCompletionRate: 87,
        averageSubmissionTime: 8.5,
        studyStreak: 12,
        totalStudyHours: 145
      },
      learningPatterns: {
        preferredStudyTime: 'Evening (6-9 PM)',
        learningStyle: 'Visual & Kinesthetic',
        strongestDays: ['Monday', 'Wednesday', 'Friday'],
        weakestDays: ['Thursday', 'Saturday'],
        focusPatterns: [
          { time: '9 AM', focus: 65 },
          { time: '11 AM', focus: 78 },
          { time: '2 PM', focus: 72 },
          { time: '4 PM', focus: 58 },
          { time: '7 PM', focus: 85 },
          { time: '9 PM', focus: 75 }
        ],
        productivityScore: 78
      },
      achievements: [
        {
          id: '1',
          title: 'Perfect Week',
          description: 'Completed all assignments for a full week',
          icon: '🏆',
          earnedDate: new Date(2024, 0, 15),
          category: 'Consistency'
        },
        {
          id: '2',
          title: 'Math Wizard',
          description: 'Scored above 90% in 5 consecutive math assignments',
          icon: '🧙‍♂️',
          earnedDate: new Date(2024, 0, 10),
          category: 'Subject Mastery'
        },
        {
          id: '3',
          title: 'Early Bird',
          description: 'Submitted 10 assignments before deadline',
          icon: '🐦',
          earnedDate: new Date(2024, 0, 5),
          category: 'Time Management'
        }
      ],
      recommendations: [
        {
          id: '1',
          type: 'focus_area',
          title: 'Improve English Literature Analysis',
          description: 'Focus extra study time on literature analysis techniques and critical thinking skills.',
          priority: 'high',
          estimatedImpact: '+8-12 points'
        },
        {
          id: '2',
          type: 'schedule',
          title: 'Optimize Study Schedule',
          description: 'Your focus peaks at 7 PM. Schedule challenging subjects during this time.',
          priority: 'medium',
          estimatedImpact: '+15% efficiency'
        },
        {
          id: '3',
          type: 'study_method',
          title: 'Use Visual Learning Tools',
          description: 'Your visual learning style suggests using mind maps and diagrams for better retention.',
          priority: 'medium',
          estimatedImpact: '+20% retention'
        }
      ],
      weeklyGoals: [
        {
          id: '1',
          goal: 'Complete all assignments',
          target: 5,
          current: 4,
          unit: 'assignments',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: 'on_track'
        },
        {
          id: '2',
          goal: 'Study hours',
          target: 20,
          current: 16,
          unit: 'hours',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: 'on_track'
        },
        {
          id: '3',
          goal: 'Reading comprehension practice',
          target: 3,
          current: 1,
          unit: 'exercises',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: 'behind'
        }
      ]
    };

    setLearningData(mockData);
  }, []);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <FiTrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <div className="h-1 w-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on_track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behind': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (!learningData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Profile</h1>
          <p className="text-gray-600 mt-1">Track your progress and discover your learning patterns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'semester')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <FiUser className="h-4 w-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 className="h-4 w-4" /> },
            { id: 'goals', label: 'Goals', icon: <FiTarget className="h-4 w-4" /> },
            { id: 'achievements', label: 'Achievements', icon: <FiAward className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <StatBlock
                icon={<FiTrendingUp size={20} className="text-blue-600" />}
                title="Overall GPA"
                value={learningData.overallStats.gpa.toFixed(1)}
                trend={{
                  value: 0.2,
                  isPositive: true
                }}
              />
            </Card>

            <Card className="p-5">
              <StatBlock
                icon={<FiCheckCircle size={20} className="text-green-600" />}
                title="Completion Rate"
                value={learningData.overallStats.assignmentCompletionRate}
                unit="%"
                trend={{
                  value: 5,
                  isPositive: true
                }}
              />
            </Card>

            <Card className="p-5">
              <StatBlock
                icon={<FiZap size={20} className="text-orange-600" />}
                title="Study Streak"
                value={learningData.overallStats.studyStreak}
                unit="days"
              />
            </Card>

            <Card className="p-5">
              <StatBlock
                icon={<FiClock size={20} className="text-purple-600" />}
                title="Total Study Hours"
                value={learningData.overallStats.totalStudyHours}
                unit="hours"
                trend={{
                  value: 12,
                  isPositive: true
                }}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Subject Performance */}
            <div className="xl:col-span-2">
              <Card title="Subject Performance" className="p-5">
                <div className="space-y-4">
                  {learningData.subjectPerformance.map((subject, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-900">{subject.subject}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getGradeColor(subject.currentGrade)}`}>
                            {subject.currentGrade}%
                          </span>
                          {getTrendIcon(subject.trend)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">{subject.completedAssignments}/{subject.totalAssignments}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{subject.averageTimeSpent}m</div>
                          <div className="text-xs text-gray-500">Avg Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{subject.strongTopics.length}</div>
                          <div className="text-xs text-gray-500">Strong Areas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-orange-600">{subject.weakTopics.length}</div>
                          <div className="text-xs text-gray-500">Focus Areas</div>
                        </div>
                      </div>

                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" 
                          style={{ width: `${(subject.completedAssignments / subject.totalAssignments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Learning Insights */}
            <div className="space-y-6">
              {/* Learning Patterns */}
              <Card title="Learning Patterns" className="p-5">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Preferred Study Time:</span>
                    <div className="font-medium mt-1">{learningData.learningPatterns.preferredStudyTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Learning Style:</span>
                    <div className="font-medium mt-1">{learningData.learningPatterns.learningStyle}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Productivity Score:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${learningData.learningPatterns.productivityScore}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{learningData.learningPatterns.productivityScore}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card title="Quick Actions" className="p-5">
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <FiTarget className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Set Weekly Goal</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <FiBookOpen className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Practice Weak Areas</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <FiCalendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Schedule Study Time</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Focus Patterns */}
            <Card title="Daily Focus Patterns" className="p-5">
              <div className="space-y-3">
                {learningData.learningPatterns.focusPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{pattern.time}</span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            pattern.focus >= 80 ? 'bg-green-500' :
                            pattern.focus >= 60 ? 'bg-blue-500' :
                            pattern.focus >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${pattern.focus}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{pattern.focus}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Performance */}
            <Card title="Weekly Performance" className="p-5">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Strongest Days</h4>
                  <div className="flex gap-1">
                    {learningData.learningPatterns.strongestDays.map((day, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Focus Areas</h4>
                  <div className="flex gap-1">
                    {learningData.learningPatterns.weakestDays.map((day, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card title="Personalized Recommendations" className="p-5">
            <div className="space-y-4">
              {learningData.recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(rec.priority)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Estimated impact: {rec.estimatedImpact}
                    </span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Weekly Goals</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiTarget className="h-4 w-4" />
              Set New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningData.weeklyGoals.map((goal) => (
              <Card key={goal.id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{goal.goal}</h3>
                  <span className={`px-2 py-1 text-xs rounded border ${getGoalStatusColor(goal.status)}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        goal.status === 'completed' ? 'bg-green-500' :
                        goal.status === 'on_track' ? 'bg-blue-500' :
                        goal.status === 'behind' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Due: {goal.deadline.toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningData.achievements.map((achievement) => (
              <Card key={achievement.id} className="p-5 text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">{achievement.category}</span>
                  <span>{achievement.earnedDate.toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Achievement Progress */}
          <Card title="Progress Towards New Achievements" className="p-5">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <div>
                      <h4 className="font-medium">Scholar</h4>
                      <p className="text-sm text-gray-600">Complete 20 assignments this month</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">15/20</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="font-medium">Speed Demon</h4>
                      <p className="text-sm text-gray-600">Submit 10 assignments early</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">7/10</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LearningProfilePage; 