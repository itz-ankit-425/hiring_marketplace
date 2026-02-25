# IMPORTANT: Database Setup Required

Before running the application, you MUST set up the database and regenerate the Prisma client.

## Quick Start (for Windows)

1. **Install Dependencies** (if not already done):
```bash
cd backend
npm install

cd ../FRONTEND
npm install
```

2. **Setup Database** - Run this in the backend directory:
```bash
cd backend

# Generate Prisma Client with updated schema
npx prisma generate

# Create and run migrations
npx prisma migrate deploy
```

3. **Start the Application**:

Option A - Using batch script (easiest):
```bash
# From root directory
start.bat
```

Option B - Manual (two terminals):

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd FRONTEND  
npm run dev
```

## What Changed

The backend has been fully integrated with:
- ✅ Updated Prisma schema with all required fields (name, location, status, timestamps)
- ✅ Fixed endpoint routes
- ✅ Fixed controller logic
- ✅ Proper error handling
- ✅ JWT authentication
- ✅ Password hashing

The frontend has been updated to:
- ✅ Properly display job data
- ✅ Handle job applications
- ✅ Show application status
- ✅ Register with name field
- ✅ Post jobs with full details

## Database Configuration

The application expects PostgreSQL with:
- Host: localhost
- Port: 5432
- Database: hiring_marketplace
- Username: postgres
- Password: postgres

If you use different credentials, update `backend/.env`

## Testing the App

1. Open http://localhost:5173 in your browser
2. Register a new account (Job Seeker or Employer)
3. Test the features:
   - **Job Seeker**: Browse jobs, apply to jobs, view applications
   - **Employer**: Post jobs, view posted jobs
