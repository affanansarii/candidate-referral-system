# Candidate Referral Management System

A full-stack application for managing candidate referrals, built with React frontend and Node.js/Express backend.

## Features Implemented

### Core Features

-   ✅ Dashboard displaying referred candidates
-   ✅ Candidate referral form with validation
-   ✅ Search and filter functionality
-   ✅ Status management (Pending → Reviewed → Hired)
-   ✅ Resume upload (PDF only)
-   ✅ Delete candidates

### Bonus Features

-   ✅ Authentication system (JWT)
-   ✅ Metrics dashboard with statistics
-   ✅ Responsive design with Tailwind CSS
-   ✅ Redux state management

## Tech Stack

### Frontend

-   React 18 with Vite
-   Redux Toolkit for state management
-   Tailwind CSS for styling
-   Axios for API calls

### Backend

-   Node.js with Express
-   MongoDB with Mongoose
-   JWT for authentication
-   Multer for file uploads
-   Express Validator for input validation

## Setup Instructions

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or Atlas)
-   npm or yarn

### Backend Setup

1. Navigate to backend directory:
    ```bash
    cd backend
    Install dependencies:
    ```

bash
npm install
Create uploads directory:

bash
mkdir uploads
Set up environment variables in .env file

Start the backend server:

bash
npm run dev
Frontend Setup
Navigate to frontend directory:

bash
cd frontend
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
Database Setup
The application uses MongoDB. You can either:

Use a local MongoDB instance

Use MongoDB Atlas (cloud)

Update the MONGODB_URI in the .env file

API Documentation
Candidates Endpoints
GET /api/candidates
Fetch all candidates with optional search and filtering.

Query Parameters:

search (optional): Search by name or job title

status (optional): Filter by status (Pending/Reviewed/Hired)

POST /api/candidates
Create a new candidate referral.

Body (multipart/form-data):

name (required): Candidate name

email (required): Candidate email

phone (required): Candidate phone

jobTitle (required): Job title

resume (optional): PDF file

PUT /api/candidates/:id/status
Update candidate status.

Body (JSON):

status (required): New status (Pending/Reviewed/Hired)

DELETE /api/candidates/:id
Delete a candidate.

GET /api/candidates/stats
Get candidate statistics.

Authentication Endpoints (Bonus)
POST /api/auth/register
Register a new user.

POST /api/auth/login
Login user and get JWT token.

Assumptions & Limitations
Assumptions
Single user system (authentication is optional bonus)

PDF files are stored locally (for development)

Phone number validation is basic

Limitations
No email verification

No file size limits in UI (only backend)

No pagination for large candidate lists

Local file storage for resumes (not production-ready)

Deployment
Frontend (Vercel/Netlify)
Build the project: npm run build

Deploy the dist folder

Backend (Heroku/Railway)
Set environment variables

Ensure MongoDB connection string is set

Deploy with proper start script

Database
Use MongoDB Atlas for production database

Future Enhancements
Email notifications

Cloud storage for resumes (AWS S3)

Advanced search and filtering

Candidate notes and comments

Bulk operations

Export functionality

Role-based access control

text

## Postman Collection

You can create a Postman collection with the following endpoints:

1. **GET** `http://localhost:5000/api/candidates`
2. **POST** `http://localhost:5000/api/candidates` (multipart/form-data)
3. **PUT** `http://localhost:5000/api/candidates/:id/status`
4. **DELETE** `http://localhost:5000/api/candidates/:id`
5. **GET** `http://localhost:5000/api/candidates/stats`
6. **POST** `http://localhost:5000/api/auth/register`
7. **POST** `http://localhost:5000/api/auth/login`

This complete implementation provides all the required features plus bonus functionality. The system is modular, well-structured, and ready for further development and deployment.
