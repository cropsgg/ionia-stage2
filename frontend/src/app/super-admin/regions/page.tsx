'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Card from '@/components/ui/card';
import StatBlock from '@/components/ui/StatBlock';
import {
  FiGlobe, FiPlus, FiSearch, FiMoreVertical, FiEdit, FiEye,
  FiMapPin, FiUsers, FiTrendingUp, FiTrendingDown, FiStar,
  FiTarget, FiDollarSign, FiBarChart, FiDownload, FiSettings
} from 'react-icons/fi';

interface Region {
  id: string;
  name: string;
  code: string;
  continent: string;
  timezone: string;
  currency: string;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  avgPerformance: number;
  avgAttendance: number;
  growth: number;
  manager: string;
  managerEmail: string;
  status: 'active' | 'inactive' | 'expanding';
  establishedDate: Date;
  lastUpdated: Date;
  countries: string[];
}

const SuperAdminRegionsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockRegions: Region[] = [
      {
        id: '1',
        name: 'North America',
        code: 'NA',
        continent: 'North America',
        timezone: 'EST/PST',
        currency: 'USD',
        totalSchools: 89,
        totalStudents: 45234,
        totalTeachers: 2876,
        totalRevenue: 1245000,
        avgPerformance: 86.5,
        avgAttendance: 94.2,
        growth: 15.2,
        manager: 'Sarah Mitchell',
        managerEmail: 'sarah.mitchell@ionia.edu',
        status: 'active',
        establishedDate: new Date(2020, 0, 15),
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        countries: ['United States', 'Canada', 'Mexico']
      },
      {
        id: '2',
        name: 'Europe',
        code: 'EU',
        continent: 'Europe',
        timezone: 'CET/GMT',
        currency: 'EUR/GBP',
        totalSchools: 67,
        totalStudents: 32145,
        totalTeachers: 2143,
        totalRevenue: 892000,
        avgPerformance: 82.1,
        avgAttendance: 91.8,
        growth: 11.8,
        manager: 'Dr. James Wilson',
        managerEmail: 'james.wilson@ionia.edu',
        status: 'active',
        establishedDate: new Date(2020, 5, 10),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        countries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain']
      },
      {
        id: '3',
        name: 'Asia Pacific',
        code: 'APAC',
        continent: 'Asia',
        timezone: 'JST/SGT',
        currency: 'SGD/JPY',
        totalSchools: 54,
        totalStudents: 28967,
        totalTeachers: 1845,
        totalRevenue: 567000,
        avgPerformance: 88.3,
        avgAttendance: 95.1,
        growth: 18.7,
        manager: 'Li Wei Chen',
        managerEmail: 'liwei.chen@ionia.edu',
        status: 'expanding',
        establishedDate: new Date(2021, 2, 1),
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
        countries: ['Singapore', 'Japan', 'South Korea', 'Malaysia', 'Australia']
      },
      {
        id: '4',
        name: 'Latin America',
        code: 'LATAM',
        continent: 'South America',
        timezone: 'BRT/COT',
        currency: 'BRL/USD',
        totalSchools: 23,
        totalStudents: 12456,
        totalTeachers: 789,
        totalRevenue: 156000,
        avgPerformance: 78.9,
        avgAttendance: 89.4,
        growth: 8.4,
        manager: 'Carlos Rodriguez',
        managerEmail: 'carlos.rodriguez@ionia.edu',
        status: 'active',
        establishedDate: new Date(2021, 8, 15),
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        countries: ['Brazil', 'Mexico', 'Colombia', 'Argentina', 'Chile']
      },
      {
        id: '5',
        name: 'Middle East',
        code: 'ME',
        continent: 'Asia',
        timezone: 'GST/AST',
        currency: 'AED/SAR',
        totalSchools: 14,
        totalStudents: 9745,
        totalTeachers: 634,
        totalRevenue: 98500,
        avgPerformance: 81.7,
        avgAttendance: 92.3,
        growth: 22.3,
        manager: 'Ahmed Al-Hassan',
        managerEmail: 'ahmed.hassan@ionia.edu',
        status: 'expanding',
        establishedDate: new Date(2022, 3, 1),
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
        countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait']
      }
    ];

    setRegions(mockRegions);
  }, []);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setViewMode('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'expanding': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <FiTrendingUp className="h-4 w-4" /> : <FiTrendingDown className="h-4 w-4" />;
  };

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSchools = regions.reduce((sum, r) => sum + r.totalSchools, 0);
  const totalStudents = regions.reduce((sum, r) => sum + r.totalStudents, 0);
  const totalRevenue = regions.reduce((sum, r) => sum + r.totalRevenue, 0);
  const avgGrowth = regions.length > 0 ? Math.round(regions.reduce((sum, r) => sum + r.growth, 0) / regions.length * 10) / 10 : 0;

  if (viewMode === 'detail' && selectedRegion) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setViewMode('grid')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Back to Regions
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedRegion.name}</h1>
            <p className="text-gray-600">{selectedRegion.code} • {selectedRegion.continent}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiEdit className="h-4 w-4" />
              Edit Region
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiBarChart className="h-4 w-4" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Region Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <StatBlock
              icon={<FiMapPin size={20} className="text-blue-600" />}
              title="Schools"
              value={selectedRegion.totalSchools}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiUsers size={20} className="text-green-600" />}
              title="Students"
              value={selectedRegion.totalStudents.toLocaleString()}
            />
          </Card>

          <Card className="p-5">
            <StatBlock
              icon={<FiDollarSign size={20} className="text-purple-600" />}
              title="Revenue"
              value={`$${selectedRegion.totalRevenue.toLocaleString()}`}
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">{selectedRegion.growth}%</p>
              </div>
              <div className={`${getGrowthColor(selectedRegion.growth)}`}>
                {getGrowthIcon(selectedRegion.growth)}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Region Information */}
          <div className="xl:col-span-2">
            <Card title="Region Information" className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Region Name</label>
                      <p className="font-medium">{selectedRegion.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Region Code</label>
                      <p className="font-medium">{selectedRegion.code}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Continent</label>
                      <p className="font-medium">{selectedRegion.continent}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Timezone</label>
                      <p className="font-medium">{selectedRegion.timezone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Currency</label>
                      <p className="font-medium">{selectedRegion.currency}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRegion.status)}`}>
                        {selectedRegion.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Regional Manager</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Manager Name</label>
                      <p className="font-medium">{selectedRegion.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Manager Email</label>
                      <p className="font-medium">{selectedRegion.managerEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Countries</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.countries.map((country, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Average Performance</label>
                      <p className="text-2xl font-bold text-green-600">{selectedRegion.avgPerformance}%</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Average Attendance</label>
                      <p className="text-2xl font-bold text-blue-600">{selectedRegion.avgAttendance}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Regional Actions */}
          <div className="space-y-6">
            <Card title="Regional Overview" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Established</label>
                  <p className="font-medium">{selectedRegion.establishedDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Updated</label>
                  <p className="font-medium">{selectedRegion.lastUpdated.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Teacher-Student Ratio</label>
                  <p className="font-medium">1:{Math.round(selectedRegion.totalStudents / selectedRegion.totalTeachers)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Revenue per Student</label>
                  <p className="font-medium">${Math.round(selectedRegion.totalRevenue / selectedRegion.totalStudents)}</p>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiEdit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit Region Details</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiMapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Manage Schools</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiBarChart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">View Detailed Analytics</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FiDownload className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Export Regional Report</span>
                </button>
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
          <h1 className="text-3xl font-bold text-gray-900">Regional Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor regions worldwide</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiDownload className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            Add Region
          </button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <StatBlock
            icon={<FiGlobe size={20} className="text-blue-600" />}
            title="Total Regions"
            value={regions.length}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiMapPin size={20} className="text-green-600" />}
            title="Total Schools"
            value={totalSchools}
          />
        </Card>

        <Card className="p-5">
          <StatBlock
            icon={<FiUsers size={20} className="text-purple-600" />}
            title="Total Students"
            value={totalStudents.toLocaleString()}
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Growth</p>
              <p className="text-2xl font-bold text-gray-900">{avgGrowth}%</p>
            </div>
            <div className={`${getGrowthColor(avgGrowth)}`}>
              {getGrowthIcon(avgGrowth)}
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search regions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRegions.map((region) => (
          <div
            key={region.id}
            className="cursor-pointer"
            onClick={() => handleRegionSelect(region)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                  <p className="text-sm text-gray-600">{region.code} • {region.continent}</p>
                  <p className="text-xs text-gray-500">{region.manager}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(region.status)}`}>
                  {region.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{region.totalSchools}</div>
                  <div className="text-xs text-gray-500">Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{region.totalStudents.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">${region.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance:</span>
                  <span className="font-medium text-green-600">{region.avgPerformance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium text-blue-600">{region.avgAttendance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Growth:</span>
                  <span className={`font-medium ${getGrowthColor(region.growth)}`}>
                    {region.growth > 0 ? '+' : ''}{region.growth}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredRegions.length === 0 && (
        <div className="text-center py-12">
          <FiGlobe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No regions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Region
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRegionsPage; 