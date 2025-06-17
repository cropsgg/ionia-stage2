'use client';

import React from 'react';
import { FiSettings, FiServer, FiDollarSign, FiShield, FiFileText } from 'react-icons/fi';

const SuperAdminSettingsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiSettings className="text-emerald-600 h-6 w-6 mr-3" />
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          <p className="text-gray-600 mb-4">Configure system-wide settings and defaults</p>
          <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
            Manage Settings
          </button>
        </div>

        {/* Server Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiServer className="text-emerald-600 h-6 w-6 mr-3" />
            <h2 className="text-lg font-semibold">Server Configuration</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage server resources and performance</p>
          <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
            View Configuration
          </button>
        </div>

        {/* Billing & Subscription */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-emerald-600 h-6 w-6 mr-3" />
            <h2 className="text-lg font-semibold">Billing & Subscription</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage subscription plans and billing settings</p>
          <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
            Manage Plans
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiShield className="text-emerald-600 h-6 w-6 mr-3" />
            <h2 className="text-lg font-semibold">Security Settings</h2>
          </div>
          <p className="text-gray-600 mb-4">Configure security policies and access controls</p>
          <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
            Manage Security
          </button>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiFileText className="text-emerald-600 h-6 w-6 mr-3" />
            <h2 className="text-lg font-semibold">System Logs</h2>
          </div>
          <p className="text-gray-600 mb-4">View and analyze system logs and activities</p>
          <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
            View Logs
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-medium">Version</p>
            <p>Ionia v2.0.1</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Last Updated</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Total Schools</p>
            <p>3</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Active Users</p>
            <p>127</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettingsPage; 