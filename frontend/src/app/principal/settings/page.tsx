'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/card';
import { FiSettings, FiSave, FiMail, FiShield, FiClock, FiUsers, FiBook, FiCalendar } from 'react-icons/fi';

const PrincipalSettingsPage = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Ionia Education Center',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1-555-0100',
    schoolEmail: 'info@ionia.edu',
    academicYear: '2024-2025',
    gradeRange: '1-12',
    maxClassSize: 30,
    schoolHours: {
      start: '08:00',
      end: '15:30'
    },
    emailNotifications: true,
    smsNotifications: false,
    parentPortalEnabled: true,
    attendanceThreshold: 90,
    performanceThreshold: 70
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Settings</h1>
          <p className="text-gray-600 mt-1">Configure school policies and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiSave className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="School Information" className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={settings.schoolAddress}
                onChange={(e) => setSettings({...settings, schoolAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={settings.schoolPhone}
                  onChange={(e) => setSettings({...settings, schoolPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.schoolEmail}
                  onChange={(e) => setSettings({...settings, schoolEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Academic Configuration" className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Range</label>
                <input
                  type="text"
                  value={settings.gradeRange}
                  onChange={(e) => setSettings({...settings, gradeRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Class Size</label>
              <input
                type="number"
                value={settings.maxClassSize}
                onChange={(e) => setSettings({...settings, maxClassSize: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Hours</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={settings.schoolHours.start}
                  onChange={(e) => setSettings({...settings, schoolHours: {...settings.schoolHours, start: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={settings.schoolHours.end}
                  onChange={(e) => setSettings({...settings, schoolHours: {...settings.schoolHours, end: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Notification Settings" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive email updates and alerts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive text message alerts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Parent Portal</h4>
                <p className="text-sm text-gray-500">Enable parent access portal</p>
              </div>
              <input
                type="checkbox"
                checked={settings.parentPortalEnabled}
                onChange={(e) => setSettings({...settings, parentPortalEnabled: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </Card>

        <Card title="Performance Thresholds" className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Threshold (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.attendanceThreshold}
                onChange={(e) => setSettings({...settings, attendanceThreshold: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum attendance rate before alerts</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Threshold (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.performanceThreshold}
                onChange={(e) => setSettings({...settings, performanceThreshold: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum grade average before alerts</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrincipalSettingsPage; 