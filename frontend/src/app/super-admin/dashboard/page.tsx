'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiBriefcase, FiUsers, FiBarChart2, FiSettings, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';

const SuperAdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-600">
          This is the super admin dashboard where you can manage all schools, system settings, 
          and platform-wide configurations for Ionia.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-emerald-100 p-3 mr-4">
            <FiBriefcase className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Schools</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FiBarChart2 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">System Load</p>
            <p className="text-xl font-semibold">0%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <FiGlobe className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Regions</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <Link 
              href="/super-admin/reports" 
              className="text-sm text-emerald-600 hover:text-emerald-800"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm">No recent activities to display</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Status</h3>
            <Link 
              href="/super-admin/settings" 
              className="text-sm text-emerald-600 hover:text-emerald-800"
            >
              Settings
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Server Status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Database Status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span>0%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/super-admin/schools" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiBriefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold">School Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage all schools in the platform</p>
          </div>
        </Link>
        
        <Link href="/super-admin/users" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage system users and roles</p>
          </div>
        </Link>
        
        <Link href="/super-admin/settings" className="block">
          <div className="bg-white rounded-lg shadow p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="mx-auto rounded-full bg-gray-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FiSettings className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold">System Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Configure global platform settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 