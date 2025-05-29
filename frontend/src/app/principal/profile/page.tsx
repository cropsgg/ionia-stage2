'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit, FiKey, FiShield, FiCalendar, FiAward } from 'react-icons/fi';

const PrincipalProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.name || 'Dr. John Smith',
    email: user?.email || 'principal@ionia.edu',
    phone: '+1-555-0101',
    address: '456 Principal Avenue, Education City, EC 54321',
    bio: 'Experienced educational leader with over 15 years in school administration. Passionate about student success and innovative teaching methods.',
    qualification: 'Ph.D. in Educational Leadership',
    experience: '15 years',
    joinDate: new Date(2020, 7, 15),
    department: 'Administration',
    employeeId: 'PR001'
  });

  const handleSave = () => {
    console.log('Profile updated:', profile);
    setIsEditing(false);
  };

  const stats = [
    { icon: <FiCalendar className="h-5 w-5" />, label: 'Years of Service', value: '4 years' },
    { icon: <FiUser className="h-5 w-5" />, label: 'Total Students', value: '1,247' },
    { icon: <FiUser className="h-5 w-5" />, label: 'Total Teachers', value: '68' },
    { icon: <FiAward className="h-5 w-5" />, label: 'School Rating', value: '4.8/5' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-3">
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
          </div>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-5">
            <StatBlock
              icon={<span className="text-blue-600">{stat.icon}</span>}
              title={stat.label}
              value={stat.value}
            />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="xl:col-span-2">
          <Card title="Personal Information" className="p-6">
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.fullName.split(' ').map((name: string) => name[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile.fullName}</h3>
                  <p className="text-gray-600">School Principal</p>
                  <p className="text-sm text-gray-500">Employee ID: {profile.employeeId}</p>
                </div>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Change Photo
                  </button>
                )}
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.department}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.qualification}
                      onChange={(e) => setProfile({...profile, qualification: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.qualification}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.experience}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Join Date: {profile.joinDate.toLocaleDateString()}</span>
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Settings */}
        <div className="space-y-6">
          <Card title="Quick Actions" className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiKey className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Change Password</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiShield className="h-4 w-4 text-green-600" />
                <span className="text-sm">Security Settings</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiMail className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Email Preferences</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FiUser className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Privacy Settings</span>
              </button>
            </div>
          </Card>

          <Card title="Contact Information" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiMail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-gray-600">{profile.address}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Professional Details" className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Employee ID</p>
                <p className="text-sm text-gray-900">{profile.employeeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Qualification</p>
                <p className="text-sm text-gray-900">{profile.qualification}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Experience</p>
                <p className="text-sm text-gray-900">{profile.experience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Department</p>
                <p className="text-sm text-gray-900">{profile.department}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrincipalProfilePage; 