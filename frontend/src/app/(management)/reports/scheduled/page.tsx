'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiMail, FiFileText, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import analyticsService from '@/services/analyticsService';
import ScheduleReportModal from '@/components/report/ScheduleReportModal';
import { ScheduleReportData } from '@/components/report/ScheduleReportModal';

type ScheduledReport = {
  id: string;
  reportType: string;
  frequency: string;
  nextDelivery: string;
  recipients: string[];
};

const ScheduledReportsPage = () => {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getScheduledReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch scheduled reports:', err);
      setError('Unable to load scheduled reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReport = async (scheduleData: ScheduleReportData) => {
    try {
      const result = await analyticsService.scheduleReport(scheduleData);
      setSuccess(result.message);
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // Refresh the list of reports
      fetchReports();
    } catch (err) {
      console.error('Failed to schedule report:', err);
      setError('Failed to schedule report. Please try again.');
      
      // Reset error message after a few seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
      
      throw err; // Propagate error to the modal
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this scheduled report?')) {
      return;
    }
    
    try {
      await analyticsService.deleteScheduledReport(reportId);
      
      // Update local state
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));
      
      setSuccess('Report schedule deleted successfully.');
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to delete scheduled report:', err);
      setError('Failed to delete scheduled report. Please try again.');
      
      // Reset error message after a few seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scheduled Reports</h1>
          <p className="text-gray-500 mt-1">Manage your automated report delivery schedule</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Schedule New Report
        </button>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 p-4 rounded-md flex items-center">
          <FiCheckCircle className="mr-2" size={20} />
          {success}
        </div>
      )}
      
      {/* Reports List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Scheduled Reports</h3>
          <p className="text-gray-500 mb-4">You haven't set up any automated reports yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Schedule Your First Report
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Delivery
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiFileText className="flex-shrink-0 mr-2 text-blue-500" />
                      <div className="text-sm font-medium text-gray-900">{report.reportType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 text-gray-400" />
                      <div className="text-sm text-gray-500">{report.frequency}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.nextDelivery}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiMail className="flex-shrink-0 mr-2 text-gray-400" />
                      <div className="text-sm text-gray-500">
                        {report.recipients.length === 1 
                          ? report.recipients[0] 
                          : `${report.recipients[0]} +${report.recipients.length - 1} more`
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <FiTrash2 className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Schedule Report Modal */}
      <ScheduleReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleScheduleReport}
      />
    </div>
  );
};

export default ScheduledReportsPage; 