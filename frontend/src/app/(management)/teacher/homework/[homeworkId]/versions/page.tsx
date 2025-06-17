'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { 
  FiArrowLeft, FiClock, FiEye, FiEyeOff, FiRotateCcw, 
  FiCheck, FiX, FiInfo, FiChevronRight 
} from 'react-icons/fi';

type HomeworkVersion = {
  version: number;
  title: string;
  description: string;
  questions: any[];
  dueDate: string;
  difficultyLevel: string;
  modifiedBy: {
    _id: string;
    name: string;
  };
  modifiedAt: string;
  changeDescription: string;
};

type HomeworkType = {
  _id: string;
  title: string;
  description: string;
  classId: {
    _id: string;
    name: string;
  };
  subjectId: {
    _id: string;
    name: string;
  };
  dueDate: string;
  version: number;
  previousVersions: HomeworkVersion[];
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
  isActive: boolean;
};

const MOCK_HOMEWORK: HomeworkType = {
  _id: '1',
  title: 'Forces and Motion - Week 3',
  description: 'Complete all questions on Newton\'s laws of motion',
  classId: { _id: '1', name: 'Grade 10A' },
  subjectId: { _id: '202', name: 'Physics' },
  dueDate: '2023-09-15T23:59:59Z',
  version: 3,
  createdAt: '2023-08-01T10:00:00Z',
  createdBy: { _id: 'teacher1', name: 'Jane Doe' },
  isActive: true,
  previousVersions: [
    {
      version: 2,
      title: 'Forces and Motion - Week 3',
      description: 'Complete all questions on Newton\'s laws of motion',
      questions: [],
      dueDate: '2023-09-15T23:59:59Z',
      difficultyLevel: 'medium',
      modifiedBy: { _id: 'teacher1', name: 'Jane Doe' },
      modifiedAt: '2023-08-25T14:30:00Z',
      changeDescription: 'Extended deadline by one week'
    },
    {
      version: 1,
      title: 'Forces and Motion - Week 3',
      description: 'Complete all questions on Newton\'s laws of motion',
      questions: [],
      dueDate: '2023-09-08T23:59:59Z',
      difficultyLevel: 'hard',
      modifiedBy: { _id: 'teacher1', name: 'Jane Doe' },
      modifiedAt: '2023-08-01T10:00:00Z',
      changeDescription: 'Initial version'
    }
  ]
};

const HomeworkVersionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;
  
  const [homework, setHomework] = useState<HomeworkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
  
  // Fetch homework data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const response = await axios.get(`/api/v1/homework/${homeworkId}/versions`);
        // setHomework(response.data.data.homework);
        
        // Using mock data for now
        setHomework(MOCK_HOMEWORK);
      } catch (err) {
        console.error('Failed to fetch homework versions:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch homework versions.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [homeworkId]);

  // Restore homework to a previous version
  const handleRestoreVersion = async (version: number) => {
    setRestoring(true);
    setRestoringVersion(version);
    
    try {
      // In real implementation:
      // await axios.post(`/api/v1/homework/${homeworkId}/restore`, {
      //   version
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRestoreSuccess(true);
      
      // Reload data after restore
      setTimeout(() => {
        setRestoreSuccess(false);
        setRestoringVersion(null);
        setHomework(prev => {
          if (!prev) return null;
          
          const restoredVersion = prev.previousVersions.find(v => v.version === version);
          if (!restoredVersion) return prev;
          
          // Create a new version based on the restored version
          const newVersion = prev.version + 1;
          
          // Add current version to previous versions
          const updatedPreviousVersions = [
            {
              version: prev.version,
              title: prev.title,
              description: prev.description,
              questions: [],
              dueDate: prev.dueDate,
              difficultyLevel: 'medium', // This would be dynamic in a real implementation
              modifiedBy: prev.createdBy, // Using createdBy as a placeholder
              modifiedAt: new Date().toISOString(),
              changeDescription: `Replaced by restored version ${version}`
            },
            ...prev.previousVersions
          ];
          
          return {
            ...prev,
            version: newVersion,
            title: restoredVersion.title,
            description: restoredVersion.description,
            dueDate: restoredVersion.dueDate,
            previousVersions: updatedPreviousVersions
          };
        });
      }, 1500);
    } catch (err) {
      console.error('Failed to restore homework version:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to restore homework version.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setRestoring(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Homework Version History</h1>
        <Link 
          href={`/teacher/homework/${homeworkId}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Homework
        </Link>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Success Message */}
      {restoreSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            Version {restoringVersion} restored successfully!
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : homework ? (
        <>
          {/* Current Version */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">Current Version {homework.version}</span>
              {homework.isActive ? (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium flex items-center">
                  <FiEye className="mr-1" /> Active
                </span>
              ) : (
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center">
                  <FiEyeOff className="mr-1" /> Inactive
                </span>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">{homework.title}</h2>
            <p className="text-gray-600 mb-4">{homework.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Subject:</span>
                {homework.subjectId.name}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Class:</span>
                {homework.classId.name}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Due Date:</span>
                {formatDate(homework.dueDate)}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Created:</span>
                {formatDate(homework.createdAt)} by {homework.createdBy.name}
              </div>
            </div>
            
            <div className="flex mt-4">
              <Link 
                href={`/teacher/homework/${homeworkId}/edit`}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit Current Version
              </Link>
            </div>
          </div>
          
          {/* Version History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Version History</h2>
              <p className="text-sm text-gray-500">Previous versions of this homework</p>
            </div>
            
            {homework.previousVersions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No previous versions available
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {homework.previousVersions.map((version) => (
                  <li key={version.version} className="p-0">
                    <div 
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedVersion(expandedVersion === version.version ? null : version.version)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">Version {version.version}</span>
                            <h3 className="text-md font-medium text-gray-800 ml-2">{version.title}</h3>
                          </div>
                          
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            Modified on {formatDate(version.modifiedAt)} by {version.modifiedBy.name}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 mr-2 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to view the version (in real implementation)
                              alert(`View version ${version.version}`);
                            }}
                          >
                            View
                          </button>
                          
                          <button
                            type="button"
                            className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreVersion(version.version);
                            }}
                            disabled={restoring}
                          >
                            {restoring && restoringVersion === version.version ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 mr-1"></div>
                            ) : (
                              <FiRotateCcw className="mr-1" />
                            )}
                            Restore
                          </button>
                          
                          <FiChevronRight 
                            className={`ml-2 transition-transform ${expandedVersion === version.version ? 'transform rotate-90' : ''}`} 
                          />
                        </div>
                      </div>
                      
                      {version.changeDescription && (
                        <div className="mt-1 text-sm text-gray-500 flex items-start">
                          <FiInfo className="mr-1 mt-0.5 flex-shrink-0" />
                          <span>Change: {version.changeDescription}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Expanded Version Details */}
                    {expandedVersion === version.version && (
                      <div className="px-4 pb-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-gray-500">Description:</p>
                              <p className="text-gray-800">{version.description}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Due Date:</p>
                              <p className="text-gray-800">{formatDate(version.dueDate)}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Difficulty Level:</p>
                              <p className="text-gray-800 capitalize">{version.difficultyLevel}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-500">Questions:</p>
                              <p className="text-gray-800">{version.questions.length} questions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Version Management Info */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-start text-indigo-800">
              <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium">About Version Management</h3>
                <p className="text-sm mt-1">
                  Each time you edit homework, a new version is created and the previous version is saved in the history.
                  You can view past versions or restore a previous version if needed.
                  Restoring creates a new version based on the selected previous version.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Homework not found or no longer available.</p>
        </div>
      )}
    </div>
  );
};

export default HomeworkVersionsPage; 