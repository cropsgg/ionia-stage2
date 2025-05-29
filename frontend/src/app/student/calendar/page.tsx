'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Calendar from '@/components/ui/Calendar';
import Card from '@/components/ui/card';
import { FiClock, FiBookOpen, FiFileText, FiAlertTriangle } from 'react-icons/fi';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'assignment' | 'quiz' | 'exam' | 'holiday' | 'meeting' | 'announcement' | 'class';
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

const StudentCalendar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Upcoming events for quick view
  const upcomingEvents = [
    {
      id: '1',
      title: 'Math Assignment Due',
      date: new Date(2024, 0, 20),
      type: 'assignment' as const,
      subject: 'Mathematics',
      priority: 'high' as const,
      daysLeft: 2
    },
    {
      id: '2',
      title: 'Science Quiz',
      date: new Date(2024, 0, 22),
      startTime: '10:00',
      type: 'quiz' as const,
      subject: 'Science',
      priority: 'high' as const,
      daysLeft: 4
    },
    {
      id: '3',
      title: 'History Project Presentation',
      date: new Date(2024, 0, 25),
      type: 'assignment' as const,
      subject: 'History',
      priority: 'medium' as const,
      daysLeft: 7
    }
  ];

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date);
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'assignment': return <FiFileText className="h-4 w-4" />;
      case 'quiz': 
      case 'exam': return <FiBookOpen className="h-4 w-4" />;
      default: return <FiClock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return 'border-l-red-500 bg-red-50';
    if (daysLeft <= 3) return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-green-500 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
          <p className="text-gray-600 mt-1">Keep track of assignments, quizzes, and important dates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="xl:col-span-3">
          <Calendar
            userRole="student"
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            className="w-full"
          />
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Upcoming Events */}
          <Card title="Upcoming Events" className="p-5">
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`p-3 border-l-4 rounded-lg ${getUrgencyColor(event.daysLeft)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white rounded-full shadow-sm">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.subject}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {event.date.toLocaleDateString()}
                          {event.startTime && ` at ${event.startTime}`}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                          {event.daysLeft === 0 ? 'Due Today' : 
                           event.daysLeft === 1 ? 'Due Tomorrow' : 
                           `${event.daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="This Week" className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiFileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Assignments</span>
                </div>
                <span className="text-lg font-bold text-blue-600">3</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Quizzes</span>
                </div>
                <span className="text-lg font-bold text-purple-600">1</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Overdue</span>
                </div>
                <span className="text-lg font-bold text-red-600">0</span>
              </div>
            </div>
          </Card>

          {/* Study Tips */}
          <Card title="Study Tips" className="p-5">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Plan Ahead</h4>
                <p className="text-sm text-gray-600">
                  Break large assignments into smaller tasks and spread them across multiple days.
                </p>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Set Reminders</h4>
                <p className="text-sm text-gray-600">
                  Use calendar notifications to stay on top of important deadlines.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {selectedEvent.description && (
              <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{selectedEvent.date.toLocaleDateString()}</span>
              </div>
              
              {selectedEvent.startTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                </div>
              )}
              
              {selectedEvent.subject && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Subject:</span>
                  <span className="font-medium">{selectedEvent.subject}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500">Priority:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                  {selectedEvent.priority}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCalendar; 