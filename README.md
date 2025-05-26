# 🚀 Ionia Stage 2 - Personalized Learning Management System

A comprehensive, multi-tenant LMS platform for schools with advanced features including AI-assisted grading, analytics, and role-based access control.

## 📋 Features

- **Multi-Tenancy**: Complete data isolation for multiple schools
- **Role-Based Access Control**: Student, Teacher, Class Teacher, School Admin, Super Admin
- **Homework & Assessment System**: Create, assign, and grade homework
- **Real-time Analytics**: Performance tracking and insights
- **File Upload & Management**: Secure file handling with Cloudinary
- **JWT Authentication**: Secure token-based authentication
- **Modern UI**: Beautiful React/Next.js frontend

## 🏗️ Architecture

### Backend (Node.js/Express)
- RESTful API design
- MongoDB with Mongoose ODM
- JWT authentication
- Role-based middleware
- Multi-tenant data isolation
- Cloudinary integration for file uploads

### Frontend (Next.js/React)
- Modern React with TypeScript
- Server-side rendering
- Responsive design
- Component-based architecture

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd ionia-stage2

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Environment Setup

Copy the environment example file:

```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Required for development
NODE_ENV=development
PORT=8000

# Database (choose one)
MONGODB_URI=mongodb://localhost:27017/ionia-stage2-dev
# OR use MongoDB Atlas
# MONGODB_URI_PRODUCTION=mongodb+srv://user:pass@cluster.mongodb.net/ionia-stage2

# JWT Secrets (required)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_minimum_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_minimum_32_chars

# Optional: Cloudinary for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Option B: MongoDB Atlas
Configure your Atlas connection string in the `.env` file.

### 4. Initialize Demo Data

```bash
cd backend
npm run setup
```

This creates demo school, users, classes, and subjects.

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend  
cd frontend
npm run dev
```

Visit: http://localhost:3000

## 👥 Demo Accounts

After running `npm run setup`, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@ionia.sbs | password123 |
| School Admin | admin@demo.ionia.sbs | password123 |
| Class Teacher | classteacher@demo.ionia.sbs | password123 |
| Teacher | teacher@demo.ionia.sbs | password123 |
| Student | student@demo.ionia.sbs | password123 |

## 🔧 Development

### Backend API Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Authentication, RBAC, etc.
│   ├── config/         # Configuration
│   └── utils/          # Utilities
├── setup-dev.js        # Development setup script
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilities
│   └── styles/         # CSS modules
└── package.json
```

### API Endpoints

- `GET /` - Health check
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/homework` - Get homework (role-based)
- `POST /api/v1/homework` - Create homework (teachers only)
- `GET /api/analytics/*` - Analytics endpoints

### Role Permissions

- **Student**: View assignments, submit homework, view own grades
- **Teacher**: Create homework for assigned subjects, grade submissions
- **Class Teacher**: View all student reports for assigned class
- **School Admin**: Manage school users and data
- **Super Admin**: Access all schools and data

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8000/

# Test login
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@demo.ionia.sbs", "password": "password123"}'
```

## 📊 Multi-Tenancy

The system supports multiple schools with complete data isolation:

- Each school has its own data space
- Users belong to specific schools (except Super Admins)
- All queries are automatically filtered by school
- Super Admins can access all schools

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Password hashing with bcrypt
- CORS configuration
- Input validation
- SQL injection prevention
- Rate limiting (configurable)

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI_PRODUCTION=your_atlas_connection_string
ACCESS_TOKEN_SECRET=secure_production_secret
REFRESH_TOKEN_SECRET=secure_production_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Build & Deploy

```bash
# Backend
cd backend
npm run deploy

# Frontend
cd frontend
npm run build
npm start
```

## 📈 Performance

- MongoDB indexes for efficient queries
- JWT stateless authentication
- Optimized React components
- Server-side rendering with Next.js
- Cloudinary CDN for file delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@ionia.sbs or create an issue in the repository.

---

Built with ❤️ for education by the Ionia team. 