'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiBook, FiActivity, FiCheckSquare, FiUser, FiArrowLeft } from 'react-icons/fi';

// This is a simplified layout that doesn't depend on redux auth state
// Used specifically for the homework and learning profile pages in our implementation
const StudentHomeworkLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
    { href: '/student/homework', label: 'My Homework', icon: <FiBook className="mr-2 h-5 w-5" /> },
    { href: '/student/learning-profile', label: 'Learning Profile', icon: <FiActivity className="mr-2 h-5 w-5" /> },
    { href: '/student/results', label: 'My Results', icon: <FiCheckSquare className="mr-2 h-5 w-5" /> },
    { href: '/student/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/student/dashboard">
              <span className="text-2xl font-bold text-indigo-600">Ionia</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default StudentHomeworkLayout; 