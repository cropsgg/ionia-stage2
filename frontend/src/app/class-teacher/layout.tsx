"use client";

import React from 'react';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBookOpen,
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiUser
} from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/class-teacher/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/overview', label: 'Class Overview', icon: <FiGrid className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/students', label: 'Students', icon: <FiUsers className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/homework', label: 'Homework', icon: <FiFileText className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/subjects', label: 'Subjects', icon: <FiBook className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/content', label: 'Content Library', icon: <FiBookOpen className="mr-2 h-5 w-5" /> },
  { href: '/class-teacher/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
];

export default function ClassTeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="class-teacher"
      dashboardPath="/class-teacher/dashboard"
      badgeContent={
        <span className="ml-2 text-xs bg-purple-100 text-purple-800 rounded-md px-2 py-1">
          Class Teacher Portal
        </span>
      }
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 