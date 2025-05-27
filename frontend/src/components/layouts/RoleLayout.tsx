'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { FiLogOut } from 'react-icons/fi';
import { logout } from '@/redux/slices/authSlice';
import { RootState, AppDispatch } from '@/redux/store';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface RoleLayoutProps {
  expectedRole: string;
  dashboardPath: string;
  badgeContent?: React.ReactNode;
  navItems: NavItem[];
  children: React.ReactNode;
}

const RoleLayout: React.FC<RoleLayoutProps> = ({
  expectedRole,
  dashboardPath,
  badgeContent,
  navItems,
  children,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from Redux, localStorage, or cookies
    const getCurrentUserData = () => {
      // First try Redux store
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        return;
      }

      // Then try localStorage (mock user)
      try {
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          setCurrentUser(userData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing mock user from localStorage:', error);
      }

      // Finally try cookies
      try {
        const cookieUser = Cookies.get('mockUser');
        if (cookieUser) {
          const userData = JSON.parse(cookieUser);
          setCurrentUser(userData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing mock user from cookies:', error);
      }

      // No user found
      setCurrentUser(null);
      setLoading(false);
    };

    getCurrentUserData();
  }, [user]);

  // Normalize roles for comparison
  const normalizeRole = (role: string) => role.toLowerCase().replace('-', '');

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user or role mismatch, redirect to login
  if (!currentUser || normalizeRole(currentUser.role) !== normalizeRole(expectedRole)) {
    if (typeof window !== 'undefined') {
      router.push('/auth/login');
    }
    return null;
  }

  const handleLogout = () => {
    Cookies.remove('mockUser');
    Cookies.remove('accessToken');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('accessToken');
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href={dashboardPath} className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Ionia</span>
              {badgeContent}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{currentUser?.fullName}</span>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                {currentUser?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentUser.avatar} alt={currentUser.fullName} className="h-8 w-8 rounded-full" />
                ) : (
                  <span className="text-emerald-800 font-semibold">
                    {currentUser?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 flex items-center"
              aria-label="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r">
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
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default RoleLayout; 