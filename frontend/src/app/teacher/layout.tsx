"use client";

import React from 'react';
import { 
  FiHome, FiBook, FiBookOpen, FiGrid, FiFileText, FiLayers, FiUser 
} from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/teacher/classes', label: 'Classes', icon: <FiGrid className="mr-2 h-5 w-5" /> },
  { href: '/teacher/subjects', label: 'Subjects', icon: <FiBook className="mr-2 h-5 w-5" /> },
  { href: '/teacher/homework', label: 'Homework', icon: <FiFileText className="mr-2 h-5 w-5" /> },
  { href: '/teacher/submissions', label: 'Submissions', icon: <FiLayers className="mr-2 h-5 w-5" /> },
  { href: '/teacher/content', label: 'Content Library', icon: <FiBookOpen className="mr-2 h-5 w-5" /> },
  { href: '/teacher/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="teacher"
      dashboardPath="/teacher/dashboard"
      badgeContent={
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-md px-2 py-1">
          Teacher Portal
        </span>
      }
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 