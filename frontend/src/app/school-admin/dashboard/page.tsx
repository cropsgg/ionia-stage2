'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiUsers, FiGrid, FiBook, FiBarChart2, FiClipboard, FiSettings } from 'react-icons/fi';
import Link from 'next/link';

const SchoolAdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-600">
          This is your school administration dashboard where you can manage all aspects of your school 
          including users, classes, subjects, and school settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-emerald-100 p-3 mr-4">
            <FiUsers className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiGrid className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Classes</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FiBook className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Announcements</h3>
            <Link 
              href="/school-admin/announcements" 
              className="text-sm text-emerald-600 hover:text-emerald-800"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm">No recent announcements</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">School Analytics</h3>
            <Link 
              href="/school-admin/reports" 
              className="text-sm text-emerald-600 hover:text-emerald-800"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm">No analytics available yet</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/school-admin/users" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiUsers className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage students, teachers and admins</p>
          </div>
        </Link>
        
        <Link href="/school-admin/classes" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiGrid className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Class Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage classes and assignments</p>
          </div>
        </Link>
        
        <Link href="/school-admin/settings" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-gray-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiSettings className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold">School Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Configure school parameters</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard; 