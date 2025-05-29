'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBook,
  FiSettings, FiBell, FiGlobe, FiEye, FiShield, FiCamera,
  FiEdit3, FiSave, FiX, FiCheck
} from 'react-icons/fi';

interface StudentProfile {
  personalInfo: {
    profilePicture: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
  };
  academicInfo: {
    studentId: string;
    class: string;
    section: string;
    rollNumber: string;
    academicYear: string;
    subjects: string[];
    admissionDate: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      assignments: boolean;
      grades: boolean;
      announcements: boolean;
    };
    language: string;
    theme: string;
    timezone: string;
    privacy: {
      profileVisibility: string;
      sharePerformance: boolean;
      allowPeerComparison: boolean;
    };
  };
}

const StudentProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'settings'>('personal');
  const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    // Mock profile data
    const mockProfile: StudentProfile = {
      personalInfo: {
        profilePicture: '/images/student-avatar.jpg',
        fullName: user?.name || 'John Doe',
        email: user?.email || 'john.doe@student.school.edu',
        phone: '+91 98765 43210',
        address: '123 School Street, Education City, State 12345',
        dateOfBirth: '2005-03-15',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Mother',
          phone: '+91 98765 43211',
          email: 'jane.doe@email.com'
        }
      },
      academicInfo: {
        studentId: 'STU2024001',
        class: '10th Grade',
        section: 'A',
        rollNumber: '15',
        academicYear: '2024-2025',
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'],
        admissionDate: '2020-04-01'
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          assignments: true,
          grades: true,
          announcements: true
        },
        language: 'English',
        theme: 'Light',
        timezone: 'Asia/Kolkata',
        privacy: {
          profileVisibility: 'Teachers & Classmates',
          sharePerformance: true,
          allowPeerComparison: false
        }
      }
    };

    setProfile(mockProfile);
    setEditedProfile(mockProfile);
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile! });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile! });
    setIsEditing(false);
  };

  const handleInputChange = (section: keyof StudentProfile, field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [section]: {
          ...editedProfile[section],
          [field]: value
        }
      });
    }
  };

  const handleNestedInputChange = (section: keyof StudentProfile, nestedField: string, field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [section]: {
          ...editedProfile[section],
          [nestedField]: {
            ...(editedProfile[section] as any)[nestedField],
            [field]: value
          }
        }
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiSave className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiEdit3 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'personal', label: 'Personal Information', icon: <FiUser className="h-4 w-4" /> },
            { id: 'academic', label: 'Academic Information', icon: <FiBook className="h-4 w-4" /> },
            { id: 'settings', label: 'Settings & Preferences', icon: <FiSettings className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                  <FiUser className="h-16 w-16 text-gray-500" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <FiCamera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="text-lg font-semibold">{profile.personalInfo.fullName}</h3>
              <p className="text-gray-600">{profile.academicInfo.studentId}</p>
              <p className="text-sm text-gray-500">{profile.academicInfo.class} - Section {profile.academicInfo.section}</p>
            </Card>
          </div>

          {/* Personal Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Personal Information" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.personalInfo.fullName || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiUser className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile?.personalInfo.email || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile?.personalInfo.phone || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile?.personalInfo.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(profile.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile?.personalInfo.address || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-start gap-2 py-2">
                      <FiMapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span>{profile.personalInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card title="Emergency Contact" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.personalInfo.emergencyContact.name || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiUser className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.emergencyContact.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.personalInfo.emergencyContact.relationship || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="py-2 block">{profile.personalInfo.emergencyContact.relationship}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile?.personalInfo.emergencyContact.phone || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.emergencyContact.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile?.personalInfo.emergencyContact.email || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span>{profile.personalInfo.emergencyContact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Academic Details" className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <div className="flex items-center gap-2 py-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{profile.academicInfo.studentId}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
                <div className="flex items-center gap-2 py-2">
                  <span>{profile.academicInfo.class} - Section {profile.academicInfo.section}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <div className="flex items-center gap-2 py-2">
                  <span>{profile.academicInfo.rollNumber}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <div className="flex items-center gap-2 py-2">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                  <span>{profile.academicInfo.academicYear}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                <div className="flex items-center gap-2 py-2">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(profile.academicInfo.admissionDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Enrolled Subjects" className="p-6">
            <div className="space-y-3">
              {profile.academicInfo.subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiBook className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card title="Notification Preferences" className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Methods</h4>
                <div className="space-y-2">
                  {Object.entries(profile.preferences.notifications).slice(0, 3).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNestedInputChange('preferences', 'notifications', key, e.target.checked)}
                        disabled={!isEditing}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="capitalize">{key} Notifications</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-2">
                  {Object.entries(profile.preferences.notifications).slice(3).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNestedInputChange('preferences', 'notifications', key, e.target.checked)}
                        disabled={!isEditing}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="capitalize">{key} Updates</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Display Preferences" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.preferences.language || ''}
                      onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiGlobe className="h-4 w-4 text-gray-400" />
                      <span>{profile.preferences.language}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.preferences.theme || ''}
                      onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                      <option value="Auto">Auto</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiEye className="h-4 w-4 text-gray-400" />
                      <span>{profile.preferences.theme}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <div className="flex items-center gap-2 py-2">
                    <FiGlobe className="h-4 w-4 text-gray-400" />
                    <span>{profile.preferences.timezone}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Privacy Settings" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.preferences.privacy.profileVisibility || ''}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Public">Public</option>
                      <option value="Teachers & Classmates">Teachers & Classmates</option>
                      <option value="Teachers Only">Teachers Only</option>
                      <option value="Private">Private</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FiShield className="h-4 w-4 text-gray-400" />
                      <span>{profile.preferences.privacy.profileVisibility}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.preferences.privacy.sharePerformance}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'sharePerformance', e.target.checked)}
                      disabled={!isEditing}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>Share Performance with Parents</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.preferences.privacy.allowPeerComparison}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'allowPeerComparison', e.target.checked)}
                      disabled={!isEditing}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>Allow Peer Comparison</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage; 