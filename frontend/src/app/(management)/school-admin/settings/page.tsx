'use client';

import React, { useState } from 'react';
import { FiEdit, FiSave, FiUpload } from 'react-icons/fi';

const SchoolSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: 'City Public School',
    address: '123 Main St, New York, NY 10001',
    contactEmail: 'admin@cityschool.edu',
    contactPhone: '(212) 555-1234',
    website: 'https://cityschool.edu',
    gradingScale: 'A=90-100, B=80-89, C=70-79, D=60-69, F=0-59',
    lateSubmissionPolicy: 'Accepted with 10% penalty per day, maximum 3 days late',
    primaryColor: '#047857', // emerald-600
    secondaryColor: '#10b981', // emerald-500
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
    }, 800);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">School Settings</h1>
        {!editing ? (
          <button 
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center hover:bg-emerald-700"
          >
            <FiEdit className="mr-2" />
            Edit Settings
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center hover:bg-emerald-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* School Logo Section */}
        <div className="bg-emerald-50 p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl mr-4">
              CPS
            </div>
            <div>
              <h2 className="text-xl font-semibold">School Logo</h2>
              <p className="text-gray-600 mt-1 mb-3">Upload your school logo for branding</p>
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
                disabled={!editing}
              >
                <FiUpload className="mr-2" />
                Upload Logo
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">School Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.contactEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              {editing ? (
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.contactPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              {editing ? (
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.website}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {editing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.address}</p>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">School Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grading Scale
              </label>
              {editing ? (
                <input
                  type="text"
                  name="gradingScale"
                  value={formData.gradingScale}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.gradingScale}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Late Submission Policy
              </label>
              {editing ? (
                <textarea
                  name="lateSubmissionPolicy"
                  value={formData.lateSubmissionPolicy}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-gray-900">{formData.lateSubmissionPolicy}</p>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              {editing ? (
                <div className="flex items-center">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 p-0 mr-2"
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full mr-2" 
                    style={{ backgroundColor: formData.primaryColor }}
                  ></div>
                  <p className="text-gray-900">{formData.primaryColor}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              {editing ? (
                <div className="flex items-center">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 p-0 mr-2"
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full mr-2" 
                    style={{ backgroundColor: formData.secondaryColor }}
                  ></div>
                  <p className="text-gray-900">{formData.secondaryColor}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettingsPage; 