'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import {
  FiUser, FiEdit, FiSave, FiCamera, FiMail, FiPhone, FiMapPin,
  FiShield, FiKey, FiActivity, FiClock, FiGlobe, FiSettings,
  FiEye, FiLock, FiRefreshCw, FiDownload, FiUpload, FiCheck
} from 'react-icons/fi';

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'login' | 'update' | 'security' | 'system';
  ipAddress: string;
  device: string;
}

const SuperAdminProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Anderson',
    email: 'john.anderson@ionia.edu',
    phone: '+1-555-0123',
    title: 'Super Administrator',
    department: 'Technology & Operations',
    location: 'San Francisco, CA',
    timezone: 'PST',
    bio: 'Leading the global education technology platform with over 10 years of experience in educational technology and system administration.',
    joinedDate: new Date('2020-01-15'),
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: '1',
      action: 'System Login',
      details: 'Logged into Super Admin panel',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'login',
      ipAddress: '192.168.1.100',
      device: 'Chrome on macOS'
    },
    {
      id: '2',
      action: 'Settings Updated',
      details: 'Modified global notification settings',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      type: 'update',
      ipAddress: '192.168.1.100',
      device: 'Chrome on macOS'
    },
    {
      id: '3',
      action: 'Security Scan',
      details: 'Initiated system-wide security audit',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      type: 'security',
      ipAddress: '192.168.1.100',
      device: 'Chrome on macOS'
    },
    {
      id: '4',
      action: 'System Backup',
      details: 'Created manual system backup',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      type: 'system',
      ipAddress: '192.168.1.100',
      device: 'Chrome on macOS'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic
    alert('Profile updated successfully!');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <FiUser className="h-4 w-4 text-blue-600" />;
      case 'update': return <FiEdit className="h-4 w-4 text-green-600" />;
      case 'security': return <FiShield className="h-4 w-4 text-orange-600" />;
      case 'system': return <FiSettings className="h-4 w-4 text-purple-600" />;
      default: return <FiActivity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-100';
      case 'update': return 'bg-green-100';
      case 'security': return 'bg-orange-100';
      case 'system': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiSave className="h-4 w-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiEdit className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="xl:col-span-2 space-y-6">
          <Card title="Personal Information" className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <FiCamera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({...prev, fullName: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profileData.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.title}
                        onChange={(e) => setProfileData(prev => ({...prev, title: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-600">{profileData.title}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({...prev, department: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                {isEditing ? (
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData(prev => ({...prev, timezone: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PST">PST - Pacific Standard Time</option>
                    <option value="EST">EST - Eastern Standard Time</option>
                    <option value="CET">CET - Central European Time</option>
                    <option value="JST">JST - Japan Standard Time</option>
                    <option value="UTC">UTC - Coordinated Universal Time</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profileData.timezone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joined Date
                </label>
                <p className="text-gray-900">{profileData.joinedDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.bio}</p>
              )}
            </div>
          </Card>

          {/* Security Settings */}
          <Card title="Security & Notifications" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    profileData.twoFactorEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profileData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    {profileData.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <button onClick={() => setProfileData(prev => ({...prev, emailNotifications: !prev.emailNotifications}))}>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    profileData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      profileData.emailNotifications ? 'transform translate-x-6' : ''
                    }`} />
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                </div>
                <button onClick={() => setProfileData(prev => ({...prev, smsNotifications: !prev.smsNotifications}))}>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    profileData.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      profileData.smsNotifications ? 'transform translate-x-6' : ''
                    }`} />
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FiKey className="h-4 w-4" />
                    Change Password
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FiDownload className="h-4 w-4" />
                    Download Data
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Log & Quick Actions */}
        <div className="space-y-6">
          {/* Account Overview */}
          <Card title="Account Overview" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FiCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Account Verified</p>
                  <p className="text-sm text-green-700">All security checks passed</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium text-purple-600">Super Administrator</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Permission Level:</span>
                  <span className="font-medium">Global Access</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Sessions:</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <FiClock className="h-3 w-3" />
                      <span>{activity.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              View All Activity
            </button>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiShield className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Security Center</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiSettings className="h-4 w-4 text-green-600" />
                <span className="text-sm">Account Settings</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiActivity className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Activity Log</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiDownload className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Export Data</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfilePage; 