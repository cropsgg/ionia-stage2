'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiUsers, FiUserPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit,
  FiTrash2, FiEye, FiMail, FiDownload, FiUpload, FiUserCheck,
  FiUserX, FiShield, FiBook, FiCalendar, FiActivity, FiStar,
  FiClock, FiTarget, FiSettings, FiRefreshCw, FiMapPin, FiGlobe
} from 'react-icons/fi';

interface GlobalUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'principal' | 'school_admin' | 'super_admin';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  school: string;
  schoolCode: string;
  region: string;
  joinedDate: Date;
  lastActive: Date;
  phone?: string;
  parentEmail?: string;
  performance?: number;
  attendance?: number;
  classesAssigned?: number;
  studentsManaged?: number;
  schoolsManaged?: number;
  plan: 'basic' | 'premium' | 'enterprise';
}

const SuperAdminUsersPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');

  useEffect(() => {
    const mockUsers: GlobalUser[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@excellence-academy.edu',
        role: 'principal',
        status: 'active',
        school: 'Excellence Academy',
        schoolCode: 'EA001',
        region: 'North America',
        joinedDate: new Date(2022, 8, 15),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        phone: '+1-555-0123',
        schoolsManaged: 1,
        plan: 'enterprise'
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john.smith@student.excellence-academy.edu',
        role: 'student',
        status: 'active',
        school: 'Excellence Academy',
        schoolCode: 'EA001',
        region: 'North America',
        joinedDate: new Date(2023, 8, 1),
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        phone: '+1-555-0124',
        parentEmail: 'parent.smith@email.com',
        performance: 85,
        attendance: 94,
        plan: 'enterprise'
      },
      {
        id: '3',
        name: 'Prof. Michael Brown',
        email: 'michael.brown@innovation-institute.ac.uk',
        role: 'teacher',
        status: 'active',
        school: 'Innovation Institute',
        schoolCode: 'II002',
        region: 'Europe',
        joinedDate: new Date(2021, 2, 10),
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
        phone: '+44-20-7946-0958',
        classesAssigned: 4,
        studentsManaged: 98,
        plan: 'premium'
      },
      {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma.wilson@student.innovation-institute.ac.uk',
        role: 'student',
        status: 'active',
        school: 'Innovation Institute',
        schoolCode: 'II002',
        region: 'Europe',
        joinedDate: new Date(2021, 8, 1),
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
        phone: '+44-20-1234-5678',
        parentEmail: 'parent.wilson@email.com',
        performance: 92,
        attendance: 97,
        plan: 'premium'
      },
      {
        id: '5',
        name: 'Alice Chen',
        email: 'alice.chen@future-leaders.edu.sg',
        role: 'school_admin',
        status: 'active',
        school: 'Future Leaders School',
        schoolCode: 'FLS003',
        region: 'Asia Pacific',
        joinedDate: new Date(2020, 5, 20),
        lastActive: new Date(Date.now() - 15 * 60 * 1000),
        phone: '+65-6123-4567',
        schoolsManaged: 1,
        plan: 'enterprise'
      },
      {
        id: '6',
        name: 'Robert Davis',
        email: 'robert.davis@sunrise-elementary.ca',
        role: 'student',
        status: 'pending',
        school: 'Sunrise Elementary',
        schoolCode: 'SE004',
        region: 'North America',
        joinedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        phone: '+1-416-555-0199',
        parentEmail: 'parent.davis@email.com',
        performance: 0,
        attendance: 0,
        plan: 'basic'
      },
      {
        id: '7',
        name: 'Dr. Li Wei Chen',
        email: 'liwei.chen@future-leaders.edu.sg',
        role: 'principal',
        status: 'active',
        school: 'Future Leaders School',
        schoolCode: 'FLS003',
        region: 'Asia Pacific',
        joinedDate: new Date(2023, 1, 10),
        lastActive: new Date(Date.now() - 45 * 60 * 1000),
        phone: '+65-6123-4567',
        schoolsManaged: 1,
        plan: 'enterprise'
      },
      {
        id: '8',
        name: 'Dr. Carlos Santos',
        email: 'carlos.santos@harmony-high.edu.br',
        role: 'principal',
        status: 'suspended',
        school: 'Harmony High School',
        schoolCode: 'HHS005',
        region: 'Latin America',
        joinedDate: new Date(2022, 11, 5),
        lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        phone: '+55-11-1234-5678',
        schoolsManaged: 1,
        plan: 'premium'
      }
    ];

    setUsers(mockUsers);
  }, []);

  const handleUserSelect = (selectedUser: GlobalUser) => {
    setSelectedUser(selectedUser);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-blue-600 bg-blue-100';
      case 'teacher': return 'text-purple-600 bg-purple-100';
      case 'principal': return 'text-orange-600 bg-orange-100';
      case 'school_admin': return 'text-indigo-600 bg-indigo-100';
      case 'super_admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      case 'premium': return 'text-blue-600 bg-blue-100';
      case 'basic': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <FiBook className="h-4 w-4" />;
      case 'teacher': return <FiUsers className="h-4 w-4" />;
      case 'principal': return <FiShield className="h-4 w-4" />;
      case 'school_admin': return <FiSettings className="h-4 w-4" />;
      case 'super_admin': return <FiGlobe className="h-4 w-4" />;
      default: return <FiUsers className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || user.region === filterRegion;
    const matchesSchool = filterSchool === 'all' || user.school === filterSchool;
    return matchesSearch && matchesRole && matchesStatus && matchesRegion && matchesSchool;
  });

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalPrincipals = users.filter(u => u.role === 'principal').length;
  const totalAdmins = users.filter(u => u.role === 'school_admin' || u.role === 'super_admin').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const regions = Array.from(new Set(users.map(u => u.region)));
  const schools = Array.from(new Set(users.map(u => u.school)));

  if (viewMode === 'detail' && selectedUser) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('list')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Users
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h1>
            <p className="text-gray-600">{selectedUser.email} • {selectedUser.school}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit User
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiMail className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiActivity size={20} className="text-blue-600" />}
              title="Role"
              value={selectedUser.role.replace('_', ' ').toUpperCase()}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiUserCheck size={20} className="text-green-600" />}
              title="Status"
              value={selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiMapPin size={20} className="text-purple-600" />}
              title="Region"
              value={selectedUser.region}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiCalendar size={20} className="text-orange-600" />}
              title="Member Since"
              value={selectedUser.joinedDate.getFullYear().toString()}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="xl:col-span-2">
            <Card title="User Information" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Personal Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Full Name</label>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    {selectedUser.parentEmail && (
                      <div>
                        <label className="text-sm text-gray-600">Parent Email</label>
                        <p className="font-medium">{selectedUser.parentEmail}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Account Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Role</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                          {getRoleIcon(selectedUser.role)}
                          {selectedUser.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">School</label>
                      <p className="font-medium">{selectedUser.school} ({selectedUser.schoolCode})</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Region</label>
                      <p className="font-medium">{selectedUser.region}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Plan</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(selectedUser.plan)}`}>
                        {selectedUser.plan}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Joined Date</label>
                      <p className="font-medium">{selectedUser.joinedDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Active</label>
                      <p className="font-medium">{selectedUser.lastActive.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific metrics */}
              {selectedUser.role === 'student' && (selectedUser.performance || selectedUser.attendance) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Academic Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.performance && (
                      <div>
                        <label className="text-sm text-gray-600">Performance</label>
                        <p className="text-2xl font-bold text-green-600">{selectedUser.performance}%</p>
                      </div>
                    )}
                    {selectedUser.attendance && (
                      <div>
                        <label className="text-sm text-gray-600">Attendance</label>
                        <p className="text-2xl font-bold text-blue-600">{selectedUser.attendance}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedUser.role === 'teacher' && (selectedUser.classesAssigned || selectedUser.studentsManaged) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Teaching Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.classesAssigned && (
                      <div>
                        <label className="text-sm text-gray-600">Classes Assigned</label>
                        <p className="text-2xl font-bold text-purple-600">{selectedUser.classesAssigned}</p>
                      </div>
                    )}
                    {selectedUser.studentsManaged && (
                      <div>
                        <label className="text-sm text-gray-600">Students Managed</label>
                        <p className="text-2xl font-bold text-orange-600">{selectedUser.studentsManaged}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(selectedUser.role === 'principal' || selectedUser.role === 'school_admin') && selectedUser.schoolsManaged && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Management Statistics</h4>
                  <div>
                    <label className="text-sm text-gray-600">Schools Managed</label>
                    <p className="text-2xl font-bold text-indigo-600">{selectedUser.schoolsManaged}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Actions */}
          <div>
            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEdit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit Profile</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiMail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Send Message</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSettings className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Account Settings</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEye className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">View School Data</span>
                </button>
                {selectedUser.status === 'active' ? (
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-red-50 rounded-lg transition-colors">
                    <FiUserX className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Suspend User</span>
                  </button>
                ) : (
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-green-50 rounded-lg transition-colors">
                    <FiUserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Activate User</span>
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global User Management</h1>
          <p className="text-gray-600 mt-1">Manage users across all schools and regions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiUpload className="h-4 w-4" />
            Import Users
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiUserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiBook size={20} className="text-blue-600" />}
            title="Students"
            value={totalStudents}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-green-600" />}
            title="Teachers"
            value={totalTeachers}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiShield size={20} className="text-orange-600" />}
            title="Principals"
            value={totalPrincipals}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiSettings size={20} className="text-purple-600" />}
            title="Administrators"
            value={totalAdmins}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUserCheck size={20} className="text-indigo-600" />}
            title="Active Users"
            value={activeUsers}
          />
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="principal">Principals</option>
          <option value="school_admin">School Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Schools</option>
          {schools.map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="cursor-pointer" 
            onClick={() => handleUserSelect(user)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                        {user.plan}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiMapPin className="h-4 w-4" />
                        {user.school} • {user.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" />
                        Joined: {user.joinedDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="h-4 w-4" />
                        Last active: {user.lastActive.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {user.role === 'student' && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{user.performance || 0}%</div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{user.attendance || 0}%</div>
                        <div className="text-xs text-gray-500">Attendance</div>
                      </div>
                    </>
                  )}

                  {user.role === 'teacher' && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{user.classesAssigned || 0}</div>
                        <div className="text-xs text-gray-500">Classes</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{user.studentsManaged || 0}</div>
                        <div className="text-xs text-gray-500">Students</div>
                      </div>
                    </>
                  )}

                  {(user.role === 'principal' || user.role === 'school_admin') && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{user.schoolsManaged || 0}</div>
                      <div className="text-xs text-gray-500">Schools</div>
                    </div>
                  )}

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New User
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsersPage; 