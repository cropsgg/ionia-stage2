"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiClipboard, FiUser, FiPieChart, FiMessageSquare, FiHelpCircle, FiLogOut } from 'react-icons/fi';

type SidebarProps = {
  username: string;
  onLogout?: () => void;
};

const StudentSidebar: React.FC<SidebarProps> = ({ username, onLogout }) => {
  const pathname = usePathname();

  const navigationItems = [
    { icon: <FiHome size={20} />, label: 'Dashboard', href: '/student/dashboard' },
    { icon: <FiClipboard size={20} />, label: 'Homework', href: '/student/homework' },
    { icon: <FiPieChart size={20} />, label: 'Analytics', href: '/student/analytics' },
    { icon: <FiBook size={20} />, label: 'Study Materials', href: '/student/materials' },
    { icon: <FiMessageSquare size={20} />, label: 'Messages', href: '/student/messages' },
    { icon: <FiUser size={20} />, label: 'Profile', href: '/student/profile' },
    { icon: <FiHelpCircle size={20} />, label: 'Help', href: '/student/help' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
            <p className="text-xs text-gray-500 truncate">Student</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md group transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-red-600 group transition-colors duration-200"
        >
          <FiLogOut className="mr-3 text-gray-400 group-hover:text-red-500" size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;