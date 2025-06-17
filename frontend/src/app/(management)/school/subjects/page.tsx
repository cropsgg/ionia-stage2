'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for initial development
const MOCK_SUBJECTS = [
  {
    _id: '201',
    name: 'Mathematics',
    subjectCode: 'MATH',
    description: 'Core mathematics curriculum covering algebra, geometry, and calculus',
    associatedGradeLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    isActive: true
  },
  {
    _id: '202',
    name: 'Physics',
    subjectCode: 'PHYS',
    description: 'Study of matter, energy, and their interactions',
    associatedGradeLevels: ['Grade 11', 'Grade 12'],
    isActive: true
  },
  {
    _id: '203',
    name: 'Chemistry',
    subjectCode: 'CHEM',
    description: 'Study of the composition, structure, properties, and change of matter',
    associatedGradeLevels: ['Grade 11', 'Grade 12'],
    isActive: true
  },
  {
    _id: '204',
    name: 'Biology',
    subjectCode: 'BIO',
    description: 'Study of living organisms and their interactions',
    associatedGradeLevels: ['Grade 11', 'Grade 12'],
    isActive: false
  }
];

const SubjectsPage = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [gradeLevelFilter, setGradeLevelFilter] = useState('');

  // Unique grade levels from subjects
  const allGradeLevels = [...new Set(
    MOCK_SUBJECTS.flatMap(subject => subject.associatedGradeLevels)
  )].sort();

  // Replace with actual API call when backend is ready
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeFilter !== null) params.append('active', activeFilter.toString());
      if (gradeLevelFilter) params.append('gradeLevel', gradeLevelFilter);
      
      // When using real API:
      // const response = await axios.get(`/api/v1/subjects?${params.toString()}`);
      // setSubjects(response.data.data.subjects);
      
      // Mock filtering for now
      const filtered = MOCK_SUBJECTS.filter(subject => {
        const matchesSearch = searchTerm ? 
          (subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase()))) : 
          true;
        
        const matchesActive = activeFilter !== null ? 
          subject.isActive === activeFilter : 
          true;
        
        const matchesGradeLevel = gradeLevelFilter ? 
          subject.associatedGradeLevels.includes(gradeLevelFilter) : 
          true;
        
        return matchesSearch && matchesActive && matchesGradeLevel;
      });
      
      setSubjects(filtered);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to fetch subjects.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch subjects on mount and when filters change
  useEffect(() => {
    fetchSubjects();
  }, [searchTerm, activeFilter, gradeLevelFilter]);

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // When using real API:
      // await axios.delete(`/api/v1/subjects/${subjectId}`);
      
      // Optimistically update UI
      setSubjects(prevSubjects => prevSubjects.filter(subject => subject._id !== subjectId));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to delete subject.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while deleting the subject.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Link 
          href="/school/subjects/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add New Subject
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
            placeholder="Search by name or code..."
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
        
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={gradeLevelFilter}
          onChange={(e) => setGradeLevelFilter(e.target.value)}
        >
          <option value="">All Grade Levels</option>
          {allGradeLevels.map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Subjects List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No subjects found. Create your first subject to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Levels
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
              {subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subject.subjectCode || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {subject.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {subject.associatedGradeLevels.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subject.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link 
                        href={`/school/subjects/${subject._id}/edit`} 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Subject"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Subject"
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

export default SubjectsPage; 