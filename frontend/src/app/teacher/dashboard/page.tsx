'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiUsers, FiFileText, FiBookOpen, FiBook, FiCalendar, FiClock } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import StatBlock from '@/components/ui/StatBlock';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';

const TeacherDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock data for submissions
  const submissions = [];

  // Mock data for schedule
  const schedule = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
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
          This is your teacher dashboard where you can manage your classes, create and review homework assignments,
          and access teaching resources.
        </p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          icon={<FiUsers size={18} />}
          title="Classes"
          value="0"
        />
        
        <StatBlock
          icon={<FiBook size={18} />}
          title="Subjects"
          value="0"
        />
        
        <StatBlock
          icon={<FiFileText size={18} />}
          title="Homework"
          value="0"
          unit="assignments"
        />
        
        <StatBlock
          icon={<FiBookOpen size={18} />}
          title="Resources"
          value="0"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Homework Submissions">
          {submissions.length === 0 ? (
            <EmptyState 
              icon={<FiClock className="h-8 w-8" />}
              title="No Submissions Yet"
              description="Student homework submissions will appear here once received."
              compact
            />
          ) : (
            <Table
              data={submissions}
              columns={[
                { header: 'Student', accessor: 'studentName' },
                { header: 'Assignment', accessor: 'assignmentName' },
                { header: 'Submitted', accessor: 'submittedAt' },
                { header: 'Status', accessor: row => (
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                    {row.status}
                  </span>
                )}
              ]}
            />
          )}
        </Card>
        
        <Card title="Teaching Schedule">
          {schedule.length === 0 ? (
            <EmptyState 
              icon={<FiCalendar className="h-8 w-8" />}
              title="No Classes Scheduled"
              description="Your upcoming classes will appear here once scheduled."
              compact
            />
          ) : (
            <Table
              data={schedule}
              columns={[
                { header: 'Class', accessor: 'className' },
                { header: 'Subject', accessor: 'subject' },
                { header: 'Time', accessor: 'time' },
                { header: 'Room', accessor: 'room' }
              ]}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard; 