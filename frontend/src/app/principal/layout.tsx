"use client";

import React from 'react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiBarChart2,
  FiMessageCircle,
  FiSettings,
  FiBook,
  FiUser
} from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/principal/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/principal/users', label: 'Users', icon: <FiUsers className="mr-2 h-5 w-5" /> },
  { href: '/principal/classes', label: 'Classes', icon: <FiGrid className="mr-2 h-5 w-5" /> },
  { href: '/principal/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
  { href: '/principal/announcements', label: 'Announcements', icon: <FiMessageCircle className="mr-2 h-5 w-5" /> },
  { href: '/principal/subjects', label: 'Subjects', icon: <FiBook className="mr-2 h-5 w-5" /> },
  { href: '/principal/settings', label: 'Settings', icon: <FiSettings className="mr-2 h-5 w-5" /> },
  { href: '/principal/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
];

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="principal"
      dashboardPath="/principal/dashboard"
      badgeContent={
        <span className="ml-2 text-xs bg-purple-100 text-purple-800 rounded-md px-2 py-1">
          Principal Portal
        </span>
      }
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 