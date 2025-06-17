'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FiHome, FiBook, FiCheckSquare, FiUser, FiLogOut } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || user.role !== 'student') {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
    { href: '/student/homework', label: 'My Homework', icon: <FiBook className="mr-2 h-5 w-5" /> },
    { href: '/student/learning-profile', label: 'Learning Profile', icon: <FiCheckSquare className="mr-2 h-5 w-5" /> },
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
              <span className="text-2xl font-bold text-emerald-600">Ionia</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{user?.fullName}</span>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <span className="text-emerald-800 font-semibold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
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
                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
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

export default StudentLayout; 