"use client";

import React from 'react';
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiBarChart2,
  FiGlobe,
  FiUser
} from 'react-icons/fi';
import RoleLayout, { NavItem } from '@/components/layouts/RoleLayout';

const navItems: NavItem[] = [
  { href: '/super-admin/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/schools', label: 'Schools', icon: <FiBriefcase className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/users', label: 'Users', icon: <FiUsers className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/regions', label: 'Regions', icon: <FiGlobe className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/settings', label: 'System Settings', icon: <FiSettings className="mr-2 h-5 w-5" /> },
  { href: '/super-admin/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout
      expectedRole="super-admin"
      dashboardPath="/super-admin/dashboard"
      badgeContent={
        <span className="ml-2 text-xs bg-amber-100 text-amber-800 rounded-md px-2 py-1">
          Super Admin Portal
        </span>
      }
      navItems={navItems}
    >
      {children}
    </RoleLayout>
  );
} 