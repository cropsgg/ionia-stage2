'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiBook, FiCalendar, FiClock, FiFilter, FiSearch } from 'react-icons/fi';

// Define types
type SubjectType = {
  _id: string;
  name: string;
};

type ClassType = {
  _id: string;
  name: string;
};

type HomeworkType = {
  _id: string;
  title: string;
  description: string;
  classId: ClassType;
  subjectId: SubjectType;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  score?: number;
  totalMarks?: number;
  submissionId?: string;
};

// Mock data for initial development
const MOCK_HOMEWORK_SUBMISSIONS: HomeworkType[] = [
  {
    _id: '1',
    title: 'Forces and Motion - Week 3',
    description: 'Complete all questions on Newton\'s laws of motion',
    classId: { _id: '1', name: 'Grade 10A' },
    subjectId: { _id: '202', name: 'Physics' },
    dueDate: '2023-09-15T23:59:59Z',
    status: 'pending',
  },
  {
    _id: '2',
    title: 'Algebra Practice Set',
    description: 'Solve the equations and show your work',
    classId: { _id: '1', name: 'Grade 10A' },
    subjectId: { _id: '201', name: 'Mathematics' },
    dueDate: '2023-09-12T23:59:59Z',
    status: 'submitted',
    submissionId: '101',
  },
  {
    _id: '3',
    title: 'Chemistry Lab Report',
    description: 'Write a lab report based on the experiment conducted in class',
    classId: { _id: '1', name: 'Grade 10A' },
    subjectId: { _id: '203', name: 'Chemistry' },
    dueDate: '2023-09-08T23:59:59Z',
    status: 'graded',
    score: 85,
    totalMarks: 100,
    submissionId: '102',
  },
  {
    _id: '4',
    title: 'Literature Analysis',
    description: 'Analyze the themes in the assigned reading',
    classId: { _id: '1', name: 'Grade 10A' },
    subjectId: { _id: '204', name: 'English' },
    dueDate: '2023-09-05T23:59:59Z',
    status: 'late',
    submissionId: '103',
  },
];

const MOCK_SUBJECTS: SubjectType[] = [
  { _id: '201', name: 'Mathematics' },
  { _id: '202', name: 'Physics' },
  { _id: '203', name: 'Chemistry' },
  { _id: '204', name: 'English' },
];

const StudentHomeworkPage = () => {
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkType[]>(MOCK_HOMEWORK_SUBMISSIONS);
  const [subjects, setSubjects] = useState<SubjectType[]>(MOCK_SUBJECTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch homework submissions and subjects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const response = await axios.get('/api/v1/homework/student');
        // setHomeworkSubmissions(response.data.data.homeworkSubmissions);
        
        // const subjectsResponse = await axios.get('/api/v1/subjects');
        // setSubjects(subjectsResponse.data.data.subjects);
        
        // Using mock data for now
        setHomeworkSubmissions(MOCK_HOMEWORK_SUBMISSIONS);
        setSubjects(MOCK_SUBJECTS);
      } catch (err) {
        console.error('Failed to fetch homework:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch homework.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter homework submissions
  const filteredHomework = homeworkSubmissions.filter(hw => {
    const matchesStatus = statusFilter === 'all' || hw.status === statusFilter;
    const matchesSubject = !subjectFilter || hw.subjectId._id === subjectFilter;
    const matchesSearch = !searchTerm || 
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSubject && matchesSearch;
  });

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate if homework is due soon (within 48 hours)
  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 48;
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Homework</h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search homework..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-400" />
          <select
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="late">Late</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <FiBook className="text-gray-400" />
          <select
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Homework List */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredHomework.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No homework found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomework.map((homework) => (
            <div 
              key={homework._id} 
              className={`bg-white rounded-lg shadow overflow-hidden border-t-4 ${
                homework.status === 'graded' ? 'border-green-500' :
                homework.status === 'submitted' ? 'border-blue-500' :
                homework.status === 'late' ? 'border-orange-500' :
                isDueSoon(homework.dueDate) ? 'border-yellow-500' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {homework.title}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(homework.status)}`}>
                    {homework.status.charAt(0).toUpperCase() + homework.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {homework.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiBook className="mr-1" />
                    {homework.subjectId.name}
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {formatDueDate(homework.dueDate)}
                  </div>
                </div>
                
                {homework.status === 'graded' && homework.score !== undefined && homework.totalMarks !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Score</span>
                      <span className="font-semibold">{homework.score}/{homework.totalMarks} ({Math.round(homework.score / homework.totalMarks * 100)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          homework.score / homework.totalMarks >= 0.7 ? 'bg-green-500' :
                          homework.score / homework.totalMarks >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(homework.score / homework.totalMarks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {homework.status === 'pending' && isDueSoon(homework.dueDate) && (
                  <div className="flex items-center text-yellow-600 text-sm mb-4">
                    <FiClock className="mr-1" />
                    Due soon
                  </div>
                )}
                
                <div className="mt-4">
                  {homework.status === 'pending' && (
                    <Link 
                      href={`/student/homework/${homework._id}`}
                      className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700"
                    >
                      Start Homework
                    </Link>
                  )}
                  
                  {(homework.status === 'submitted' || homework.status === 'late') && (
                    <Link 
                      href={`/student/homework/${homework._id}/submission/${homework.submissionId}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700"
                    >
                      View Submission
                    </Link>
                  )}
                  
                  {homework.status === 'graded' && (
                    <Link 
                      href={`/student/homework/${homework._id}/submission/${homework.submissionId}`}
                      className="block w-full bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700"
                    >
                      View Feedback
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Learning style preferences notice */}
      <div className="mt-12 p-5 bg-indigo-50 rounded-lg">
        <h2 className="text-lg font-semibold text-indigo-800 mb-2">
          Personalized Learning
        </h2>
        <p className="text-indigo-700 mb-3">
          Your homework is personalized based on your learning style and performance.
        </p>
        <Link
          href="/student/learning-profile"
          className="text-indigo-600 font-medium hover:underline"
        >
          View and update your learning preferences →
        </Link>
      </div>
    </div>
  );
};

export default StudentHomeworkPage; 