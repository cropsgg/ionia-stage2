'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import EmptyState from '@/components/ui/EmptyState';
import { 
  FiBook, FiCalendar, FiClock, FiBarChart2, FiTrendingUp, 
  FiAward, FiZap, FiStar, FiTarget, FiFileText, FiUpload,
  FiEye, FiAlertCircle, FiCheckCircle, FiActivity
} from 'react-icons/fi';
import Link from 'next/link';

const StudentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Mock data - will be replaced with real API calls
  const pendingHomework = [
    {
      id: 1,
      title: "Mathematics Assignment - Chapter 5",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      urgency: "high", // high, medium, low
      description: "Complete exercises 1-15 from Chapter 5"
    },
    {
      id: 2,
      title: "Science Project - Solar System",
      subject: "Science", 
      dueDate: "2024-01-25",
      urgency: "medium",
      description: "Create a model of the solar system"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "submission",
      title: "English Essay submitted",
      time: "2 hours ago",
      icon: <FiFileText className="h-4 w-4" />
    },
    {
      id: 2,
      type: "grade",
      title: "Math Quiz graded - 85%",
      time: "5 hours ago", 
      icon: <FiBarChart2 className="h-4 w-4" />
    },
    {
      id: 3,
      type: "achievement",
      title: "Earned 'Quick Learner' badge",
      time: "1 day ago",
      icon: <FiAward className="h-4 w-4" />
    }
  ];

  const subjects = [
    { name: 'Mathematics', progress: 78, grade: 'A-', trend: 'up' },
    { name: 'Science', progress: 85, grade: 'A', trend: 'up' },
    { name: 'English', progress: 92, grade: 'A+', trend: 'stable' },
    { name: 'History', progress: 67, grade: 'B+', trend: 'down' },
  ];

  const badges = [
    { name: 'Perfect Week', icon: '🏆', earned: true },
    { name: 'Quick Learner', icon: '⚡', earned: true }, 
    { name: 'Team Player', icon: '🤝', earned: false },
    { name: 'Scholar', icon: '📚', earned: false },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Science': 'bg-green-100 text-green-800', 
      'English': 'bg-purple-100 text-purple-800',
      'History': 'bg-orange-100 text-orange-800',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    // Mock streak calculation
    setCurrentStreak(7);
    setTotalPoints(1250);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiFileText size={20} className="text-blue-600" />}
            title="Pending Assignments"
            value={pendingHomework.length}
            unit="tasks"
            trend={{
              value: 2,
              isPositive: false
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiCheckCircle size={20} className="text-green-600" />}
            title="Completed This Week"
            value="12"
            unit="assignments"
            trend={{
              value: 15,
              isPositive: true
            }}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiZap size={20} className="text-orange-600" />}
            title="Current Streak"
            value={currentStreak}
            unit="days"
            valueClassName="text-orange-600"
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiTrendingUp size={20} className="text-purple-600" />}
            title="Overall Average"
            value="85.2"
            unit="%"
            trend={{
              value: 3.2,
              isPositive: true
            }}
          />
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card title="Quick Actions" className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/student/homework" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiUpload className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-900">Submit Assignment</span>
            </div>
          </Link>
          
          <Link href="/student/homework?filter=quiz" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiActivity className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-900">Take Quiz</span>
            </div>
          </Link>
          
          <Link href="/student/calendar" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiCalendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-900">View Calendar</span>
            </div>
          </Link>
          
          <Link href="/student/results" className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div className="text-center">
              <FiEye className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-900">Check Results</span>
            </div>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Homework & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Homework */}
          <Card title="Upcoming Assignments" className="p-5">
            {pendingHomework.length === 0 ? (
              <EmptyState 
                icon={<FiCheckCircle className="h-8 w-8" />}
                title="All Caught Up!"
                description="You don't have any pending assignments. Great job!"
                compact
              />
            ) : (
              <div className="space-y-4">
                {pendingHomework.map((homework) => {
                  const daysLeft = getDaysUntilDue(homework.dueDate);
                  return (
                    <div key={homework.id} className={`p-4 rounded-lg border-l-4 ${
                      homework.urgency === 'high' ? 'border-red-500 bg-red-50' :
                      homework.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSubjectColor(homework.subject)}`}>
                              {homework.subject}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getUrgencyColor(homework.urgency)}`}>
                              {daysLeft === 0 ? 'Due Today' : 
                               daysLeft === 1 ? 'Due Tomorrow' : 
                               daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                               `${daysLeft} days left`}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{homework.title}</h4>
                          <p className="text-sm text-gray-600">{homework.description}</p>
                        </div>
                        <Link href={`/student/homework/${homework.id}`} 
                              className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Start Work
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="p-5">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full mr-3">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Progress & Gamification */}
        <div className="space-y-6">
          {/* Gamification Section */}
          <Card title="Your Achievements" className="p-5">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Badges</h4>
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((badge, index) => (
                    <div key={index} className={`p-3 rounded-lg text-center border-2 ${
                      badge.earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="text-lg mb-1">{badge.icon}</div>
                      <div className={`text-xs font-medium ${
                        badge.earned ? 'text-yellow-800' : 'text-gray-500'
                      }`}>
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Learning Progress */}
          <Card title="Subject Progress" className="p-5">
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getSubjectColor(subject.name)}`}>
                        {subject.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">{subject.progress}%</span>
                      {subject.trend === 'up' && <FiTrendingUp className="h-3 w-3 text-green-500" />}
                      {subject.trend === 'down' && <FiTrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                      {subject.trend === 'stable' && <div className="h-3 w-3 bg-gray-400 rounded-full" />}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Goal */}
          <Card title="Next Goal" className="p-5">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <FiTarget className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 mb-1">Complete 5 more assignments</div>
              <div className="text-xs text-gray-600">to earn "Dedicated Student" badge</div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">3 of 5 completed</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 