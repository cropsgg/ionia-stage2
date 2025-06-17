'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLock, FiUpload } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for initial development
const MOCK_USERS = [
  {
    _id: '101',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    username: 'johnsmith',
    role: 'classTeacher',
    isActive: true,
    createdAt: '2023-05-01T00:00:00.000Z'
  },
  {
    _id: '102',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    username: 'janedoe',
    role: 'teacher',
    isActive: true,
    createdAt: '2023-05-02T00:00:00.000Z'
  },
  {
    _id: '301',
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    username: 'alexj',
    role: 'student',
    isActive: true,
    createdAt: '2023-05-03T00:00:00.000Z'
  },
  {
    _id: '302',
    fullName: 'Sam Williams',
    email: 'sam.williams@example.com',
    username: 'samw',
    role: 'student',
    isActive: false,
    createdAt: '2023-05-04T00:00:00.000Z'
  }
];

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);

  // Replace with actual API call when backend is ready
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);
      if (activeFilter !== null) params.append('active', activeFilter.toString());
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      
      // When using real API:
      // const response = await axios.get(`/api/v1/school-admin/users?${params.toString()}`);
      // setUsers(response.data.data.users);
      // setTotalPages(response.data.data.pagination.pages);
      
      // Mock filtering for now
      const filtered = MOCK_USERS.filter(user => {
        const matchesSearch = searchTerm ? 
          (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.username.toLowerCase().includes(searchTerm.toLowerCase())) : 
          true;
        
        const matchesRole = roleFilter ? 
          user.role === roleFilter : 
          true;
        
        const matchesActive = activeFilter !== null ? 
          user.isActive === activeFilter : 
          true;
        
        return matchesSearch && matchesRole && matchesActive;
      });
      
      setUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / 10));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to fetch users.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, activeFilter, currentPage]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // When using real API:
      // await axios.delete(`/api/v1/school-admin/users/${userId}`);
      
      // Optimistically update UI
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to delete user.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while deleting the user.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) {
      return;
    }

    const newPassword = prompt('Enter new password (minimum 8 characters):');
    
    if (!newPassword) return;
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    
    setLoading(true);
    try {
      // When using real API:
      // await axios.post(`/api/v1/school-admin/users/${userId}/reset-password`, { newPassword });
      
      // Show success
      alert('Password reset successfully.');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to reset password.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while resetting the password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'teacher':
        return 'Teacher';
      case 'classTeacher':
        return 'Class Teacher';
      case 'schoolAdmin':
        return 'School Admin';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
          >
            <FiUpload className="mr-2" />
            Import Users
          </button>
          <Link 
            href="/school/users/new" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" />
            Add New User
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name, email, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="classTeacher">Class Teachers</option>
        </select>
        
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={activeFilter === null ? '' : activeFilter.toString()}
          onChange={(e) => {
            const value = e.target.value;
            setActiveFilter(value === '' ? null : value === 'true');
          }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No users found. Create your first user to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatRole(user.role)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Reset Password"
                      >
                        <FiLock />
                      </button>
                      <Link 
                        href={`/school/users/${user._id}/edit`} 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit User"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                        disabled={loading}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'text-indigo-600 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'text-indigo-600 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Users Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Import Users</h2>
            <p className="mb-4 text-gray-600">
              Upload a CSV file with user data to import multiple users at once.
              The file should include columns for full name, email, role, and optionally username.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Password for All Users
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 