'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import EmptyState from '@/components/ui/EmptyState';
import { FiBook, FiCalendar, FiClock, FiBarChart2 } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock homework data
  const pendingHomework: any[] = [];

  // Mock subjects for learning progress
  const subjects = [
    { name: 'Mathematics', progress: 0 },
    { name: 'Science', progress: 0 },
    { name: 'English', progress: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <Card>
        <h2 className="text-lg font-semibold mb-2">Welcome, {user?.fullName}!</h2>
        <p className="text-muted-foreground">
          This is your personalized student dashboard where you can view your homework assignments, 
          track your learning progress, and manage your academic profile.
        </p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBlock
          icon={<FiBook size={18} />}
          title="Pending Homework"
          value="0"
          unit="assignments"
        />
        
        <StatBlock
          icon={<FiCalendar size={18} />}
          title="Next Due Date"
          value="No Upcoming"
          valueClassName="text-lg"
        />
        
        <StatBlock
          icon={<FiBarChart2 size={18} />}
          title="Overall Progress"
          value="0"
          unit="%"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Pending Homework">
          {pendingHomework.length === 0 ? (
            <EmptyState 
              icon={<FiClock className="h-8 w-8" />}
              title="No Pending Homework"
              description="You're all caught up! Check back later for new assignments."
              compact
            />
          ) : (
            <ul className="divide-y">
              {pendingHomework.map((homework, index) => (
                <li key={index} className="py-3 flex justify-between">
                  {/* Homework items would go here */}
                </li>
              ))}
            </ul>
          )}
        </Card>
        
        <Card title="Learning Progress">
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject.name}</span>
                  <span>{subject.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard; 