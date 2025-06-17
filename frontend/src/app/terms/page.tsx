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

              <h2>5. Educational Institution Responsibilities</h2>
              <p>
                If you are accessing or using our Services on behalf of an educational institution, you represent and warrant that you have the authority to bind the institution to these Terms. The educational institution agrees to:
              </p>
              <ul>
                <li>Comply with all applicable education laws and regulations, including those related to student privacy</li>
                <li>Obtain all necessary consents from students, parents, or guardians as required by applicable law</li>
                <li>Use the Services only for legitimate educational purposes</li>
                <li>Ensure that all users within the institution comply with these Terms</li>
                <li>Maintain accurate and up-to-date information for all users</li>
              </ul>

              <h2>6. Intellectual Property Rights</h2>
              <p>
                All content included in the Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of Ionia or its content suppliers and is protected by applicable intellectual property laws.
              </p>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for their intended purpose. This license does not include:
              </p>
              <ul>
                <li>Any resale or commercial use of the Services or their content</li>
                <li>Any collection and use of any product listings, descriptions, or prices</li>
                <li>Any derivative use of the Services or their content</li>
                <li>Any downloading or copying of account information for the benefit of another merchant</li>
                <li>Any use of data mining, robots, or similar data gathering and extraction tools</li>
              </ul>

              <h2>7. User-Generated Content</h2>
              <p>
                Our Services may allow you to create, upload, post, send, receive, and store content. When you do so, you retain your ownership rights in that content. However, by submitting content to our Services, you grant us a worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such content in connection with providing and promoting our Services.
              </p>
              <p>
                You represent and warrant that you own or control all rights to the content you submit and that your content does not violate these Terms or any applicable law.
              </p>

              <h2>8. Privacy</h2>
              <p>
                Your use of our Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</Link> to understand our practices regarding your personal information.
              </p>

              <h2>9. Third-Party Services</h2>
              <p>
                Our Services may contain links to third-party websites or services that are not owned or controlled by Ionia. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
              </p>

              <h2>10. Disclaimer of Warranties</h2>
              <p>
                YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. IONIA EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT THE SERVICES WILL MEET YOUR REQUIREMENTS, THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE.
              </p>

              <h2>11. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL IONIA, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
              </p>

              <h2>12. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p>
                All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>

              <h2>13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>

              <h2>14. Contact Us</h2>
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