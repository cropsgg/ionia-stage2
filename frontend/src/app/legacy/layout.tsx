"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, ChevronDown, ChevronUp, BookOpen, Brain, User } from "lucide-react";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/legacy" className="flex items-center">
              <div className="font-bold text-xl text-emerald-600 mr-2">IONIA</div>
              <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-sm">LEGACY</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/legacy/dashboard" 
                className={`text-sm font-medium ${pathname === '/legacy/dashboard' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button 
                  className={`flex items-center text-sm font-medium ${pathname.includes('/legacy/exam') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                  onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                >
                  Exams
                  {isSubmenuOpen ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
                <AnimatePresence>
                  {isSubmenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                      <div className="py-1">
                        <Link 
                          href="/legacy/exam/jee-mains" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          JEE Mains
                        </Link>
                        <Link 
                          href="/legacy/exam/jee-advanced" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          JEE Advanced
                        </Link>
                        <Link 
                          href="/legacy/exam/neet" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          NEET
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link 
                href="/legacy/practices" 
                className={`text-sm font-medium ${pathname === '/legacy/practices' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                Practice
              </Link>
              <Link 
                href="/legacy/results" 
                className={`text-sm font-medium ${pathname === '/legacy/results' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                Results
              </Link>
            </nav>

            {/* Auth Buttons or User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/legacy/profile" 
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                      {user?.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.fullName || "User"} 
                          width={32} 
                          height={32} 
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <span>{user?.fullName?.split(' ')[0] || "User"}</span>
                  </Link>
                  <Link 
                    href="/legacy/auth/logout" 
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/legacy/auth/login" 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/legacy/auth/register" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link 
                  href="/legacy/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/legacy/dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}`}
                >
                  Dashboard
                </Link>
                <div>
                  <button 
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${pathname.includes('/legacy/exam') ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}`}
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                  >
                    Exams
                    {isSubmenuOpen ? (
                      <ChevronUp className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isSubmenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 mt-1 space-y-1"
                      >
                        <Link 
                          href="/legacy/exam/jee-mains" 
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        >
                          JEE Mains
                        </Link>
                        <Link 
                          href="/legacy/exam/jee-advanced" 
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        >
                          JEE Advanced
                        </Link>
                        <Link 
                          href="/legacy/exam/neet" 
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        >
                          NEET
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link 
                  href="/legacy/practices" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/legacy/practices' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}`}
                >
                  Practice
                </Link>
                <Link 
                  href="/legacy/results" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/legacy/results' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}`}
                >
                  Results
                </Link>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link 
                        href="/legacy/profile" 
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                      >
                        <User className="h-5 w-5 mr-2" />
                        My Profile
                      </Link>
                      <Link 
                        href="/legacy/auth/logout" 
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        href="/legacy/auth/login" 
                        className="block w-full px-4 py-2 text-center border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Login
                      </Link>
                      <Link 
                        href="/legacy/auth/register" 
                        className="block w-full px-4 py-2 text-center border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ionia Legacy</h3>
              <p className="text-gray-400">
                Classic test series for competitive exam preparation with comprehensive practice questions and mock tests.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legacy/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/legacy/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/legacy/help" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legacy/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legacy/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Ionia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 