import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar, FiClock, FiBookOpen, FiFileText } from 'react-icons/fi';
import Card from './card';

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
  role: 'student' | 'teacher' | 'class-teacher' | 'principal' | 'super-admin';
}

interface CalendarProps {
  userRole: string;
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  showAddButton?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  userRole,
  className = '',
  onEventClick,
  onDateClick,
  showAddButton = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Mock events based on role
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      // Student events
      {
        id: '1',
        title: 'Math Assignment Due',
        description: 'Chapter 5 exercises',
        date: new Date(2024, 0, 20),
        type: 'assignment',
        subject: 'Mathematics',
        priority: 'high',
        completed: false,
        role: 'student'
      },
      {
        id: '2',
        title: 'Science Quiz',
        description: 'Physics chapter 3',
        date: new Date(2024, 0, 22),
        startTime: '10:00',
        endTime: '11:00',
        type: 'quiz',
        subject: 'Science',
        priority: 'high',
        completed: false,
        role: 'student'
      },
      // Teacher events
      {
        id: '3',
        title: 'Class 10A - Mathematics',
        date: new Date(2024, 0, 21),
        startTime: '09:00',
        endTime: '10:00',
        type: 'class',
        subject: 'Mathematics',
        priority: 'medium',
        role: 'teacher'
      },
      {
        id: '4',
        title: 'Parent-Teacher Meeting',
        date: new Date(2024, 0, 25),
        startTime: '14:00',
        endTime: '17:00',
        type: 'meeting',
        priority: 'high',
        role: 'teacher'
      },
      // School events
      {
        id: '5',
        title: 'School Holiday',
        description: 'Independence Day',
        date: new Date(2024, 0, 26),
        type: 'holiday',
        priority: 'low',
        role: 'principal'
      }
    ];

    // Filter events based on user role
    const filteredEvents = mockEvents.filter(event => {
      if (userRole === 'super-admin') return true;
      if (userRole === 'principal') return ['principal', 'teacher', 'student'].includes(event.role);
      if (userRole === 'class-teacher') return ['teacher', 'student'].includes(event.role);
      return event.role === userRole;
    });

    setEvents(filteredEvents);
  }, [userRole]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-500 text-white';
    
    switch(type) {
      case 'assignment': return 'bg-blue-500 text-white';
      case 'quiz': return 'bg-purple-500 text-white';
      case 'exam': return 'bg-red-600 text-white';
      case 'holiday': return 'bg-green-500 text-white';
      case 'meeting': return 'bg-yellow-500 text-white';
      case 'announcement': return 'bg-indigo-500 text-white';
      case 'class': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'assignment': return <FiFileText className="h-3 w-3" />;
      case 'quiz': 
      case 'exam': return <FiBookOpen className="h-3 w-3" />;
      case 'class': return <FiClock className="h-3 w-3" />;
      default: return <FiCalendar className="h-3 w-3" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = isSameDay(date, today);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      
      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border border-gray-100 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-200' : ''
          } ${isSelected ? 'bg-blue-100' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            onDateClick && onDateClick(date);
          }}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${getEventColor(event.type, event.priority)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick && onEventClick(event);
                }}
                title={event.title}
              >
                <div className="flex items-center gap-1">
                  {getEventIcon(event.type)}
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dayEvents = getEventsForDate(selectedDate);
    
    if (dayEvents.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No events for this day
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onEventClick && onEventClick(event)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-full ${getEventColor(event.type, event.priority)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  {event.startTime && (
                    <span>{event.startTime} - {event.endTime}</span>
                  )}
                  {event.subject && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {event.subject}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded ${
                    event.priority === 'high' ? 'bg-red-100 text-red-700' :
                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.priority} priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              
              <button
                onClick={goToToday}
                className="px-2 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Today
              </button>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showAddButton && (
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <FiPlus className="h-4 w-4" />
                Add Event
              </button>
            )}
            
            <select
              value={view}
              onChange={(e) => setView(e.target.value as 'month' | 'week' | 'day')}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {renderMonthView()}
            </div>
          </div>

          {/* Selected Date Events */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-medium text-gray-900 mb-3">
                {selectedDate ? 
                  `Events for ${selectedDate.toLocaleDateString()}` : 
                  'Select a date to view events'
                }
              </h3>
              
              <div className="max-h-96 overflow-y-auto">
                {renderSelectedDateEvents()}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar; 