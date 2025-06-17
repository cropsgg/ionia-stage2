'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers, FiBook } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for initial development
const MOCK_CLASSES = [
  {
    _id: '1',
    name: 'Grade 10A',
    yearOrGradeLevel: 'Grade 10',
    classTeacherId: {
      _id: '101',
      fullName: 'John Smith',
    },
    subjects: [
      { _id: '201', name: 'Mathematics' },
      { _id: '202', name: 'Physics' },
    ],
    students: ['301', '302', '303'], // Student IDs
    isActive: true,
    createdAt: '2023-06-01T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Grade 9B',
    yearOrGradeLevel: 'Grade 9',
    classTeacherId: {
      _id: '102',
      fullName: 'Jane Doe',
    },
    subjects: [
      { _id: '201', name: 'Mathematics' },
      { _id: '203', name: 'Chemistry' },
    ],
    students: ['304', '305', '306'], // Student IDs
    isActive: true,
    createdAt: '2023-06-02T00:00:00.000Z'
  }
];

const ClassesPage = () => {
  const router = useRouter();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);

  // Replace with actual API call when backend is ready
  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeFilter !== null) params.append('active', activeFilter.toString());
      
      // When using real API:
      // const response = await axios.get(`/api/v1/classes?${params.toString()}`);
      // setClasses(response.data.data.classes);
      
      // Mock filtering for now
      const filtered = MOCK_CLASSES.filter(cls => {
        const matchesSearch = searchTerm ? 
          cls.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
          true;
        
        const matchesActive = activeFilter !== null ? 
          cls.isActive === activeFilter : 
          true;
        
        return matchesSearch && matchesActive;
      });
      
      setClasses(filtered);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to fetch classes.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch classes on mount and when filters change
  useEffect(() => {
    fetchClasses();
  }, [searchTerm, activeFilter]);

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // When using real API:
      // await axios.delete(`/api/v1/classes/${classId}`);
      // Optimistically update UI
      setClasses(prevClasses => prevClasses.filter(cls => cls._id !== classId));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to delete class.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while deleting the class.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Link 
          href="/school/classes/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add New Class
        </Link>
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
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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

      {/* Classes List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No classes found. Create your first class to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
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
              {classes.map((cls) => (
                <tr key={cls._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{cls.yearOrGradeLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {cls.classTeacherId ? cls.classTeacherId.fullName : 'Not Assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {cls.subjects.length} {cls.subjects.length === 1 ? 'Subject' : 'Subjects'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {cls.students.length} {cls.students.length === 1 ? 'Student' : 'Students'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cls.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cls.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/school/classes/${cls._id}/students`} 
                        className="text-blue-600 hover:text-blue-900"
                        title="Manage Students"
                      >
                        <FiUsers />
                      </Link>
                      <Link 
                        href={`/school/classes/${cls._id}/subjects`} 
                        className="text-purple-600 hover:text-purple-900"
                        title="Manage Subjects"
                      >
                        <FiBook />
                      </Link>
                      <Link 
                        href={`/school/classes/${cls._id}/edit`} 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Class"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDeleteClass(cls._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Class"
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
      </div>
    </div>
  );
};

export default ClassesPage; 