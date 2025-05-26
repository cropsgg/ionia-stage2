/**
 * IONIA STAGE 2 LMS - CONFIGURATION MODULE
 * Centralizes all environment configuration and provides defaults
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

// ===========================================
// SERVER CONFIGURATION
// ===========================================
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: (process.env.NODE_ENV || 'development') === 'development',
};

// ===========================================
// API CONFIGURATION
// ===========================================
export const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: process.env.API_BASE_URL || `http://localhost:${SERVER_CONFIG.PORT}`,
  
  // API Version
  VERSION: 'v1',
  
  // API Prefix
  PREFIX: '/api/v1',
  
  // Frontend URL for CORS and redirects
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'https://ionia.sbs',
        'https://www.ionia.sbs',
        'https://api.ionia.sbs'
      ],
};

// ===========================================
// DATABASE CONFIGURATION
// ===========================================
export const DATABASE_CONFIG = {
  // Use production URI if available, otherwise use local or atlas fallback
  URI: process.env.MONGODB_URI_PRODUCTION || 
       process.env.DATABASE_ATLAS || 
       process.env.MONGODB_URI || 
       'mongodb://localhost:27017/ionia-stage2-dev',
  
  CONNECTION_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  },
};

// ===========================================
// JWT AUTHENTICATION CONFIGURATION
// ===========================================
export const JWT_CONFIG = {
  ACCESS_TOKEN: {
    SECRET: process.env.ACCESS_TOKEN_SECRET,
    EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  },
  
  REFRESH_TOKEN: {
    SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },
};

// ===========================================
// COOKIE CONFIGURATION
// ===========================================
export const COOKIE_CONFIG = {
  DOMAIN: process.env.COOKIE_DOMAIN || (SERVER_CONFIG.IS_PRODUCTION ? '.ionia.sbs' : 'localhost'),
  SECURE: process.env.COOKIE_SECURE === 'true' || SERVER_CONFIG.IS_PRODUCTION,
  SAME_SITE: process.env.COOKIE_SAME_SITE || (SERVER_CONFIG.IS_PRODUCTION ? 'none' : 'lax'),
  HTTP_ONLY: true,
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ===========================================
// CLOUDINARY CONFIGURATION
// ===========================================
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  API_KEY: process.env.CLOUDINARY_API_KEY || '',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  // File upload settings
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
};

// ===========================================
// EMAIL CONFIGURATION
// ===========================================
export const EMAIL_CONFIG = {
  HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  PORT: parseInt(process.env.EMAIL_PORT) || 587,
  USERNAME: process.env.EMAIL_USERNAME || '',
  PASSWORD: process.env.EMAIL_PASSWORD || '',
  FROM_NAME: process.env.EMAIL_FROM_NAME || 'Ionia LMS',
  FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'noreply@ionia.sbs',
  TEST_MODE: process.env.TEST_EMAIL === 'true',
};

// ===========================================
// MULTI-TENANCY CONFIGURATION
// ===========================================
export const TENANCY_CONFIG = {
  ENABLED: process.env.ENABLE_MULTI_TENANCY !== 'false', // Default to enabled
  DEFAULT_SCHOOL_ID: process.env.DEFAULT_SCHOOL_ID || 'dev-school-001',
  ENFORCE_ISOLATION: true,
};

// ===========================================
// SECURITY CONFIGURATION
// ===========================================
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // Password policy
  PASSWORD: {
    MIN_LENGTH: parseInt(process.env.MIN_PASSWORD_LENGTH) || 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  
  // Account security
  ACCOUNT: {
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    LOCKOUT_TIME_MS: parseInt(process.env.ACCOUNT_LOCKOUT_TIME) || 30 * 60 * 1000, // 30 minutes
  },
};

// ===========================================
// FEATURE FLAGS
// ===========================================
export const FEATURE_FLAGS = {
  AI_GRADING: process.env.ENABLE_AI_GRADING === 'true',
  ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false', // Default to enabled
  FILE_UPLOAD: process.env.ENABLE_FILE_UPLOAD !== 'false', // Default to enabled
  NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS !== 'false', // Default to enabled
  QUIZ: process.env.ENABLE_QUIZ !== 'false', // Default to enabled
  EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
};

// ===========================================
// CORS CONFIGURATION
// ===========================================
export const CORS_CONFIG = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (API_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any localhost origins in development
    if (SERVER_CONFIG.IS_DEVELOPMENT && origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Allow any subdomain of ionia.sbs
    if (origin.match(/^https?:\/\/([a-z0-9-]+\.)?ionia\.sbs$/)) {
      return callback(null, true);
    }
    
    // Reject origin
    const error = new Error('Not allowed by CORS');
    error.status = 403;
    return callback(error, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Api-Version',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// ===========================================
// EXPORT ALL CONFIGURATION
// ===========================================
export const CONFIG = {
  SERVER: SERVER_CONFIG,
  API: API_CONFIG,
  DATABASE: DATABASE_CONFIG,
  JWT: JWT_CONFIG,
  COOKIES: COOKIE_CONFIG,
  CLOUDINARY: CLOUDINARY_CONFIG,
  EMAIL: EMAIL_CONFIG,
  TENANCY: TENANCY_CONFIG,
  SECURITY: SECURITY_CONFIG,
  FEATURES: FEATURE_FLAGS,
  CORS: CORS_CONFIG,
};

// Log configuration on startup (excluding sensitive data)
if (SERVER_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Configuration loaded:');
  console.log(`   Environment: ${SERVER_CONFIG.NODE_ENV}`);
  console.log(`   Port: ${SERVER_CONFIG.PORT}`);
  console.log(`   API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`   Frontend URL: ${API_CONFIG.FRONTEND_URL}`);
  console.log(`   Database: ${DATABASE_CONFIG.URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   Multi-tenancy: ${TENANCY_CONFIG.ENABLED ? 'Enabled' : 'Disabled'}`);
  console.log(`   Features: ${Object.entries(FEATURE_FLAGS).filter(([_, enabled]) => enabled).map(([name]) => name).join(', ')}`);
}

export default CONFIG; 