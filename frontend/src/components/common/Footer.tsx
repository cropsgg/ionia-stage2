"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div 
            className="space-y-4"
            {...fadeInUp}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
              Ionia
            </h3>
            <p className="text-emerald-100 leading-relaxed">
              A comprehensive platform for managing educational franchises. Streamline school operations and provide personalized learning experiences.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="transform hover:scale-110 transition-transform duration-300">
                <Facebook className="w-5 h-5 text-emerald-300 hover:text-emerald-200" />
              </a>
              <a href="#" className="transform hover:scale-110 transition-transform duration-300">
                <Twitter className="w-5 h-5 text-emerald-300 hover:text-emerald-200" />
              </a>
              <a href="#" className="transform hover:scale-110 transition-transform duration-300">
                <Instagram className="w-5 h-5 text-emerald-300 hover:text-emerald-200" />
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-200"></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors duration-300">
                  Register
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-200"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-emerald-200 hover:text-white transition-colors duration-300">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span>contact@ionia.edu</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200 hover:text-white transition-colors duration-300">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200 hover:text-white transition-colors duration-300">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-emerald-700/50 mt-12 pt-8 text-center"
          {...fadeInUp}
        >
          <p className="text-emerald-200 text-sm">
            © {new Date().getFullYear()} Ionia. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}