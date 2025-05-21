'use client';

import React from 'react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <main className="pt-16 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-400 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-emerald-50 leading-relaxed">
              How we collect, use, and protect your information
            </p>
            <p className="text-emerald-200 mt-4">Last Updated: September 1, 2023</p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="prose prose-emerald max-w-none">
              <h2>Introduction</h2>
              <p>
                At Ionia ("we," "our," or "us"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our educational platform and services.
              </p>
              <p>
                By accessing or using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>

              <h2>Information We Collect</h2>
              <p>We collect several types of information from and about users of our platform, including:</p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Name, email address, postal address, phone number, educational institution, and other identifiers that you provide when registering for our services, creating a profile, or communicating with us.
                </li>
                <li>
                  <strong>Educational Information:</strong> Course enrollments, academic performance, assessment results, and other educational data necessary to provide our personalized learning services.
                </li>
                <li>
                  <strong>Usage Information:</strong> Information about how you use our platform, including pages visited, features used, time spent, and other interaction data.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about the devices you use to access our platform, including IP address, browser type, operating system, and device identifiers.
                </li>
              </ul>

              <h2>How We Collect Information</h2>
              <p>We collect information through various methods, including:</p>
              <ul>
                <li>
                  <strong>Direct Collection:</strong> Information you provide when you register, create a profile, submit assignments, or communicate with us.
                </li>
                <li>
                  <strong>Automated Collection:</strong> Information collected automatically through cookies, web beacons, and other tracking technologies when you use our platform.
                </li>
                <li>
                  <strong>Third-Party Sources:</strong> Information we may receive from educational institutions, partners, or other third parties with whom we have a relationship.
                </li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our educational platform and services</li>
                <li>Personalize learning experiences and content based on individual needs and preferences</li>
                <li>Process transactions and manage your account</li>
                <li>Communicate with you about updates, features, and support</li>
                <li>Analyze usage patterns to enhance user experience and platform functionality</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
                <li>Protect the security and integrity of our platform</li>
              </ul>

              <h2>Sharing Your Information</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>
                  <strong>Educational Institutions:</strong> Schools, teachers, and administrators who use our platform to manage educational activities.
                </li>
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who assist us in providing our services (e.g., hosting, data analytics, customer support).
                </li>
                <li>
                  <strong>Business Partners:</strong> Organizations with whom we collaborate to offer integrated or joint services.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation.
                </li>
              </ul>
              <p>
                We do not sell or rent your personal information to third parties for marketing purposes.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information in certain circumstances</li>
                <li>Restriction or objection to certain processing activities</li>
                <li>Data portability to another service provider</li>
                <li>Withdrawal of consent for future processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us at <a href="mailto:privacy@ionia.edu" className="text-emerald-600 hover:text-emerald-700">privacy@ionia.edu</a>.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our platform may be used by children under the age of 13 in educational settings. We collect and process children's personal information only as permitted by applicable children's privacy laws, such as the Children's Online Privacy Protection Act (COPPA) in the United States, and only with appropriate parental or educational institution consent.
              </p>

              <h2>International Data Transfers</h2>
              <p>
                Your personal information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We will take appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <address>
                <strong>Ionia Learning Systems</strong><br />
                123 Education Park, Sector 62<br />
                New Delhi, 110062<br />
                India<br />
                <a href="mailto:privacy@ionia.edu" className="text-emerald-600 hover:text-emerald-700">privacy@ionia.edu</a><br />
                +91 (123) 456-7890
              </address>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  View Terms of Service
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

export default PrivacyPolicyPage; 