"use client";

import React from 'react';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiGrid,
  FiSettings,
  FiClipboard,
  FiBarChart2,
  FiUser
} from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/school-admin/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/users', label: 'User Management', icon: <FiUsers className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/classes', label: 'Class Management', icon: <FiGrid className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/subjects', label: 'Subject Management', icon: <FiBook className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/announcements', label: 'Announcements', icon: <FiClipboard className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/settings', label: 'School Settings', icon: <FiSettings className="mr-2 h-5 w-5" /> },
  { href: '/school-admin/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
];

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="school-admin"
      dashboardPath="/school-admin/dashboard"
      badgeContent={
        <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 rounded-md px-2 py-1">
          School Admin Portal
        </span>
      }
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 