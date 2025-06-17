'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';
import axios from 'axios';

// School interface
interface School {
  _id: string;
  name: string;
  address: string;
  contactInfo: string;
  isActive: boolean;
  createdAt: string;
}

const SchoolsPage = () => {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // In a real implementation, we would fetch from the API
        setLoading(true);
        // Example API call (commented out for now)
        // const response = await axios.get(`/api/v1/superadmin/schools?page=${currentPage}&search=${searchTerm}`);
        // setSchools(response.data.data.schools);
        // setTotalPages(response.data.data.pagination.totalPages);
        
        // Mock data for now
        setSchools([
          {
            _id: '1',
            name: 'City Public School',
            address: '123 Main St, City',
            contactInfo: 'contact@cityschool.edu',
            isActive: true,
            createdAt: '2023-08-15T12:00:00Z'
          },
          {
            _id: '2',
            name: 'Westside Academy',
            address: '456 West Ave, Westside',
            contactInfo: 'info@westsideacademy.edu',
            isActive: true,
            createdAt: '2023-08-10T14:30:00Z'
          },
          {
            _id: '3',
            name: 'Eastview High School',
            address: '789 East Blvd, Eastview',
            contactInfo: 'admin@eastview.edu',
            isActive: false,
            createdAt: '2023-07-20T09:15:00Z'
          }
        ]);
        setTotalPages(2);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to load schools. Please try again.');
        setLoading(false);
      }
    };

    fetchSchools();
  }, [currentPage, searchTerm]);

  const handleToggleStatus = async (schoolId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, we would call the API
      // await axios.patch(`/api/v1/superadmin/schools/${schoolId}/status`, { isActive: !currentStatus });
      
      // Update local state for now
      setSchools(schools.map(school => 
        school._id === schoolId 
          ? { ...school, isActive: !currentStatus } 
          : school
      ));
    } catch (err) {
      console.error('Error toggling school status:', err);
      setError('Failed to update school status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const filteredSchools = searchTerm 
    ? schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : schools;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">School Management</h1>
        <Link href="/management/superadmin/schools/new" className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700">
          <FiPlus className="mr-2" />
          Add New School
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex items-center">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search schools..."
            className="border-none focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Schools Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading schools...</p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No schools found. Create one to get started.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchools.map((school) => (
                <tr key={school._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{school.name}</div>
                    <div className="text-sm text-gray-500">{school.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.contactInfo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(school.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/management/superadmin/schools/${school._id}/edit`)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(school._id, school.isActive)}
                        className={`${school.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {school.isActive ? <FiToggleRight className="h-5 w-5" /> : <FiToggleLeft className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-l-md bg-white text-sm font-medium 
                ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md bg-white text-sm font-medium 
                ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage; 