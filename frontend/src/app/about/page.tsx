'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiGlobe, FiStar } from 'react-icons/fi';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { type: "tween", duration: 0.6 }
};

const AboutPage = () => {
  return (
    <main className="pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-400 text-white py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              About Ionia
            </motion.h1>
            <motion.p 
              className="text-xl text-emerald-50 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Transforming education through personalized learning and advanced school management solutions
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Ionia, we believe that every student deserves a personalized education tailored to their unique learning style and pace. Our mission is to empower schools with the tools they need to deliver exceptional educational experiences while streamlining administrative operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiBarChart2 className="h-10 w-10 text-emerald-600" />,
                title: "Personalized Learning",
                description: "Adaptive educational content that meets each student where they are and helps them reach their full potential."
              },
              {
                icon: <FiUsers className="h-10 w-10 text-emerald-600" />,
                title: "Empowered Educators",
                description: "Tools that free teachers from administrative burdens so they can focus on what matters most—teaching."
              },
              {
                icon: <FiGlobe className="h-10 w-10 text-emerald-600" />,
                title: "Franchise Excellence",
                description: "Comprehensive management solutions designed specifically for educational franchise operations."
              },
              {
                icon: <FiStar className="h-10 w-10 text-emerald-600" />,
                title: "Innovative Assessment",
                description: "Industry-leading subjective assessment capabilities that go beyond multiple-choice."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl"
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-emerald-100">
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500">
                    <span className="text-5xl font-bold">Ionia</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2021, Ionia began with a vision to solve the most pressing challenges facing educational institutions today. Our founders, with decades of experience in both education and technology, recognized that schools needed more than just digital versions of traditional tools.
                </p>
                <p className="text-gray-600 mb-4">
                  They needed comprehensive solutions that could adapt to each student's needs while reducing the administrative burden on teachers and staff. Thus, Ionia was born—a platform that combines personalized learning with powerful management tools designed specifically for educational franchises.
                </p>
                <p className="text-gray-600">
                  Today, we continue to innovate at the intersection of education and technology, helping schools around the world deliver better outcomes for their students.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              Ready to transform your educational institution?
            </motion.h2>
            <motion.p 
              className="text-lg text-emerald-100 mb-8"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join the growing number of schools using Ionia to deliver exceptional educational experiences.
            </motion.p>
            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/contact"
                className="inline-block px-8 py-4 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Contact Us Today
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage; 