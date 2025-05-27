"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Legacy mock users for manual testing
      const mockUsers = {
        'student@example.com': { role: 'student', fullName: 'Student User' },
        'teacher@example.com': { role: 'teacher', fullName: 'Teacher User' },
        'class-teacher@example.com': { role: 'class-teacher', fullName: 'Class Teacher User' },
        'school-admin@example.com': { role: 'school-admin', fullName: 'School Admin User' },
        'super-admin@example.com': { role: 'super-admin', fullName: 'Super Admin User' },
      };
      
      // Also support backend demo credentials
      const backendMockUsers = {
        'student@demo.ionia.sbs': { role: 'student', fullName: 'Student User' },
        'teacher@demo.ionia.sbs': { role: 'teacher', fullName: 'Teacher User' },
        'classteacher@demo.ionia.sbs': { role: 'classTeacher', fullName: 'Class Teacher User' },
        'admin@demo.ionia.sbs': { role: 'schoolAdmin', fullName: 'School Admin User' },
        'superadmin@ionia.sbs': { role: 'superAdmin', fullName: 'Super Admin User' },
      };
      
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (password === 'password123') {
        let user = mockUsers[email as keyof typeof mockUsers] || backendMockUsers[email as keyof typeof backendMockUsers];
        
        if (user) {
          // Store the mock user in cookie for middleware
          Cookies.set('mockUser', JSON.stringify(user));
          Cookies.set('accessToken', 'mock-jwt-token'); // Add accessToken cookie for middleware
          
          // Also store in localStorage for client side
          localStorage.setItem('accessToken', 'mock-jwt-token');
          localStorage.setItem('mockUser', JSON.stringify(user));
          
          // Redirect based on role (handle both role formats)
          const role = user.role;
          if (role === 'student') {
            router.push('/student/dashboard');
          } else if (role === 'teacher') {
            router.push('/teacher/dashboard');
          } else if (role === 'class-teacher' || role === 'classTeacher') {
            router.push('/class-teacher/dashboard');
          } else if (role === 'school-admin' || role === 'schoolAdmin') {
            router.push('/school-admin/dashboard');
          } else {
            // super-admin or superAdmin
            router.push('/super-admin/dashboard');
          }
          return;
        }
      }
      
      throw new Error('Invalid email or password');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-600">Ionia</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
              contact your administrator for access
            </a>
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              disabled={loading}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" />
                </span>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600">
            <p>Demo accounts for testing:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="text-xs bg-gray-100 p-2 rounded">
                <div><strong>Student:</strong> student@demo.ionia.sbs</div>
                <div><strong>Pass:</strong> password123</div>
              </div>
              <div className="text-xs bg-gray-100 p-2 rounded">
                <div><strong>Teacher:</strong> teacher@demo.ionia.sbs</div>
                <div><strong>Pass:</strong> password123</div>
              </div>
              <div className="text-xs bg-gray-100 p-2 rounded">
                <div><strong>Class Teacher:</strong> classteacher@demo.ionia.sbs</div>
                <div><strong>Pass:</strong> password123</div>
              </div>
              <div className="text-xs bg-gray-100 p-2 rounded">
                <div><strong>School Admin:</strong> admin@demo.ionia.sbs</div>
                <div><strong>Pass:</strong> password123</div>
              </div>
              <div className="text-xs bg-gray-100 p-2 rounded md:col-span-2">
                <div><strong>Super Admin:</strong> superadmin@ionia.sbs</div>
                <div><strong>Pass:</strong> password123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 