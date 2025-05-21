"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'student') {
        router.push('/student/dashboard');
      } else if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'class-teacher') {
        router.push('/class-teacher/dashboard');
      } else if (user.role === 'school-admin') {
        router.push('/school-admin/dashboard');
      } else if (user.role === 'super-admin') {
        router.push('/super-admin/dashboard');
      } else {
        // Default fallback
        router.push('/auth/login');
      }
    } else {
      // Not authenticated, go to login
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
        <h2 className="text-lg font-medium text-gray-700">Redirecting to your dashboard...</h2>
        </div>
        </div>
  );
} 