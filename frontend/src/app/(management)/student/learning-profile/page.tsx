'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Types
type LearningStyle = {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
};

type DifficultyPerformance = {
  easy: { correct: number; total: number };
  medium: { correct: number; total: number };
  hard: { correct: number; total: number };
};

type SubjectPerformance = {
  subjectId: string;
  subjectName?: string;
  averageScore: number;
  questionsAttempted: number;
  lastSubmissionDate: string;
};

type PersonalizationSettings = {
  personalizationEnabled: boolean;
  adaptiveDifficultyEnabled: boolean;
  learningStylePreferenceEnabled: boolean;
};

type LearningProfile = {
  learningStyles: LearningStyle;
  recommendedLearningStyle: string | null;
  difficultyPerformance: DifficultyPerformance;
  recommendedDifficultyLevel: string;
  subjectPerformance: SubjectPerformance[];
  personalizationSettings: PersonalizationSettings;
};

// Mock data
const MOCK_PROFILE: LearningProfile = {
  learningStyles: {
    visual: 65,
    auditory: 30,
    reading: 45,
    kinesthetic: 80
  },
  recommendedLearningStyle: 'kinesthetic',
  difficultyPerformance: {
    easy: { correct: 45, total: 50 },
    medium: { correct: 32, total: 40 },
    hard: { correct: 18, total: 30 }
  },
  recommendedDifficultyLevel: 'medium',
  subjectPerformance: [
    {
      subjectId: '201',
      subjectName: 'Mathematics',
      averageScore: 78,
      questionsAttempted: 120,
      lastSubmissionDate: '2023-09-10T14:30:00Z'
    },
    {
      subjectId: '202',
      subjectName: 'Physics',
      averageScore: 82,
      questionsAttempted: 95,
      lastSubmissionDate: '2023-09-12T16:45:00Z'
    },
    {
      subjectId: '203',
      subjectName: 'Chemistry',
      averageScore: 75,
      questionsAttempted: 85,
      lastSubmissionDate: '2023-09-08T13:15:00Z'
    }
  ],
  personalizationSettings: {
    personalizationEnabled: true,
    adaptiveDifficultyEnabled: true,
    learningStylePreferenceEnabled: true
  }
};

