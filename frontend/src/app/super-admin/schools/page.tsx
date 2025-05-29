'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiMapPin, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit,
  FiTrash2, FiEye, FiUsers, FiTarget, FiStar, FiActivity,
  FiSettings, FiBarChart, FiClock, FiDownload, FiGlobe,
  FiDollarSign, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiCalendar, FiMail, FiPhone, FiWifi, FiServer
} from 'react-icons/fi';

interface School {
  id: string;
  name: string;
  code: string;
  region: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  principal: string;
  principalEmail: string;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  grades: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'trial' | 'suspended' | 'pending';
  performance: number;
  attendance: number;
  revenue: number;
  lastActive: Date;
  createdAt: Date;
  subscriptionEnd: Date;
  features: string[];
}

const SuperAdminSchoolsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const mockSchools: School[] = [
      {
        id: '1',
        name: 'Excellence Academy',
        code: 'EA001',
        region: 'North America',
        country: 'United States',
        address: '123 Education Street, Boston, MA 02101',
        phone: '+1-555-0100',
        email: 'info@excellence-academy.edu',
        website: 'www.excellence-academy.edu',
        principal: 'Dr. Sarah Johnson',
        principalEmail: 'sarah.johnson@excellence-academy.edu',
        totalStudents: 1247,
        totalTeachers: 68,
        totalStaff: 25,
        grades: 'K-12',
        plan: 'enterprise',
        status: 'active',
        performance: 94.5,
        attendance: 97.8,
        revenue: 89500,
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date(2022, 8, 15),
        subscriptionEnd: new Date(2025, 7, 14),
        features: ['Analytics Dashboard', 'Parent Portal', 'Mobile App', 'Custom Branding', 'API Access']
      },
      {
        id: '2',
        name: 'Innovation Institute',
        code: 'II002',
        region: 'Europe',
        country: 'United Kingdom',
        address: '45 Innovation Road, London, SW1A 1AA',
        phone: '+44-20-7946-0958',
        email: 'contact@innovation-institute.ac.uk',
        website: 'www.innovation-institute.ac.uk',
        principal: 'Prof. Michael Brown',
        principalEmail: 'michael.brown@innovation-institute.ac.uk',
        totalStudents: 892,
        totalTeachers: 52,
        totalStaff: 18,
        grades: '6-12',
        plan: 'premium',
        status: 'active',
        performance: 91.2,
        attendance: 95.4,
        revenue: 67200,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(2021, 5, 20),
        subscriptionEnd: new Date(2024, 11, 19),
        features: ['Analytics Dashboard', 'Parent Portal', 'Mobile App']
      },
      {
        id: '3',
        name: 'Future Leaders School',
        code: 'FLS003',
        region: 'Asia Pacific',
        country: 'Singapore',
        address: '88 Future Avenue, Singapore 123456',
        phone: '+65-6123-4567',
        email: 'admin@future-leaders.edu.sg',
        principal: 'Dr. Li Wei Chen',
        principalEmail: 'liwei.chen@future-leaders.edu.sg',
        totalStudents: 1156,
        totalTeachers: 64,
        totalStaff: 22,
        grades: '1-12',
        plan: 'enterprise',
        status: 'active',
        performance: 89.8,
        attendance: 96.2,
        revenue: 92800,
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        createdAt: new Date(2023, 1, 10),
        subscriptionEnd: new Date(2026, 0, 9),
        features: ['Analytics Dashboard', 'Parent Portal', 'Mobile App', 'Custom Branding', 'API Access', 'Priority Support']
      },
      {
        id: '4',
        name: 'Sunrise Elementary',
        code: 'SE004',
        region: 'North America',
        country: 'Canada',
        address: '456 Sunrise Boulevard, Toronto, ON M5H 2N2',
        phone: '+1-416-555-0199',
        email: 'info@sunrise-elementary.ca',
        principal: 'Ms. Emily Rodriguez',
        principalEmail: 'emily.rodriguez@sunrise-elementary.ca',
        totalStudents: 345,
        totalTeachers: 24,
        totalStaff: 8,
        grades: 'K-6',
        plan: 'basic',
        status: 'trial',
        performance: 87.3,
        attendance: 93.1,
        revenue: 0,
        lastActive: new Date(Date.now() - 45 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        subscriptionEnd: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        features: ['Basic Dashboard', 'Parent Portal']
      },
      {
        id: '5',
        name: 'Harmony High School',
        code: 'HHS005',
        region: 'Latin America',
        country: 'Brazil',
        address: 'Rua da Harmonia 789, São Paulo, SP 01234-567',
        phone: '+55-11-1234-5678',
        email: 'contato@harmony-high.edu.br',
        principal: 'Dr. Carlos Santos',
        principalEmail: 'carlos.santos@harmony-high.edu.br',
        totalStudents: 578,
        totalTeachers: 32,
        totalStaff: 12,
        grades: '9-12',
        plan: 'premium',
        status: 'suspended',
        performance: 76.8,
        attendance: 89.4,
        revenue: 34500,
        lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(2022, 11, 5),
        subscriptionEnd: new Date(2024, 10, 4),
        features: ['Analytics Dashboard', 'Parent Portal']
      }
    ];

    setSchools(mockSchools);
  }, []);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
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

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.principal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || school.region === filterRegion;
    const matchesPlan = filterPlan === 'all' || school.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    return matchesSearch && matchesRegion && matchesPlan && matchesStatus;
  });

  const regions = Array.from(new Set(schools.map(s => s.region)));
  const totalStudents = schools.reduce((sum, s) => sum + s.totalStudents, 0);
  const totalTeachers = schools.reduce((sum, s) => sum + s.totalTeachers, 0);
  const totalRevenue = schools.reduce((sum, s) => sum + s.revenue, 0);
  const activeSchools = schools.filter(s => s.status === 'active').length;

  if (viewMode === 'detail' && selectedSchool) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('grid')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Schools
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedSchool.name}</h1>
            <p className="text-gray-600">{selectedSchool.code} • {selectedSchool.region}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit School
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiBarChart className="h-4 w-4" />
              View Analytics
            </button>
          </div>
        </div>

        {/* School Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-blue-600" />}
              title="Total Students"
              value={selectedSchool.totalStudents}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-green-600" />}
              title="Teachers"
              value={selectedSchool.totalTeachers}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiStar size={20} className="text-yellow-600" />}
              title="Performance"
              value={selectedSchool.performance}
              unit="%"
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiDollarSign size={20} className="text-purple-600" />}
              title="Monthly Revenue"
              value={`$${selectedSchool.revenue.toLocaleString()}`}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* School Information */}
          <div className="xl:col-span-2">
            <Card title="School Information" className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">School Name</label>
                      <p className="font-medium">{selectedSchool.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">School Code</label>
                      <p className="font-medium">{selectedSchool.code}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Region</label>
                      <p className="font-medium">{selectedSchool.region}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Country</label>
                      <p className="font-medium">{selectedSchool.country}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Grades</label>
                      <p className="font-medium">{selectedSchool.grades}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Plan</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(selectedSchool.plan)}`}>
                        {selectedSchool.plan}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Address</label>
                      <p className="font-medium">{selectedSchool.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{selectedSchool.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">{selectedSchool.email}</p>
                    </div>
                    {selectedSchool.website && (
                      <div>
                        <label className="text-sm text-gray-600">Website</label>
                        <p className="font-medium text-blue-600">{selectedSchool.website}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Principal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Principal Name</label>
                      <p className="font-medium">{selectedSchool.principal}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Principal Email</label>
                      <p className="font-medium">{selectedSchool.principalEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Features & Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSchool.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions & Status */}
          <div className="space-y-6">
            <Card title="Status & Subscription" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <span className={`block mt-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(selectedSchool.status)}`}>
                    {selectedSchool.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Active</label>
                  <p className="font-medium">{selectedSchool.lastActive.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created</label>
                  <p className="font-medium">{selectedSchool.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Subscription Ends</label>
                  <p className="font-medium">{selectedSchool.subscriptionEnd.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Attendance Rate</label>
                  <p className="font-medium text-green-600">{selectedSchool.attendance}%</p>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEdit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit School Details</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiMail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Contact Principal</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBarChart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">View Full Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiSettings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">School Settings</span>
                </button>
                {selectedSchool.status === 'suspended' ? (
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-green-50 rounded-lg transition-colors">
                    <FiCheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Reactivate School</span>
                  </button>
                ) : (
                  <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-red-50 rounded-lg transition-colors">
                    <FiXCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Suspend School</span>
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
          <h1 className="text-3xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600 mt-1">Manage all schools across regions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            Add School
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiMapPin size={20} className="text-blue-600" />}
            title="Total Schools"
            value={schools.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-green-600" />}
            title="Total Students"
            value={totalStudents.toLocaleString()}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiCheckCircle size={20} className="text-purple-600" />}
            title="Active Schools"
            value={activeSchools}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiDollarSign size={20} className="text-orange-600" />}
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
          />
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
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
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Plans</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="cursor-pointer"
            onClick={() => handleSchoolSelect(school)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.code} • {school.region}</p>
                  <p className="text-xs text-gray-500">{school.principal}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(school.plan)}`}>
                    {school.plan}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                    {school.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{school.totalStudents}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{school.performance}%</div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Teachers:</span>
                  <span className="font-medium">{school.totalTeachers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium">{school.attendance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium text-green-600">${school.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium">{school.lastActive.toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New School
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSchoolsPage; 