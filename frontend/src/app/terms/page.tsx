'use client';

import React from 'react';
import Link from 'next/link';

const TermsOfServicePage = () => {
  return (
    <main className="pt-16 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-400 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-emerald-50 leading-relaxed">
              The rules and guidelines for using the Ionia platform
            </p>
            <p className="text-emerald-200 mt-4">Last Updated: September 1, 2023</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="prose prose-emerald max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Ionia platform and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.
              </p>
              <p>
                We may modify these Terms at any time. Your continued use of the Services after any changes indicates your acceptance of the modified Terms.
              </p>

              <h2>2. Description of Services</h2>
              <p>
                Ionia provides a personalized learning management platform designed for educational institutions, specifically schools operating on a franchise model. Our Services include but are not limited to:
              </p>
              <ul>
                <li>School franchise management tools</li>
                <li>Personalized learning content for students</li>
                <li>Assessment and grading systems</li>
                <li>Educational content management</li>
                <li>User administration and management</li>
                <li>Reporting and analytics</li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>
                To access certain features of our Services, you must create a user account. When creating an account, you agree to provide accurate, current, and complete information, and to update this information to maintain its accuracy.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
              </p>
              <p>
                We reserve the right to disable any user account at any time if, in our opinion, you have violated these Terms.
              </p>

              <h2>4. User Responsibilities</h2>
              <p>As a user of our Services, you agree not to:</p>
              <ul>
                <li>Use the Services in any way that violates applicable local, state, national, or international law</li>
                <li>Attempt to gain unauthorized access to any portion of the Services or any other systems or networks connected to the Services</li>
                <li>Use the Services to transmit any viruses, malware, or other harmful code</li>
                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                <li>Collect or store personal information about other users without their express consent</li>
                <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                <li>Use the Services in a manner that could disable, overburden, damage, or impair the Services</li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <address>
                <strong>Ionia Learning Systems</strong><br />
                123 Education Park, Sector 62<br />
                New Delhi, 110062<br />
                India<br />
                <a href="mailto:legal@ionia.edu" className="text-emerald-600 hover:text-emerald-700">legal@ionia.edu</a><br />
                +91 (123) 456-7890
              </address>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  View Privacy Policy
                </Link>
                <Link href="/contact" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsOfServicePage;