"use client";

import React from 'react';
import { FiHome, FiBook, FiCheckSquare, FiUser, FiCalendar, FiBarChart2, FiFileText, FiActivity } from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/student/homework', label: 'My Homework', icon: <FiFileText className="mr-2 h-5 w-5" /> },
  { href: '/student/learning-profile', label: 'Learning Profile', icon: <FiActivity className="mr-2 h-5 w-5" /> },
  { href: '/student/results', label: 'My Results', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
  { href: '/student/calendar', label: 'Calendar', icon: <FiCalendar className="mr-2 h-5 w-5" /> },
  { href: '/student/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="student"
      dashboardPath="/student/dashboard"
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 