#!/usr/bin/env node

/**
 * IONIA STAGE 2 - DEVELOPMENT SETUP SCRIPT
 * This script sets up the development environment with demo data
 */

import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { School } from './src/models/school.model.js';
import { Class } from './src/models/class.model.js';
import { Subject } from './src/models/subject.model.js';
import { CONFIG } from './src/config/index.js';
import bcrypt from 'bcrypt';

console.log('🚀 Starting Ionia Stage 2 Development Setup...\n');

/**
 * Setup demo data for development
 */
async function setupDemoData() {
  try {
    console.log('📊 Setting up demo data...');

    // Create demo school
    let demoSchool = await School.findOne({ name: 'Ionia Demo School' });
    if (!demoSchool) {
      demoSchool = await School.create({
        name: 'Ionia Demo School',
        address: '123 Education St, Demo City, Demo State, 12345, India',
        contactInfo: 'Phone: +91-1234567890, Email: demo@ionia.sbs, Website: https://demo.ionia.sbs',
        isActive: true,
        colorTheme: '#4F46E5',
        policies: {
          gradingScale: 'A=90-100,B=80-89,C=70-79,D=60-69,F=0-59',
          lateSubmissionRule: 'Allowed with 10% penalty per day'
        }
      });
      console.log('✅ Demo school created');
    } else {
      console.log('✅ Demo school already exists');
    }

    // Create demo subjects
    const subjects = [
      { name: 'Mathematics', subjectCode: 'MATH', schoolId: demoSchool._id },
      { name: 'Physics', subjectCode: 'PHY', schoolId: demoSchool._id },
      { name: 'Chemistry', subjectCode: 'CHEM', schoolId: demoSchool._id },
      { name: 'Biology', subjectCode: 'BIO', schoolId: demoSchool._id },
      { name: 'English', subjectCode: 'ENG', schoolId: demoSchool._id }
    ];

    for (const subjectData of subjects) {
      const existingSubject = await Subject.findOne({ 
        subjectCode: subjectData.subjectCode, 
        schoolId: demoSchool._id 
      });
      if (!existingSubject) {
        await Subject.create(subjectData);
        console.log(`✅ Subject ${subjectData.name} created`);
      }
    }

    // Create demo classes
    const classes = [
      { name: 'Class 9-A', yearOrGradeLevel: 9, section: 'A', schoolId: demoSchool._id },
      { name: 'Class 10-A', yearOrGradeLevel: 10, section: 'A', schoolId: demoSchool._id },
      { name: 'Class 11-Science', yearOrGradeLevel: 11, section: 'Science', schoolId: demoSchool._id },
      { name: 'Class 12-Science', yearOrGradeLevel: 12, section: 'Science', schoolId: demoSchool._id }
    ];

    for (const classData of classes) {
      const existingClass = await Class.findOne({ 
        name: classData.name, 
        schoolId: demoSchool._id 
      });
      if (!existingClass) {
        await Class.create(classData);
        console.log(`✅ Class ${classData.name} created`);
      }
    }

    // Create demo users
    const class9A = await Class.findOne({ name: 'Class 9-A', schoolId: demoSchool._id });
    const class11Science = await Class.findOne({ name: 'Class 11-Science', schoolId: demoSchool._id });
    
    const demoUsers = [
      {
        fullName: 'Super Admin User',
        email: 'superadmin@ionia.sbs',
        username: 'superadmin',
        password: 'password123',
        role: 'superAdmin'
        // No schoolId for super admin
      },
      {
        fullName: 'School Admin User',
        email: 'admin@demo.ionia.sbs',
        username: 'schooladmin',
        password: 'password123',
        role: 'schoolAdmin',
        schoolId: demoSchool._id
      },
      {
        fullName: 'Class Teacher User',
        email: 'classteacher@demo.ionia.sbs',
        username: 'classteacher',
        password: 'password123',
        role: 'classTeacher',
        schoolId: demoSchool._id,
        assignedClass: class9A._id // Required for classTeacher
      },
      {
        fullName: 'Teacher User',
        email: 'teacher@demo.ionia.sbs',
        username: 'teacher',
        password: 'password123',
        role: 'teacher',
        schoolId: demoSchool._id
      },
      {
        fullName: 'Student User',
        email: 'student@demo.ionia.sbs',
        username: 'student',
        password: 'password123',
        role: 'student',
        schoolId: demoSchool._id,
        enrolledClasses: [class11Science._id] // Add enrolled class for student
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ User ${userData.fullName} (${userData.role}) created`);
      }
    }

    console.log('\n🎉 Demo data setup completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('   Super Admin: superadmin@ionia.sbs / password123');
    console.log('   School Admin: admin@demo.ionia.sbs / password123');
    console.log('   Class Teacher: classteacher@demo.ionia.sbs / password123');
    console.log('   Teacher: teacher@demo.ionia.sbs / password123');
    console.log('   Student: student@demo.ionia.sbs / password123');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
async function testDatabaseConnection() {
  console.log('📊 Testing Database Connection...');
  try {
    await mongoose.connect(CONFIG.DATABASE.URI, CONFIG.DATABASE.CONNECTION_OPTIONS);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 To fix database connection:');
    console.log('   1. Install MongoDB: brew install mongodb-community');
    console.log('   2. Start MongoDB: brew services start mongodb-community');
    console.log('   3. Or use Docker: docker run -d -p 27017:27017 mongo');
    console.log('   4. Or configure Atlas connection in .env file');
    return false;
  }
}

/**
 * Main setup function
 */
async function runSetup() {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.log('\n⚠️  Setup incomplete: Database connection failed');
      console.log('   Please fix database connection and run setup again');
      process.exit(1);
    }

    // Setup demo data
    await setupDemoData();

    console.log('\n🚀 Development environment setup completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Start frontend: cd ../frontend && npm run dev');
    console.log('   3. Visit: http://localhost:3000');
    console.log('   4. Login with demo credentials above');

  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Check if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSetup();
} 