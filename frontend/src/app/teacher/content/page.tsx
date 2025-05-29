'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiFolder, FiFile, FiUpload, FiDownload, FiSearch, FiFilter,
  FiMoreVertical, FiPlus, FiEye, FiEdit, FiTrash2, FiShare2,
  FiBook, FiVideo, FiImage, FiFileText, FiLink, FiTag,
  FiCalendar, FiUsers, FiStar, FiHeart, FiCopy, FiGrid,
  FiList, FiSettings, FiPlay, FiPause
} from 'react-icons/fi';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'image' | 'presentation' | 'link' | 'quiz';
  subject: string;
  grade: string;
  tags: string[];
  fileSize?: string;
  duration?: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  isPublic: boolean;
  downloads: number;
  views: number;
  likes: number;
  thumbnail?: string;
  url: string;
  category: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: Date;
  color: string;
}

const TeacherContentPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Mock content data
    const mockFolders: Folder[] = [
      {
        id: '1',
        name: 'Mathematics Resources',
        description: 'Algebra, Geometry, and Calculus materials',
        itemCount: 24,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        color: 'blue'
      },
      {
        id: '2',
        name: 'Science Experiments',
        description: 'Lab materials and demonstration videos',
        itemCount: 18,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        color: 'green'
      },
      {
        id: '3',
        name: 'Lesson Plans',
        description: 'Ready-to-use lesson plans and templates',
        itemCount: 32,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        color: 'purple'
      }
    ];

    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Quadratic Equations Guide',
        description: 'Comprehensive guide to solving quadratic equations with examples',
        type: 'document',
        subject: 'Mathematics',
        grade: '10th Grade',
        tags: ['algebra', 'equations', 'mathematics'],
        fileSize: '2.3 MB',
        uploadedBy: user?.name || 'Teacher',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isPublic: true,
        downloads: 45,
        views: 128,
        likes: 12,
        url: '/content/quadratic_guide.pdf',
        category: 'Study Material'
      },
      {
        id: '2',
        title: 'Photosynthesis Animation',
        description: 'Interactive animation explaining the process of photosynthesis',
        type: 'video',
        subject: 'Biology',
        grade: '9th Grade',
        tags: ['biology', 'photosynthesis', 'plants'],
        duration: '8:45',
        uploadedBy: user?.name || 'Teacher',
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isPublic: true,
        downloads: 23,
        views: 89,
        likes: 8,
        thumbnail: '/thumbnails/photosynthesis.jpg',
        url: '/content/photosynthesis_animation.mp4',
        category: 'Video Lesson'
      },
      {
        id: '3',
        title: 'Python Programming Basics',
        description: 'Introduction to Python programming with hands-on examples',
        type: 'presentation',
        subject: 'Computer Science',
        grade: '11th Grade',
        tags: ['programming', 'python', 'coding'],
        fileSize: '5.7 MB',
        uploadedBy: user?.name || 'Teacher',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isPublic: false,
        downloads: 67,
        views: 156,
        likes: 19,
        url: '/content/python_basics.pptx',
        category: 'Presentation'
      },
      {
        id: '4',
        title: 'World War II Timeline',
        description: 'Interactive timeline of major events in World War II',
        type: 'link',
        subject: 'History',
        grade: '10th Grade',
        tags: ['history', 'world war', 'timeline'],
        uploadedBy: user?.name || 'Teacher',
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        isPublic: true,
        downloads: 0,
        views: 234,
        likes: 15,
        url: 'https://timeline.worldwar2.com',
        category: 'Interactive Resource'
      },
      {
        id: '5',
        title: 'Algebra Quiz',
        description: 'Practice quiz on basic algebraic operations',
        type: 'quiz',
        subject: 'Mathematics',
        grade: '9th Grade',
        tags: ['algebra', 'quiz', 'practice'],
        uploadedBy: user?.name || 'Teacher',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPublic: true,
        downloads: 78,
        views: 189,
        likes: 23,
        url: '/quizzes/algebra_basics',
        category: 'Assessment'
      }
    ];

    setFolders(mockFolders);
    setContentItems(mockContent);
  }, [user]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FiFileText className="h-5 w-5" />;
      case 'video': return <FiVideo className="h-5 w-5" />;
      case 'image': return <FiImage className="h-5 w-5" />;
      case 'presentation': return <FiBook className="h-5 w-5" />;
      case 'link': return <FiLink className="h-5 w-5" />;
      case 'quiz': return <FiStar className="h-5 w-5" />;
      default: return <FiFile className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-100';
      case 'video': return 'text-red-600 bg-red-100';
      case 'image': return 'text-green-600 bg-green-100';
      case 'presentation': return 'text-purple-600 bg-purple-100';
      case 'link': return 'text-orange-600 bg-orange-100';
      case 'quiz': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFolderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      case 'purple': return 'text-purple-600 bg-purple-100';
      case 'red': return 'text-red-600 bg-red-100';
      case 'orange': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      case 'popular':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const subjects = Array.from(new Set(contentItems.map(item => item.subject)));
  const totalViews = contentItems.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = contentItems.reduce((sum, item) => sum + item.likes, 0);
  const totalDownloads = contentItems.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600 mt-1">Manage your educational resources and materials</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {viewMode === 'grid' ? <FiList className="h-4 w-4" /> : <FiGrid className="h-4 w-4" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiUpload className="h-4 w-4" />
            Upload Content
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiFile size={20} className="text-blue-600" />}
            title="Total Items"
            value={contentItems.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiEye size={20} className="text-green-600" />}
            title="Total Views"
            value={totalViews}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiDownload size={20} className="text-purple-600" />}
            title="Downloads"
            value={totalDownloads}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiHeart size={20} className="text-red-600" />}
            title="Total Likes"
            value={totalLikes}
          />
        </Card>
      </div>

      {/* Folders Section */}
      <Card title="Folders" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedFolder(folder.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${getFolderColor(folder.color)}`}>
                  <FiFolder className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{folder.name}</h3>
                  <p className="text-sm text-gray-600">{folder.itemCount} items</p>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{folder.description}</p>
            </div>
          ))}
          
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors flex items-center justify-center">
            <div className="text-center">
              <FiPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Create New Folder</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
          <option value="image">Images</option>
          <option value="presentation">Presentations</option>
          <option value="link">Links</option>
          <option value="quiz">Quizzes</option>
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="likes">Most Liked</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedContent.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{item.subject}</span>
                <span>{item.uploadedAt.toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FiEye className="h-3 w-3" />
                    {item.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart className="h-3 w-3" />
                    {item.likes}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiEye className="h-3 w-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiDownload className="h-3 w-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiShare2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedContent.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {!item.isPublic && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{item.subject} • {item.grade}</span>
                      <span>{item.uploadedAt.toLocaleDateString()}</span>
                      {item.fileSize && <span>{item.fileSize}</span>}
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{item.views}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{item.downloads}</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{item.likes}</div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                      <FiDownload className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                      <FiShare2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <FiMoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {sortedContent.length === 0 && (
        <div className="text-center py-12">
          <FiFile className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Upload Your First Content
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherContentPage; 