# 🧑‍💼 Hiring Marketplace

A full-stack job marketplace platform built with **Express, TypeScript, Prisma, PostgreSQL**, and **React/TypeScript**.  
This project enables employers to create jobs and candidates to apply — with authentication, job management, and a scalable structure.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, TypeScript |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Frontend | React, TypeScript |
| Version Control | Git & GitHub |

---

## 🚀 Features

### ✅ Backend
- User authentication (JWT)
- Secure role-based access (Employer/User)
- CRUD operations for Jobs
- Apply to jobs
- Pagination & filtering
- Error handling and validation

### ✅ Frontend
- Login/Register
- Job listings
- Job creation/editing (for employers)
- Apply for jobs (for candidates)
- Responsive UI

---

## 📁 Repository Structure


hiring_marketplace/
├── backend/ # Backend server
│ ├── src/
│ ├── prisma/
│ ├── .env
│ └── package.json
├── FRONTEND/ # Frontend app
│ └── src/
├── .gitignore
├── GETTING_STARTED.md
├── INTEGRATION_SUMMARY.md
├── SETUP_GUIDE.md
└── package.json


---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/itz-ankit-425/hiring_marketplace.git
cd hiring_marketplace
🛠 Backend Setup
Install dependencies
cd backend
npm install
Configure Environment Variables

Create a .env in backend/:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_here"
PORT=5000
Run Prisma Migrations
npx prisma migrate dev --name init
Start server
npm run dev

API starts at:
➡️ http://localhost:5000

🛠 Frontend Setup
cd FRONTEND
npm install
npm start

Frontend runs at:
➡️ http://localhost:3000

📦 API Endpoints
Route	Method	Description
/auth/register	POST	Register user
/auth/login	POST	Login user
/jobs	GET	List jobs
/jobs	POST	Create job (employer only)
/jobs/:id	GET	Get job details
/jobs/:id	PATCH	Update job
/jobs/:id	DELETE	Delete job

See backend docs for full details and request/response examples.

🔒 Environment Variables

Backend .env:

DATABASE_URL=
JWT_SECRET=
PORT=
🗂 Database (Prisma)

To generate client:

npx prisma generate

To reset DB:

npx prisma migrate reset
💡 Development Tips

✨ Frontend & backend are separate — you can run both concurrently
✨ Keep .env values secure
✨ Write commits with clear messages

⭐ Contributing

Fork the repo

Create a new branch

git checkout -b feature/awesome-feature

Commit your changes

Open a pull request
