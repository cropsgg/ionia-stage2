'use client';

import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for announcements
const mockAnnouncements = [
  {
    id: '1',
    title: 'School Closing for Staff Development',
    content: 'The school will be closed on Friday, October 15th for staff development training.',
    target: 'All',
    createdBy: 'John Doe',
    createdAt: '2023-10-01T10:00:00Z',
    published: true
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference Schedule',
    content: 'Parent-teacher conferences will be held from October 20-22. Please check your email for your assigned time slot.',
    target: 'Parents',
    createdBy: 'Jane Smith',
    createdAt: '2023-09-28T15:30:00Z',
    published: true
  },
  {
    id: '3',
    title: 'New Library Hours',
    content: 'Starting next week, the library will be open until 7:00 PM on Tuesdays and Thursdays.',
    target: 'Students, Teachers',
    createdBy: 'John Doe',
    createdAt: '2023-09-25T09:15:00Z',
    published: true
  },
  {
    id: '4',
    title: 'Mathematics Competition Registration',
    content: 'Registration for the annual mathematics competition is now open. Please register by October 30.',
    target: 'Students',
    createdBy: 'Michael Johnson',
    createdAt: '2023-09-20T14:00:00Z',
    published: false
  }
];

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetFilter, setTargetFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAnnouncements = announcements.filter(announcement => {
    // Apply search term filter
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply target filter
    const matchesTarget = targetFilter === 'All' || 
                        announcement.target.includes(targetFilter) ||
                        announcement.target === 'All';
    
    // Apply status filter
    const matchesStatus = statusFilter === 'All' || 
                        (statusFilter === 'Published' && announcement.published) ||
                        (statusFilter === 'Draft' && !announcement.published);
    
    return matchesSearch && matchesTarget && matchesStatus;
  });

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== announcementId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Link 
          href="/management/school-admin/announcements/new" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700"
        >
          <FiPlus className="mr-2" />
          Create Announcement
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search announcements..."
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
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
              >
                <option value="All">All Recipients</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
                <option value="Parents">Parents</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <select 
                className="border-none focus:outline-none text-gray-600 bg-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No announcements found. Create one to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{announcement.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        announcement.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {announcement.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{announcement.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(announcement.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>By: {announcement.createdBy}</span>
                      <span className="mx-2">•</span>
                      <span>To: {announcement.target}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 ml-4">
                    <Link
                      href={`/management/school-admin/announcements/${announcement.id}/edit`}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage; 