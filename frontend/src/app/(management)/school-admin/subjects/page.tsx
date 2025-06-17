'use client';

import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for subjects
const mockSubjects = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Core mathematics curriculum covering algebra, geometry, and calculus',
    grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    teachers: ['John Doe', 'Jane Smith'],
    status: 'Active'
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHYS',
    description: 'Study of matter, energy, and their interactions',
    grades: ['Grade 11', 'Grade 12'],
    teachers: ['Michael Brown'],
    status: 'Active'
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHEM',
    description: 'Study of composition, structure, properties, and change of matter',
    grades: ['Grade 11', 'Grade 12'],
    teachers: ['Sarah Wilson'],
    status: 'Active'
  },
  {
    id: '4',
    name: 'Biology',
    code: 'BIO',
    description: 'Study of living organisms and their interactions',
    grades: ['Grade 11', 'Grade 12'],
    teachers: ['Emily Davis'],
    status: 'Inactive'
  },
  {
    id: '5',
    name: 'English Literature',
    code: 'ENG',
    description: 'Study of literature written in the English language',
    grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    teachers: ['Robert Taylor', 'Jennifer Adams'],
    status: 'Active'
  }
];

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const allGrades = [...new Set(mockSubjects.flatMap(subject => subject.grades))].sort();

  const filteredSubjects = subjects.filter(subject => {
    // Apply search term filter
    const matchesSearch = 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply grade filter
    const matchesGrade = gradeFilter === 'All' || subject.grades.includes(gradeFilter);
    
    // Apply status filter
    const matchesStatus = statusFilter === 'All' || subject.status === statusFilter;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <Link 
          href="/management/school-admin/subjects/new" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700"
        >
          <FiPlus className="mr-2" />
          Add New Subject
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search subjects..."
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
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="All">All Grades</option>
                {allGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <select 
                className="border-none focus:outline-none text-gray-600 bg-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No subjects found. Create one to get started.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers
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
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                    <div className="text-sm text-gray-500">{subject.code} - {subject.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {subject.grades.map(grade => (
                        <span 
                          key={grade} 
                          className="px-2 py-1 text-xs rounded-md bg-emerald-50 text-emerald-700"
                        >
                          {grade}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {subject.teachers.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subject.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/management/school-admin/subjects/${subject.id}/edit`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
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