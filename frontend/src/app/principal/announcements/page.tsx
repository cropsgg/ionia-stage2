'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiMail, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit,
  FiTrash2, FiEye, FiSend, FiUsers, FiCalendar, FiClock,
  FiAlertCircle, FiCheckCircle, FiPaperclip, FiTarget
} from 'react-icons/fi';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  attachments: string[];
  tags: string[];
}

const PrincipalAnnouncementsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');

  useEffect(() => {
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Parent-Teacher Conference Week',
        content: 'We are pleased to announce that Parent-Teacher Conference Week will be held from December 4-8, 2024. This is an excellent opportunity for parents to meet with teachers and discuss their child\'s progress.',
        author: user?.name || 'Principal',
        authorId: user?.id || '1',
        targetAudience: 'parents',
        priority: 'high',
        status: 'published',
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: 342,
        attachments: ['conference_schedule.pdf'],
        tags: ['parent-teacher', 'conference', 'important']
      },
      {
        id: '2',
        title: 'Winter Break Schedule',
        content: 'Please note that winter break will begin on December 20, 2024, and classes will resume on January 8, 2025. Have a wonderful holiday season!',
        author: user?.name || 'Principal',
        authorId: user?.id || '1',
        targetAudience: 'all',
        priority: 'normal',
        status: 'published',
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2025, 0, 8),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: 856,
        attachments: [],
        tags: ['holiday', 'schedule', 'winter-break']
      },
      {
        id: '3',
        title: 'New Safety Protocols',
        content: 'We have implemented new safety protocols to ensure the wellbeing of all students and staff. Please review the attached document for detailed information.',
        author: 'Safety Coordinator',
        authorId: '2',
        targetAudience: 'staff',
        priority: 'urgent',
        status: 'published',
        publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: 124,
        attachments: ['safety_protocols.pdf', 'emergency_procedures.pdf'],
        tags: ['safety', 'protocols', 'urgent', 'staff']
      },
      {
        id: '4',
        title: 'Science Fair Registration',
        content: 'Registration is now open for the annual science fair. Students interested in participating should submit their project proposals by November 30, 2024.',
        author: 'Science Department',
        authorId: '3',
        targetAudience: 'students',
        priority: 'normal',
        status: 'published',
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2024, 10, 30),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        views: 289,
        attachments: ['science_fair_guidelines.pdf'],
        tags: ['science', 'fair', 'registration', 'students']
      },
      {
        id: '5',
        title: 'Budget Review Meeting',
        content: 'The quarterly budget review meeting will be held on December 15, 2024, at 2:00 PM in the conference room. All department heads are required to attend.',
        author: user?.name || 'Principal',
        authorId: user?.id || '1',
        targetAudience: 'staff',
        priority: 'normal',
        status: 'draft',
        publishDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        views: 0,
        attachments: [],
        tags: ['budget', 'meeting', 'staff']
      }
    ];

    setAnnouncements(mockAnnouncements);
  }, [user]);

  const handleAnnouncementSelect = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setViewMode('detail');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'text-purple-600 bg-purple-100';
      case 'students': return 'text-blue-600 bg-blue-100';
      case 'teachers': return 'text-green-600 bg-green-100';
      case 'parents': return 'text-orange-600 bg-orange-100';
      case 'staff': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesAudience = filterAudience === 'all' || announcement.targetAudience === filterAudience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const totalViews = announcements.reduce((sum, ann) => sum + ann.views, 0);
  const publishedCount = announcements.filter(ann => ann.status === 'published').length;
  const draftCount = announcements.filter(ann => ann.status === 'draft').length;
  const scheduledCount = announcements.filter(ann => ann.status === 'scheduled').length;

  if (viewMode === 'detail' && selectedAnnouncement) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('list')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Announcements
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedAnnouncement.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedAnnouncement.priority)}`}>
                {selectedAnnouncement.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAnnouncement.status)}`}>
                {selectedAnnouncement.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceColor(selectedAnnouncement.targetAudience)}`}>
                {selectedAnnouncement.targetAudience}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiSend className="h-4 w-4" />
              Resend
            </button>
          </div>
        </div>

        {/* Announcement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiEye size={20} className="text-blue-600" />}
              title="Views"
              value={selectedAnnouncement.views}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiCalendar size={20} className="text-green-600" />}
              title="Published"
              value={selectedAnnouncement.publishDate.toLocaleDateString()}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-purple-600" />}
              title="Audience"
              value={selectedAnnouncement.targetAudience}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiPaperclip size={20} className="text-orange-600" />}
              title="Attachments"
              value={selectedAnnouncement.attachments.length}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Content */}
          <div className="xl:col-span-2">
            <Card title="Content" className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedAnnouncement.content}</p>
              </div>

              {selectedAnnouncement.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {selectedAnnouncement.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FiPaperclip className="h-4 w-4 text-gray-400" />
                        <span className="flex-1 text-sm">{attachment}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnnouncement.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <Card title="Details" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Author</label>
                  <p className="font-medium">{selectedAnnouncement.author}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created</label>
                  <p className="font-medium">{selectedAnnouncement.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Updated</label>
                  <p className="font-medium">{selectedAnnouncement.updatedAt.toLocaleDateString()}</p>
                </div>
                {selectedAnnouncement.expiryDate && (
                  <div>
                    <label className="text-sm text-gray-600">Expires</label>
                    <p className="font-medium">{selectedAnnouncement.expiryDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEdit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit Announcement</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSend className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Send Reminder</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiUsers className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">View Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Delete</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Announcements</h1>
          <p className="text-gray-600 mt-1">Manage school-wide communications</p>
        </div>
        
        <button 
          onClick={() => setViewMode('create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="h-4 w-4" />
          Create Announcement
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiMail size={20} className="text-blue-600" />}
            title="Total Announcements"
            value={announcements.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiCheckCircle size={20} className="text-green-600" />}
            title="Published"
            value={publishedCount}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiClock size={20} className="text-yellow-600" />}
            title="Drafts"
            value={draftCount}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiEye size={20} className="text-purple-600" />}
            title="Total Views"
            value={totalViews}
          />
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filterAudience}
          onChange={(e) => setFilterAudience(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Audiences</option>
          <option value="all">Everyone</option>
          <option value="students">Students</option>
          <option value="teachers">Teachers</option>
          <option value="parents">Parents</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="cursor-pointer" 
            onClick={() => handleAnnouncementSelect(announcement)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceColor(announcement.targetAudience)}`}>
                      {announcement.targetAudience}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      {announcement.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {announcement.publishDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye className="h-4 w-4" />
                      {announcement.views} views
                    </span>
                    {announcement.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FiPaperclip className="h-4 w-4" />
                        {announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>

              {announcement.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {announcement.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {announcement.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{announcement.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <FiMail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-500 mb-4">Create your first announcement to get started</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create Announcement
          </button>
        </div>
      )}
    </div>
  );
};

export default PrincipalAnnouncementsPage; 