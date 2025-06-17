'use client';

import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiUsers, FiBook, FiCalendar, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for classes
const mockClasses = [
  {
    id: '1',
    name: 'Grade 9A',
    students: 32,
    classTeacher: 'Emily Davis',
    subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography'],
    schedule: 'Morning Shift (8:00 AM - 1:30 PM)'
  },
  {
    id: '2',
    name: 'Grade 10B',
    students: 28,
    classTeacher: 'Michael Rodriguez',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English Literature', 'Computer Science'],
    schedule: 'Morning Shift (8:00 AM - 1:30 PM)'
  },
  {
    id: '3',
    name: 'Grade 8C',
    students: 34,
    classTeacher: 'Sarah Wilson',
    subjects: ['Mathematics', 'Science', 'English', 'History', 'Art'],
    schedule: 'Afternoon Shift (1:30 PM - 7:00 PM)'
  },
  {
    id: '4',
    name: 'Grade 11A',
    students: 26,
    classTeacher: 'John Thompson',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    schedule: 'Morning Shift (8:00 AM - 1:30 PM)'
  },
  {
    id: '5',
    name: 'Grade 7B',
    students: 36,
    classTeacher: 'Lisa Martinez',
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Physical Education'],
    schedule: 'Afternoon Shift (1:30 PM - 7:00 PM)'
  }
];

const ClassManagementPage = () => {
  const [classes, setClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('All');

  const filteredClasses = classes.filter(cls => {
    // Apply search term filter
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply schedule filter
    const matchesSchedule = scheduleFilter === 'All' || cls.schedule.includes(scheduleFilter);
    
    return matchesSearch && matchesSchedule;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Management</h1>
        <Link 
          href="/management/school-admin/classes/new" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700"
        >
          <FiPlus className="mr-2" />
          Add New Class
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search classes..."
              className="border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center">
              <select 
                className="border-none focus:outline-none text-gray-600 bg-transparent"
                value={scheduleFilter}
                onChange={(e) => setScheduleFilter(e.target.value)}
              >
                <option value="All">All Schedules</option>
                <option value="Morning">Morning Shift</option>
                <option value="Afternoon">Afternoon Shift</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full bg-white rounded-md shadow p-6 text-center text-gray-500">
            No classes found matching your filters.
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{cls.name}</h2>
                  <Link
                    href={`/management/school-admin/classes/${cls.id}/edit`}
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Students:</span>
                    <span className="ml-2">{cls.students}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-700">
                    <FiUsers className="w-4 h-4 mr-2 text-emerald-600 mt-1" />
                    <div>
                      <span className="font-medium">Class Teacher:</span>
                      <span className="ml-2 block">{cls.classTeacher}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-gray-700">
                    <FiCalendar className="w-4 h-4 mr-2 text-emerald-600 mt-1" />
                    <div>
                      <span className="font-medium">Schedule:</span>
                      <span className="ml-2 block">{cls.schedule}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-gray-700">
                    <FiBook className="w-4 h-4 mr-2 text-emerald-600 mt-1" />
                    <div>
                      <span className="font-medium">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cls.subjects.map((subject, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between">
                <Link
                  href={`/management/school-admin/classes/${cls.id}/students`}
                  className="text-sm text-emerald-600 hover:text-emerald-900 font-medium"
                >
                  View Students
                </Link>
                <Link
                  href={`/management/school-admin/classes/${cls.id}/timetable`}
                  className="text-sm text-emerald-600 hover:text-emerald-900 font-medium"
                >
                  View Timetable
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassManagementPage; 