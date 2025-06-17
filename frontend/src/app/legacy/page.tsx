"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks/hooks';
import { BarChart, Book, CalendarCheck, LineChart, ArrowRight, BookOpen, Activity, Target } from 'lucide-react';

export default function LegacyDashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [testCount, setTestCount] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // Fetch user stats here from API
    // This is just a mockup with static values
    setTestCount(12);
    setQuestionsAttempted(350);
    setAvgScore(72);
    setAccuracy(68);
  }, []);

  const recentTests = [
    { id: 1, name: 'JEE Mains Mock Test 1', date: '2023-10-15', score: 75, totalQuestions: 90 },
    { id: 2, name: 'Physics Unit Test: Mechanics', date: '2023-10-10', score: 82, totalQuestions: 30 },
    { id: 3, name: 'Chemistry: Periodic Table', date: '2023-10-05', score: 68, totalQuestions: 25 },
  ];

  const recommendedTests = [
    { 
      id: 1, 
      title: 'JEE Mains Full Mock', 
      description: 'Complete mock test for JEE Mains preparation',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'bg-blue-500',
      href: '/legacy/exam/jee-mains/mock/1'
    },
    { 
      id: 2, 
      title: 'Advanced Mathematics', 
      description: 'Advanced problems covering calculus and algebra',
      icon: <Activity className="w-8 h-8 text-white" />,
      color: 'bg-purple-500',
      href: '/legacy/practices/advanced-mathematics'
    },
    { 
      id: 3, 
      title: 'Physics: Electromagnetism', 
      description: 'Practice questions on electromagnetic phenomena',
      icon: <Target className="w-8 h-8 text-white" />,
      color: 'bg-emerald-500',
      href: '/legacy/practices/physics/electromagnetism'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isAuthenticated 
                  ? `Welcome back, ${user?.fullName?.split(' ')[0] || 'Student'}!` 
                  : 'Welcome to Ionia Legacy!'}
              </h1>
              <p className="text-blue-100 mb-6">
                {isAuthenticated 
                  ? 'Continue your preparation with our comprehensive test series.' 
                  : 'Login to access our comprehensive test series for competitive exams.'}
              </p>
              {!isAuthenticated && (
                <div className="flex gap-4">
                  <Link 
                    href="/legacy/auth/login" 
                    className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/legacy/auth/register" 
                    className="bg-blue-800 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-0">
              <img 
                src="/images/study-illustration.svg" 
                alt="Study Illustration" 
                className="h-40 w-auto"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {isAuthenticated && (
        <>
          {/* Stats Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Tests Completed</h3>
                    <p className="text-2xl font-bold text-gray-800">{testCount}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CalendarCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Questions Attempted</h3>
                    <p className="text-2xl font-bold text-gray-800">{questionsAttempted}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <BarChart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Average Score</h3>
                    <p className="text-2xl font-bold text-gray-800">{avgScore}%</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <LineChart className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Accuracy</h3>
                    <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Recent Tests Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Tests</h2>
              <Link 
                href="/legacy/results" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(test.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {test.score}/{test.totalQuestions}
                          </div>
                          <div className="ml-2 h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600"
                              style={{ width: `${(test.score / test.totalQuestions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          href={`/legacy/results/${test.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Analysis
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Recommended Tests Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full"
            >
              <div className={`${test.color} p-6 flex items-center justify-center`}>
                <div className="bg-white/20 p-4 rounded-full">
                  {test.icon}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{test.title}</h3>
                <p className="text-gray-600 mb-4">{test.description}</p>
                <Link 
                  href={test.href} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-auto font-medium"
                >
                  Start Test <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Exams Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular Exam Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/legacy/exam/jee-mains">
            <div className="group bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl p-6 h-48 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold">JEE Mains</h3>
              <p className="text-blue-100">Comprehensive test series for JEE Main preparation</p>
              <div className="flex justify-end mt-4">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/legacy/exam/jee-advanced">
            <div className="group bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-xl p-6 h-48 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold">JEE Advanced</h3>
              <p className="text-purple-100">Advanced preparation for IIT entrance examinations</p>
              <div className="flex justify-end mt-4">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/legacy/exam/neet">
            <div className="group bg-gradient-to-br from-emerald-600 to-emerald-400 text-white rounded-xl p-6 h-48 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold">NEET</h3>
              <p className="text-emerald-100">Medical entrance examination preparation</p>
              <div className="flex justify-end mt-4">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/legacy/exam/cuet">
            <div className="group bg-gradient-to-br from-amber-600 to-amber-400 text-white rounded-xl p-6 h-48 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold">CUET</h3>
              <p className="text-amber-100">Common University Entrance Test preparation</p>
              <div className="flex justify-end mt-4">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
} 