'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiBookOpen, 
  FiGrid, 
  FiSettings, 
  FiClipboard,
  FiUser,
  FiLogOut, 
  FiBarChart2, 
  FiFileText,
  FiLayers,
  FiBriefcase 
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';

const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Get role-specific navigation items
  const navItems = useMemo(() => {
    const role = user?.role;

    // Super Admin navigation items
    if (role === 'super-admin') {
      return [
        { href: '/super-admin/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
        { href: '/super-admin/schools', label: 'Schools', icon: <FiBriefcase className="mr-2 h-5 w-5" /> },
        { href: '/super-admin/users', label: 'Users', icon: <FiUsers className="mr-2 h-5 w-5" /> },
        { href: '/super-admin/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
        { href: '/super-admin/settings', label: 'System Settings', icon: <FiSettings className="mr-2 h-5 w-5" /> },
        { href: '/super-admin/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
      ];
    }
    
    // School Admin navigation items
    if (role === 'school-admin') {
      return [
        { href: '/school-admin/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/users', label: 'User Management', icon: <FiUsers className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/classes', label: 'Class Management', icon: <FiGrid className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/subjects', label: 'Subject Management', icon: <FiBook className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/announcements', label: 'Announcements', icon: <FiClipboard className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/settings', label: 'School Settings', icon: <FiSettings className="mr-2 h-5 w-5" /> },
        { href: '/school-admin/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
      ];
    }
    
    // Class Teacher navigation items
    if (role === 'class-teacher') {
      return [
        { href: '/class-teacher/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
        { href: '/class-teacher/overview', label: 'Class Overview', icon: <FiGrid className="mr-2 h-5 w-5" /> },
        { href: '/class-teacher/students', label: 'Students', icon: <FiUsers className="mr-2 h-5 w-5" /> },
        { href: '/class-teacher/homework', label: 'Homework', icon: <FiFileText className="mr-2 h-5 w-5" /> },
        { href: '/class-teacher/reports', label: 'Reports', icon: <FiBarChart2 className="mr-2 h-5 w-5" /> },
        { href: '/teacher/subjects', label: 'Subjects', icon: <FiBook className="mr-2 h-5 w-5" /> }, // Can access teacher routes
        { href: '/teacher/content', label: 'Content Library', icon: <FiBookOpen className="mr-2 h-5 w-5" /> }, // Can access teacher routes
        { href: '/class-teacher/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
      ];
    }
    
    // Teacher navigation items
    if (role === 'teacher') {
      return [
        { href: '/teacher/dashboard', label: 'Dashboard', icon: <FiHome className="mr-2 h-5 w-5" /> },
        { href: '/teacher/classes', label: 'Classes', icon: <FiGrid className="mr-2 h-5 w-5" /> },
        { href: '/teacher/subjects', label: 'Subjects', icon: <FiBook className="mr-2 h-5 w-5" /> },
        { href: '/teacher/homework', label: 'Homework', icon: <FiFileText className="mr-2 h-5 w-5" /> },
        { href: '/teacher/submissions', label: 'Submissions', icon: <FiLayers className="mr-2 h-5 w-5" /> },
        { href: '/teacher/content', label: 'Content Library', icon: <FiBookOpen className="mr-2 h-5 w-5" /> },
        { href: '/teacher/profile', label: 'My Profile', icon: <FiUser className="mr-2 h-5 w-5" /> }
      ];
    }
    
    // Default case (should not happen, but providing fallback)
    return [
      { href: '/auth/login', label: 'Login', icon: <FiLogOut className="mr-2 h-5 w-5" /> }
    ];
  }, [user?.role]);

  // Determine which dashboard to link to based on role
  const dashboardLink = useMemo(() => {
    const role = user?.role;
    if (role === 'super-admin') return '/super-admin/dashboard';
    if (role === 'school-admin') return '/school-admin/dashboard';
    if (role === 'class-teacher') return '/class-teacher/dashboard';
    if (role === 'teacher') return '/teacher/dashboard';
    return '/auth/login';
  }, [user?.role]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href={dashboardLink}>
              <span className="text-2xl font-bold text-emerald-600">Ionia</span>
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 rounded-md px-2 py-1">
                Management Portal
              </span>
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

export default ManagementLayout; 