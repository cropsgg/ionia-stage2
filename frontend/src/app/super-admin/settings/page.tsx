'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import {
  FiSettings, FiSave, FiRefreshCw, FiShield, FiGlobe, FiDatabase,
  FiMail, FiBell, FiLock, FiUsers, FiServer, FiMonitor, FiKey,
  FiClock, FiToggleLeft, FiToggleRight, FiAlertCircle
} from 'react-icons/fi';

const SuperAdminSettingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    maintenance: false,
    registrationEnabled: true,
    emailNotifications: true,
    backupEnabled: true,
    autoBackup: true,
    twoFactorRequired: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    apiRateLimit: 1000
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    // Save settings logic
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FiSettings className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <FiShield className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell className="h-4 w-4" /> },
    { id: 'system', label: 'System', icon: <FiServer className="h-4 w-4" /> },
    { id: 'backup', label: 'Backup', icon: <FiDatabase className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-gray-600 mt-1">Manage system-wide configuration and preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiSave className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Platform Settings" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Put the platform in maintenance mode</p>
                </div>
                <button onClick={() => handleToggle('maintenance')}>
                  {settings.maintenance ? 
                    <FiToggleRight className="h-6 w-6 text-blue-600" /> : 
                    <FiToggleLeft className="h-6 w-6 text-gray-400" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">User Registration</h4>
                  <p className="text-sm text-gray-600">Allow new user registrations</p>
                </div>
                <button onClick={() => handleToggle('registrationEnabled')}>
                  {settings.registrationEnabled ? 
                    <FiToggleRight className="h-6 w-6 text-blue-600" /> : 
                    <FiToggleLeft className="h-6 w-6 text-gray-400" />
                  }
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => setSettings(prev => ({...prev, apiRateLimit: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          <Card title="Regional Settings" className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Timezone
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>UTC</option>
                  <option>EST</option>
                  <option>PST</option>
                  <option>CET</option>
                  <option>JST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                  <option>CAD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Language
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Authentication Settings" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                </div>
                <button onClick={() => handleToggle('twoFactorRequired')}>
                  {settings.twoFactorRequired ? 
                    <FiToggleRight className="h-6 w-6 text-blue-600" /> : 
                    <FiToggleLeft className="h-6 w-6 text-gray-400" />
                  }
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings(prev => ({...prev, maxLoginAttempts: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings(prev => ({...prev, passwordMinLength: parseInt(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          <Card title="Security Monitoring" className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiShield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Security Status: Good</span>
                </div>
                <p className="text-sm text-green-700 mt-1">No security incidents in the last 24 hours</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Failed Login Attempts:</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Sessions:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Security Scan:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Run Security Scan
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card title="Notification Preferences" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send system notifications via email</p>
                </div>
                <button onClick={() => handleToggle('emailNotifications')}>
                  {settings.emailNotifications ? 
                    <FiToggleRight className="h-6 w-6 text-blue-600" /> : 
                    <FiToggleLeft className="h-6 w-6 text-gray-400" />
                  }
                </button>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    'System Alerts',
                    'Security Incidents',
                    'Performance Issues',
                    'Backup Status',
                    'User Registration',
                    'Payment Notifications'
                  ].map((type) => (
                    <label key={type} className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded mr-3" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Email Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    placeholder="noreply@ionia.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="System Information" className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Version:</span>
                <span className="font-medium">v3.2.1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Database Version:</span>
                <span className="font-medium">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Server Uptime:</span>
                <span className="font-medium">15 days, 7 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">68% (5.4GB / 8GB)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disk Usage:</span>
                <span className="font-medium">42% (210GB / 500GB)</span>
              </div>
            </div>
          </Card>

          <Card title="Performance Monitoring" className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900">System Health: Excellent</h4>
                <p className="text-sm text-blue-700">All systems operational</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CPU Usage:</span>
                  <span className="font-medium">23%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Connections:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">142ms</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                View Detailed Metrics
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Backup Configuration" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Automatic Backups</h4>
                  <p className="text-sm text-gray-600">Enable scheduled backups</p>
                </div>
                <button onClick={() => handleToggle('autoBackup')}>
                  {settings.autoBackup ? 
                    <FiToggleRight className="h-6 w-6 text-blue-600" /> : 
                    <FiToggleLeft className="h-6 w-6 text-gray-400" />
                  }
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Backup Now
              </button>
            </div>
          </Card>

          <Card title="Recent Backups" className="p-6">
            <div className="space-y-4">
              {[
                { date: '2024-01-15 02:00', size: '2.3 GB', status: 'Success' },
                { date: '2024-01-14 02:00', size: '2.2 GB', status: 'Success' },
                { date: '2024-01-13 02:00', size: '2.1 GB', status: 'Success' },
                { date: '2024-01-12 02:00', size: '2.0 GB', status: 'Failed' }
              ].map((backup, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{backup.date}</p>
                    <p className="text-xs text-gray-600">{backup.size}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    backup.status === 'Success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {backup.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              View All Backups
            </button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSettingsPage; 