'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiUsers, FiFileText, FiChevronRight, FiBarChart2 } from 'react-icons/fi';

const ClassTeacherDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Class Teacher Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-600">
          This is your class teacher dashboard where you can manage your class, track student progress,
          and oversee all educational activities for your class.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-emerald-100 p-3 mr-4">
            <FiUsers className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FiFileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Homework</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiBarChart2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-xl font-semibold">0%</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Class Announcements</h3>
          <p className="text-gray-500 text-sm">No recent announcements</p>
          <div className="mt-4">
            <ul className="divide-y">
              <li className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">No announcements</p>
                  <p className="text-sm text-gray-500">Announcements for your class will appear here</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Student Attendance</h3>
          <p className="text-gray-500 text-sm">Today's attendance</p>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Present</span>
              <span className="text-sm font-medium">0/0 (0%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Students</h3>
        </div>
        <div className="p-3">
          <p className="text-center py-6 text-gray-500">No students assigned to your class yet</p>
        </div>
      </div>
    </div>
  );
};

export default ClassTeacherDashboard; 