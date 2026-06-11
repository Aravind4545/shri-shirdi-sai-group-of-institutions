# Installation Guide

## Prerequisites
- Node.js (v18.x recommended)
- MongoDB Atlas Account (or local MongoDB)
- Git

## Step-by-Step Local Setup

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd SSSI-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the backend directory:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/sssi_prod
     JWT_SECRET=your_super_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     ```
   - Start the development server: `npm run dev`

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the Vite development server: `npm run dev`

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
