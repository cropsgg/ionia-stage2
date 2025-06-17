'use client';

import React, { useState } from 'react';
import { FiFilter, FiSearch, FiCalendar, FiPaperclip, FiClock } from 'react-icons/fi';

// Mock data for homework assignments
const MOCK_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Mathematics Assignment - Quadratic Equations',
    subject: 'Mathematics',
    dueDate: '2023-10-15',
    assignedDate: '2023-10-08',
    status: 'pending',
    hasAttachments: true,
    teacher: 'Mr. John Smith'
  },
  {
    id: '2',
    title: 'Essay on Environmental Conservation',
    subject: 'English',
    dueDate: '2023-10-18',
    assignedDate: '2023-10-05',
    status: 'pending',
    hasAttachments: true,
    teacher: 'Ms. Emily Davis'
  },
  {
    id: '3',
    title: 'Chemistry Lab Report - Acid Base Titration',
    subject: 'Chemistry',
    dueDate: '2023-10-12',
    assignedDate: '2023-10-01',
    status: 'submitted',
    hasAttachments: false,
    teacher: 'Dr. Sarah Wilson'
  },
  {
    id: '4',
    title: 'History Research Project - Ancient Civilizations',
    subject: 'History',
    dueDate: '2023-09-30',
    assignedDate: '2023-09-15',
    status: 'graded',
    grade: 'A-',
    comments: 'Excellent research, but could improve on citations.',
    hasAttachments: true,
    teacher: 'Mr. Robert Lee'
  }
];

const HomeworkPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(MOCK_ASSIGNMENTS.map(a => a.subject))];

  // Filter assignments based on search and filters
  const filteredAssignments = MOCK_ASSIGNMENTS.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Homework</h1>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select 
                className="border-none focus:outline-none text-gray-600 bg-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <select 
                className="border-none focus:outline-none text-gray-600 bg-transparent"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.filter(s => s !== 'all').map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No homework assignments found</p>
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{assignment.title}</h2>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Subject:</span>
                  <span>{assignment.subject}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-emerald-500" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2 text-emerald-500" />
                  <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-gray-100">
                <div className="flex items-center mb-3 md:mb-0">
                  <span className="text-sm text-gray-600 mr-3">Teacher: {assignment.teacher}</span>
                  {assignment.hasAttachments && (
                    <span className="flex items-center text-sm text-emerald-600">
                      <FiPaperclip className="mr-1" /> Has attachments
                    </span>
                  )}
                </div>
                
                <div>
                  {assignment.status === 'graded' ? (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Grade:</span>
                      <span className="text-emerald-600 font-bold">{assignment.grade}</span>
                    </div>
                  ) : assignment.status === 'pending' ? (
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                      Submit Assignment
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors">
                      View Submission
                    </button>
                  )}
                </div>
              </div>
              
              {assignment.status === 'graded' && assignment.comments && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Feedback:</span> {assignment.comments}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeworkPage;