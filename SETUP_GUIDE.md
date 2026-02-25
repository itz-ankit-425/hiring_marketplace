# Hiring Marketplace - Full Setup Guide

This is a complete fullstack web application built with:
- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS

## Prerequisites

Make sure you have installed:
- Node.js (18+)
- PostgreSQL (13+)
- npm or yarn

## Setup Instructions

### 1. PostgreSQL Database Setup

First, create a PostgreSQL database:

```bash
# Using psql CLI
psql -U postgres

# In psql prompt:
CREATE DATABASE hiring_marketplace;
\q
```

Or if using a GUI, create a database named `hiring_marketplace` with:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# (Optional) Seed database with test data
# npx prisma db seed

# Start development server
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd FRONTEND

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:5173**

## Usage

1. **Open Browser**: Navigate to http://localhost:5173
2. **Create Account**: Click "Create an account" and register as either:
   - **Job Seeker** - Can browse and apply to jobs
   - **Employer** - Can post new jobs
3. **For Job Seekers**:
   - Browse available jobs on the Jobs page
   - Click "Apply" to submit an application
   - View your applications in the Applications page
4. **For Employers**:
   - Click "Post Job" from Dashboard
   - Fill in job title, description, and location
   - View your posted jobs on the Jobs page

## Architecture

### Database Schema

```
User
├── id (UUID)
├── name (String)
├── email (String, unique)
├── password (String, hashed)
├── role (String: "USER" or "EMPLOYER")
├── createdAt
└── updatedAt

Job
├── id (UUID)
├── title (String)
├── description (String)
├── location (String)
├── employerId (FK to User)
├── createdAt
└── updatedAt

Application
├── id (UUID)
├── userId (FK to User)
├── jobId (FK to Job)
├── status (String: "PENDING", "ACCEPTED", "REJECTED")
├── createdAt
└── updatedAt
```

### API Endpoints

**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

**Jobs**
- GET `/api/jobs` - Get all jobs
- POST `/api/jobs` - Create job (auth required, employer only)
- GET `/api/jobs/:id` - Get job details

**Applications**
- POST `/api/applications` - Apply to job (auth required)
- GET `/api/applications` - Get user's applications (auth required)

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hiring_marketplace"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"
NODE_ENV="development"
PORT=5000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify credentials in backend/.env
- Check if database `hiring_marketplace` exists

### Port Already in Use
- Backend (5000): `lsof -i :5000` or `netstat -ano | findstr :5000`
- Frontend (5173): `lsof -i :5173` or `netstat -ano | findstr :5173`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS is enabled in backend
- Verify VITE_API_BASE_URL in frontend/.env

### Dependencies issues
- Delete node_modules and package-lock.json
- Run `npm install` again

## Development

### Running both servers concurrently:

You can use a tool like `concurrently` or simply open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FRONTEND
npm run dev
```

## Features Implemented

✅ User authentication (register/login)
✅ JWT-based authorization
✅ Password hashing with bcryptjs
✅ Job posting by employers
✅ Job browsing for all users
✅ Job applications tracking
✅ Application status management
✅ Protected routes
✅ Error handling
✅ Responsive UI with Tailwind CSS

## Notes

- All passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days
- Applications track status (PENDING, ACCEPTED, REJECTED)
- Users cannot apply to the same job twice
- Cascading deletes for data integrity
