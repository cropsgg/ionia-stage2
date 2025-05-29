/* Placeholder Student Homework page */
'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import { 
  FiSearch, FiFilter, FiCalendar, FiClock, FiFileText, FiBookOpen, 
  FiUpload, FiDownload, FiPlay, FiCheck, FiAlertTriangle, FiStar, 
  FiGrid, FiList, FiRefreshCw
} from 'react-icons/fi';
import Link from 'next/link';

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'assignment' | 'quiz' | 'project' | 'reading';
  dueDate: Date;
  assignedDate: Date;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  maxScore: number;
  submittedScore?: number;
  timeLimit?: number; // in minutes for quizzes
  attempts?: number;
  maxAttempts?: number;
  files?: string[];
  instructions?: string;
  submissionType: 'file' | 'text' | 'quiz' | 'both';
  teacherName: string;
  feedback?: string;
  submittedAt?: Date;
}

const StudentHomework = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [filteredHomework, setFilteredHomework] = useState<Homework[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock homework data
  useEffect(() => {
    const mockHomework: Homework[] = [
      {
        id: '1',
        title: 'Quadratic Equations - Chapter 5',
        description: 'Complete exercises 1-15 from Chapter 5. Focus on solving quadratic equations using factoring and the quadratic formula.',
        subject: 'Mathematics',
        type: 'assignment',
        dueDate: new Date(2024, 0, 20),
        assignedDate: new Date(2024, 0, 15),
        status: 'not_started',
        priority: 'high',
        maxScore: 100,
        submissionType: 'file',
        teacherName: 'Mr. Johnson',
        instructions: 'Show all work clearly. Upload your solutions as PDF or image files.'
      },
      {
        id: '2',
        title: 'Physics Quiz - Motion and Forces',
        description: 'Online quiz covering Newton\'s laws and motion equations',
        subject: 'Science',
        type: 'quiz',
        dueDate: new Date(2024, 0, 22),
        assignedDate: new Date(2024, 0, 18),
        status: 'submitted',
        priority: 'medium',
        maxScore: 50,
        submittedScore: 42,
        timeLimit: 30,
        attempts: 1,
        maxAttempts: 2,
        submissionType: 'quiz',
        teacherName: 'Ms. Smith',
        submittedAt: new Date(2024, 0, 21)
      },
      {
        id: '3',
        title: 'Solar System Research Project',
        description: 'Create a comprehensive presentation about a planet of your choice',
        subject: 'Science',
        type: 'project',
        dueDate: new Date(2024, 0, 28),
        assignedDate: new Date(2024, 0, 10),
        status: 'in_progress',
        priority: 'high',
        maxScore: 200,
        submissionType: 'both',
        teacherName: 'Ms. Smith',
        instructions: 'Include visual aids, scientific facts, and cite your sources. Presentation should be 10-15 minutes.'
      },
      {
        id: '4',
        title: 'Shakespeare Reading Assignment',
        description: 'Read Act 1 of Romeo and Juliet and answer comprehension questions',
        subject: 'English',
        type: 'reading',
        dueDate: new Date(2024, 0, 19),
        assignedDate: new Date(2024, 0, 12),
        status: 'overdue',
        priority: 'medium',
        maxScore: 30,
        submissionType: 'text',
        teacherName: 'Mrs. Davis'
      },
      {
        id: '5',
        title: 'History Essay - World War II',
        description: 'Write a 1000-word essay on the causes and effects of World War II',
        subject: 'History',
        type: 'assignment',
        dueDate: new Date(2024, 0, 25),
        assignedDate: new Date(2024, 0, 14),
        status: 'graded',
        priority: 'high',
        maxScore: 100,
        submittedScore: 87,
        submissionType: 'file',
        teacherName: 'Mr. Wilson',
        feedback: 'Excellent analysis of causes. Could improve on discussing long-term effects.',
        submittedAt: new Date(2024, 0, 24)
      }
    ];

    setHomework(mockHomework);
    setFilteredHomework(mockHomework);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = homework;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hw => 
        hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hw.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hw.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(hw => hw.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(hw => hw.subject === subjectFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(hw => hw.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'assignedDate':
          return b.assignedDate.getTime() - a.assignedDate.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    setFilteredHomework(filtered);
  }, [homework, searchTerm, statusFilter, subjectFilter, typeFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'graded': return 'bg-purple-100 text-purple-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FiFileText className="h-4 w-4" />;
      case 'quiz': return <FiPlay className="h-4 w-4" />;
      case 'project': return <FiStar className="h-4 w-4" />;
      case 'reading': return <FiBookOpen className="h-4 w-4" />;
      default: return <FiFileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: Date) => {
    const daysLeft = getDaysUntilDue(dueDate);
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    return `Due in ${daysLeft} days`;
  };

  const getSubjects = () => {
    const subjects = Array.from(new Set(homework.map(hw => hw.subject)));
    return subjects;
  };

  const renderHomeworkCard = (hw: Homework) => (
    <Card key={hw.id} className={`p-5 border-l-4 ${getPriorityColor(hw.priority)} hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getTypeIcon(hw.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{hw.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{hw.subject}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{hw.teacherName}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hw.status)}`}>
          {hw.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hw.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FiCalendar className="h-4 w-4" />
            <span>{formatDueDate(hw.dueDate)}</span>
          </div>
          {hw.timeLimit && (
            <div className="flex items-center gap-1">
              <FiClock className="h-4 w-4" />
              <span>{hw.timeLimit} min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FiStar className="h-4 w-4" />
            <span>{hw.maxScore} pts</span>
          </div>
        </div>
      </div>

      {hw.status === 'graded' && hw.submittedScore !== undefined && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              Score: {hw.submittedScore}/{hw.maxScore} ({Math.round((hw.submittedScore / hw.maxScore) * 100)}%)
            </span>
          </div>
          {hw.feedback && (
            <p className="text-sm text-green-700 mt-2">{hw.feedback}</p>
          )}
        </div>
      )}

      {hw.status === 'submitted' && hw.submittedAt && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Submitted on {hw.submittedAt.toLocaleDateString()} at {hw.submittedAt.toLocaleTimeString()}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {hw.status === 'not_started' || hw.status === 'in_progress' ? (
          <>
            <Link 
              href={`/student/homework/${hw.id}`}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {hw.type === 'quiz' ? 'Start Quiz' : 'Start Work'}
            </Link>
            {hw.instructions && (
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                Instructions
              </button>
            )}
          </>
        ) : hw.status === 'submitted' ? (
          <div className="flex-1 px-4 py-2 bg-green-100 text-green-800 text-sm rounded-lg text-center">
            <FiCheck className="inline h-4 w-4 mr-1" />
            Submitted - Awaiting Grade
          </div>
        ) : hw.status === 'graded' ? (
          <Link 
            href={`/student/homework/${hw.id}`}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 text-center"
          >
            View Details
          </Link>
        ) : hw.status === 'overdue' ? (
          <div className="flex gap-2 w-full">
            <Link 
              href={`/student/homework/${hw.id}`}
              className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors text-center"
            >
              Submit Late
            </Link>
            <button className="px-4 py-2 border border-red-300 text-red-700 text-sm rounded-lg hover:bg-red-50">
              <FiAlertTriangle className="inline h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );

  const renderHomeworkList = (hw: Homework) => (
    <Card key={hw.id} className="p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getTypeIcon(hw.type)}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{hw.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>{hw.subject}</span>
              <span>{hw.teacherName}</span>
              <span>{formatDueDate(hw.dueDate)}</span>
              <span>{hw.maxScore} pts</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hw.status)}`}>
            {hw.status.replace('_', ' ')}
          </span>
          
          <Link 
            href={`/student/homework/${hw.id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            {hw.status === 'not_started' || hw.status === 'in_progress' ? 'Start' : 'View'}
          </Link>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Homework</h1>
          <p className="text-gray-600 mt-1">Manage your assignments, quizzes, and projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {viewMode === 'grid' ? <FiList className="h-4 w-4" /> : <FiGrid className="h-4 w-4" />}
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {homework.filter(hw => hw.status === 'not_started' || hw.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {homework.filter(hw => hw.status === 'submitted').length}
          </div>
          <div className="text-sm text-gray-600">Submitted</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {homework.filter(hw => hw.status === 'graded').length}
          </div>
          <div className="text-sm text-gray-600">Graded</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {homework.filter(hw => hw.status === 'overdue').length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search homework..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            {getSubjects().map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="project">Project</option>
            <option value="reading">Reading</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="assignedDate">Assigned Date</option>
            <option value="priority">Priority</option>
            <option value="subject">Subject</option>
          </select>
        </div>
      </Card>

      {/* Homework List */}
      {filteredHomework.length === 0 ? (
        <Card className="p-8 text-center">
          <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No homework found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters or search term.'
              : 'You don\'t have any homework assignments yet.'}
          </p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
          {filteredHomework.map(hw => viewMode === 'grid' ? renderHomeworkCard(hw) : renderHomeworkList(hw))}
        </div>
      )}
    </div>
  );
};

export default StudentHomework; 