const LearningProfilePage = () => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [settings, setSettings] = useState<PersonalizationSettings>({
    personalizationEnabled: true,
    adaptiveDifficultyEnabled: true,
    learningStylePreferenceEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch learning profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // In real implementation:
        // const response = await axios.get('/api/v1/homework-submissions/analytics/me');
        // setProfile(response.data.data.analytics);
        // setSettings(response.data.data.analytics.personalizationSettings);
        
        // Using mock data for now
        setProfile(MOCK_PROFILE);
        setSettings(MOCK_PROFILE.personalizationSettings);
      } catch (err) {
        console.error('Failed to fetch learning profile:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to fetch learning profile.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle settings change
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Save settings
  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // In real implementation:
      // await axios.put('/api/v1/homework-submissions/settings', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update profile with new settings
      if (profile) {
        setProfile({
          ...profile,
          personalizationSettings: settings
        });
      }
      
      setSuccessMessage('Your settings have been saved successfully.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to save settings.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Calculate performance percentage
  const calculatePerformance = (correct: number, total: number) => {
    return total > 0 ? (correct / total) * 100 : 0;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Learning Profile</h1>
        <Link
          href="/student/homework"
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
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Learning Styles Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Learning Style Preferences</h2>
              <p className="text-gray-600 mb-4">
                Your learning style profile is developed based on your performance on different types of questions.
                The system uses this information to personalize your homework assignments.
              </p>
              
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Visual Learning</span>
                    <span className="text-sm font-medium">{profile.learningStyles.visual}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${profile.learningStyles.visual}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Auditory Learning</span>
                    <span className="text-sm font-medium">{profile.learningStyles.auditory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${profile.learningStyles.auditory}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Reading/Writing</span>
                    <span className="text-sm font-medium">{profile.learningStyles.reading}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${profile.learningStyles.reading}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Kinesthetic Learning</span>
                    <span className="text-sm font-medium">{profile.learningStyles.kinesthetic}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-orange-600 h-2.5 rounded-full" 
                      style={{ width: `${profile.learningStyles.kinesthetic}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {profile.recommendedLearningStyle && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-md">
                  <p className="text-indigo-800">
                    <strong>Recommended learning style:</strong> {profile.recommendedLearningStyle.charAt(0).toUpperCase() + profile.recommendedLearningStyle.slice(1)}
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Your homework will be tailored to match this learning style when possible.
                  </p>
                </div>
              )}
            </div>
            
            {/* Difficulty Performance */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Performance by Difficulty Level</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Easy Questions</span>
                    <span className="text-sm font-medium">
                      {profile.difficultyPerformance.easy.correct}/{profile.difficultyPerformance.easy.total} 
                      ({Math.round(calculatePerformance(
                        profile.difficultyPerformance.easy.correct,
                        profile.difficultyPerformance.easy.total
                      ))}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${calculatePerformance(
                        profile.difficultyPerformance.easy.correct,
                        profile.difficultyPerformance.easy.total
                      )}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Medium Questions</span>
                    <span className="text-sm font-medium">
                      {profile.difficultyPerformance.medium.correct}/{profile.difficultyPerformance.medium.total} 
                      ({Math.round(calculatePerformance(
                        profile.difficultyPerformance.medium.correct,
                        profile.difficultyPerformance.medium.total
                      ))}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculatePerformance(
                        profile.difficultyPerformance.medium.correct,
                        profile.difficultyPerformance.medium.total
                      )}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Hard Questions</span>
                    <span className="text-sm font-medium">
                      {profile.difficultyPerformance.hard.correct}/{profile.difficultyPerformance.hard.total} 
                      ({Math.round(calculatePerformance(
                        profile.difficultyPerformance.hard.correct,
                        profile.difficultyPerformance.hard.total
                      ))}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${calculatePerformance(
                        profile.difficultyPerformance.hard.correct,
                        profile.difficultyPerformance.hard.total
                      )}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 rounded-md">
                <p className="text-indigo-800">
                  <strong>Recommended difficulty level:</strong> {profile.recommendedDifficultyLevel.charAt(0).toUpperCase() + profile.recommendedDifficultyLevel.slice(1)}
                </p>
                <p className="text-sm text-indigo-600 mt-1">
                  When adaptive difficulty is enabled, your homework will include more questions at this level.
                </p>
              </div>
            </div>
            
            {/* Subject Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Performance by Subject</h2>
              
              {profile.subjectPerformance.length === 0 ? (
                <p className="text-gray-500">No subject performance data available yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Questions Attempted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Submission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profile.subjectPerformance.map((subject) => (
                        <tr key={subject.subjectId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subject.subjectName || `Subject ${subject.subjectId}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.round(subject.averageScore)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subject.questionsAttempted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(subject.lastSubmissionDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Settings Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Personalization Settings</h2>
              <p className="text-gray-600 mb-6">
                Control how your learning experience is personalized.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="personalizationEnabled"
                      name="personalizationEnabled"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.personalizationEnabled}
                      onChange={handleSettingChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="personalizationEnabled" className="font-medium text-gray-700">
                      Enable Personalization
                    </label>
                    <p className="text-gray-500">
                      Allow the system to personalize your homework based on your learning profile.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="adaptiveDifficultyEnabled"
                      name="adaptiveDifficultyEnabled"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.adaptiveDifficultyEnabled}
                      onChange={handleSettingChange}
                      disabled={!settings.personalizationEnabled}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="adaptiveDifficultyEnabled" 
                      className={`font-medium ${settings.personalizationEnabled ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      Adaptive Difficulty
                    </label>
                    <p className={settings.personalizationEnabled ? 'text-gray-500' : 'text-gray-400'}>
                      Adjust question difficulty based on your performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="learningStylePreferenceEnabled"
                      name="learningStylePreferenceEnabled"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.learningStylePreferenceEnabled}
                      onChange={handleSettingChange}
                      disabled={!settings.personalizationEnabled}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="learningStylePreferenceEnabled" 
                      className={`font-medium ${settings.personalizationEnabled ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      Learning Style Preference
                    </label>
                    <p className={settings.personalizationEnabled ? 'text-gray-500' : 'text-gray-400'}>
                      Tailor questions to match your preferred learning style.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                className="mt-8 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSaveSettings}
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
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No learning profile data available.</p>
        </div>
      )}
    </div>
  );
};

export default LearningProfilePage; 