'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for subjects
const MOCK_SUBJECTS = [
  { _id: '201', name: 'Mathematics', subjectCode: 'MATH' },
  { _id: '202', name: 'Physics', subjectCode: 'PHYS' },
  { _id: '203', name: 'Chemistry', subjectCode: 'CHEM' },
  { _id: '204', name: 'Biology', subjectCode: 'BIO' },
  { _id: '205', name: 'English', subjectCode: 'ENG' },
];

const CreateClassPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    yearOrGradeLevel: '',
    subjects: [] as string[], // Array of subject IDs
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      subjects: selectedOptions
    }));
  };

  // Fetch subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // In real implementation:
        // const response = await axios.get('/api/v1/subjects?active=true');
        // setSubjects(response.data.data.subjects);
        
        // Using mock data for now
        setSubjects(MOCK_SUBJECTS);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        // Don't show error for subjects loading, just keep mocks
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name) {
        throw new Error('Class name is required');
      }
      
      // In real implementation:
      // const response = await axios.post('/api/v1/classes', formData);
      
      // Simulate success for now
      console.log('Class would be created with data:', formData);
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/school/classes');
      }, 500);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to create class.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Class</h1>
        <Link 
          href="/school/classes"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Classes
        </Link>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Class Creation Form */}
      <div className="bg-white rounded-md shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Grade 10A or 5th Science"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <input
                  type="text"
                  name="yearOrGradeLevel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Grade 10 or Year 5"
                  value={formData.yearOrGradeLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects (Optional)
                </label>
                <select
                  multiple
                  name="subjects"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.subjects}
                  onChange={handleSubjectChange}
                  size={5}
                >
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} {subject.subjectCode ? `(${subject.subjectCode})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hold Ctrl (or Cmd) to select multiple subjects
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-end">
              <Link
                href="/school/classes"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Create Class
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassPage; 