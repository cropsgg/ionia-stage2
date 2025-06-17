'use client';

import React from 'react';
import Link from 'next/link';
import { FiUsers, FiBookOpen, FiGrid, FiPieChart, FiActivity, FiCalendar, FiBell } from 'react-icons/fi';

const TeacherDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">My Students</p>
              <h3 className="text-2xl font-bold mt-1">78</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-emerald-600 flex items-center">
            <span className="font-semibold">+3</span>
            <span className="ml-1">this semester</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Classes</p>
              <h3 className="text-2xl font-bold mt-1">6</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiGrid className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-blue-600 flex items-center">
            <span className="font-semibold">2 ongoing</span>
            <span className="ml-1">right now</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Homework Assigned</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiBookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-purple-600 flex items-center">
            <span className="font-semibold">8</span>
            <span className="ml-1">pending review</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Class Average</p>
              <h3 className="text-2xl font-bold mt-1">72%</h3>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-yellow-600 flex items-center">
            <span className="font-semibold">+1.5%</span>
            <span className="ml-1">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/management/teacher/homework/new" className="flex items-center p-3 rounded-md hover:bg-emerald-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <FiBookOpen className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">Assign Homework</p>
                  <p className="text-sm text-gray-500">Create new assignment</p>
                </div>
              </Link>
              
              <Link href="/management/teacher/analytics" className="flex items-center p-3 rounded-md hover:bg-emerald-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <FiPieChart className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-500">Check student performance</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Notifications</h2>
              <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700">View All</Link>
            </div>
            <div className="space-y-4">
              {[
                { date: '2 hours ago', message: 'New homework submission from Sarah Johnson in Grade 9A' },
                { date: '1 day ago', message: 'Class schedule changed for tomorrow' },
                { date: '2 days ago', message: 'Staff meeting reminder for Friday' },
                { date: '3 days ago', message: 'New educational resources available' }
              ].map((notification, index) => (
                <div key={index} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                    <FiBell className="text-emerald-600 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Class Performance Overview</h2>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Current Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {[
                { className: 'Grade 9A - Math', performance: 78, color: 'bg-emerald-500' },
                { className: 'Grade 10B - Math', performance: 72, color: 'bg-blue-500' },
                { className: 'Grade 8C - Math', performance: 65, color: 'bg-yellow-500' },
                { className: 'Grade 11A - Math', performance: 88, color: 'bg-purple-500' },
                { className: 'Grade 7B - Math', performance: 70, color: 'bg-pink-500' }
              ].map((cls, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cls.className}</span>
                    <span>{cls.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${cls.color} h-2 rounded-full transition-all duration-500 group-hover:opacity-80`}
                      style={{ width: `${cls.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Today's Classes</h2>
              <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700">View Schedule</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { time: '09:00 - 10:00', title: 'Mathematics - Grade 9A', location: 'Room 101' },
                { time: '10:15 - 11:15', title: 'Mathematics - Grade 10B', location: 'Room 203' },
                { time: '11:30 - 12:30', title: 'Mathematics - Grade 8C', location: 'Room 105' },
                { time: '13:30 - 14:30', title: 'Mathematics - Grade 11A', location: 'Lab 3' }
              ].map((event, index) => (
                <div key={index} className="flex group hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex flex-col items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                    <FiCalendar className="text-emerald-600 h-4 w-4 mb-1" />
                    <span className="text-xs font-semibold text-emerald-700">{event.time.split(' - ')[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.time}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 