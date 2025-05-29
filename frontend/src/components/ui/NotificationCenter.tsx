import React, { useState, useEffect } from 'react';
import { FiBell, FiX, FiCheck, FiAlertTriangle, FiInfo, FiClock } from 'react-icons/fi';
import Card from './card';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'assignment' | 'grade' | 'announcement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
  className?: string;
  maxVisible?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  className = '', 
  maxVisible = 5 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - will be replaced with API calls
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'Mathematics Chapter 5 assignment is now available',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: '/student/homework',
        actionText: 'View Assignment',
        priority: 'high'
      },
      {
        id: '2', 
        type: 'grade',
        title: 'Quiz Graded',
        message: 'Your Science Quiz has been graded - 85%',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'announcement',
        title: 'School Holiday',
        message: 'School will be closed on Monday for Independence Day',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        priority: 'low'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'assignment': return <FiClock className="h-4 w-4" />;
      case 'grade': return <FiCheck className="h-4 w-4" />;
      case 'announcement': return <FiInfo className="h-4 w-4" />;
      case 'warning': return <FiAlertTriangle className="h-4 w-4" />;
      case 'error': return <FiX className="h-4 w-4" />;
      case 'success': return <FiCheck className="h-4 w-4" />;
      default: return <FiInfo className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50';
    
    switch(type) {
      case 'assignment': return 'border-l-blue-500 bg-blue-50';
      case 'grade': return 'border-l-green-500 bg-green-50';
      case 'announcement': return 'border-l-purple-500 bg-purple-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <Card className="shadow-lg border-0 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, maxVisible).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                        !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  {notification.actionUrl && (
                                    <a
                                      href={notification.actionUrl}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      {notification.actionText || 'View'}
                                    </a>
                                  )}
                                  
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => dismissNotification(notification.id)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    <FiX className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > maxVisible && (
              <div className="p-4 border-t bg-gray-50">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter; 