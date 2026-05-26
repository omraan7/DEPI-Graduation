# Physical Therapy Platform - Backend

This is the backend for the DEPI-Graduation Physical Therapy Platform, built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication** (Login/Register)
- **Role-based Access Control** (Patient, Doctor, Admin)
- **Patient APIs**: Profile, Pain Tracking, Exercises, Notifications, Doctors listing
- **Doctor APIs**: Dashboard, Patients List, Patient Detail, Treatment Plan creation
- **Messaging APIs**: Chat between Doctors and Patients
- **File Upload**: Profile avatars, Medical reports, etc.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your details:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/depi_graduation
   JWT_SECRET=your_jwt_secret_key_here
   ```
   *Make sure you have MongoDB running locally or provide a MongoDB Atlas URI.*

3. **Run the Server**
   - For development (using watch mode):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## API Structure

- `/api/auth` - Authentication routes
- `/api/patient` - Patient specific routes
- `/api/doctor` - Doctor specific routes
- `/api/messages` - Messaging system
- `/api/upload` - File uploading

## Integrating with React Frontend

In your React app, set the base URL for axios/fetch to `http://localhost:5000`. Make sure to attach the `Authorization: Bearer <token>` header to protected routes.
