# CampusHub - College Management System

CampusHub is a modern, responsive, and role-based College Management System designed to bridge the gap between administrators, faculty members, and students by providing automated workflows, assignments tracking, digital notice boards, and attendance logs.

---

## 🚀 Tech Stack

### Frontend
- **React.js (v19)**
- **Vite**
- **Tailwind CSS (v4)**
- **React Router DOM**
- **Axios**
- **Lucide React** (Icons)

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB Atlas**
- **Mongoose**

### Security & Authentication
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Password hashing)
- **Helmet** (Security headers)
- **CORS** (Cross-origin resource sharing)

### File Uploads
- **Multer**

---

## 📂 Folder Structure

```text
CampusHub/
├── client/                 # React Single Page Application (Frontend)
│   ├── src/
│   │   ├── components/     # Reusable UI widgets & Protected Route Guards
│   │   ├── context/        # Session AuthContext & credentials validation
│   │   ├── hooks/          # Custom hooks (e.g. useAuth)
│   │   ├── layouts/        # Dashboard (sidebar/header) & public Main layouts
│   │   ├── pages/          # Landing, login, register, and dash modules
│   │   ├── services/       # Axios API client interceptor
│   │   ├── utils/          # Formatting helpers
│   │   ├── App.jsx         # Routes definition
│   │   └── main.jsx        # App mounting with React Router
│   ├── tailwind.config.js  # Styling configurations
│   └── vite.config.js      # Vite compilation configurations
│
└── server/                 # Node.js Express Application (Backend)
    ├── config/             # DB connectivity
    ├── controllers/        # Auth, Admin, Faculty, and Student controllers
    ├── middleware/         # JWT parsing, Role check, and Multer configs
    ├── models/             # Mongoose DB schemas
    ├── routes/             # API routing
    ├── scripts/            # Database seed script
    ├── uploads/            # Local folder for file storage
    └── server.js           # Server entry point
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory and configure the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.suvpaiw.mongodb.net/campushub?retryWrites=true&w=majority
JWT_SECRET=campushub_jwt_secret_key_123456
NODE_ENV=development
```

### Frontend (`client/.env`)
Optionally create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Clone and open the project directory
Ensure you are in the project root: `CampusHub/`

### Step 2: Install dependencies and Seed database
1. Install backend dependencies and run database seeding:
   ```bash
   cd server
   npm install
   npm run seed
   ```
   *Note: This will populate standard departments and create a default admin login:*
   - **Email**: `admin@campushub.com`
   - **Password**: `adminpassword`

2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Step 3: Run the application
1. Start the backend Express server:
   ```bash
   cd server
   npm start
   ```
   *(Or run `npm run dev` if nodemon is installed globally).*

2. Start the frontend client dev server:
   ```bash
   cd client
   npm run dev
   ```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register student/faculty
- `POST /login` - Log in user
- `GET /profile` - Retrieve active profile (Auth Required)
- `PUT /profile` - Update details and photo (Auth Required)
- `PUT /change-password` - Update password credentials (Auth Required)
- `GET /departments` - Public list of departments (For register screen)

### Admin Console (`/api/admin` - Admin Only)
- `GET /dashboard` - System counts stats
- `GET/POST/PUT/DELETE /departments` - Manage departments
- `GET/POST/PUT/DELETE /subjects` - Manage subjects
- `GET/POST/PUT/DELETE /faculty` - Manage faculty logins
- `GET/POST/PUT/DELETE /students` - Manage students
- `GET/POST/PUT/DELETE /notices` - Notice CRUD

### Faculty Panel (`/api/faculty` - Faculty Only)
- `GET /dashboard` - Teaching statistics
- `GET /subjects` - Assigned subjects
- `GET/POST/DELETE /notes` - Lecture notes PDF uploading
- `GET/POST/DELETE /assignments` - Homework task publishing
- `GET /assignments/:id/submissions` - View students' work
- `PUT /submissions/:id` - Score assignment marks
- `GET /subjects/:id/students` - Registered class list
- `POST /attendance` - Post daily roll call logs
- `GET /attendance` - View attendance history
- `POST/PUT/DELETE /notices` - notice bulletins announcements

### Student Workspace (`/api/student` - Student Only)
- `GET /dashboard` - Metrics summaries
- `GET /notes` - View and download lecture notes
- `GET /assignments` - View assignments list and submissions status
- `POST /submissions` - Submit homework PDF files
- `GET /attendance` - View attendance ratios breakdown

---

## ☁️ Deployment Guide (Render)

This project is optimized to be deployed on **Render** as two separate services:
1. **Backend Web Service** (Node/Express API)
2. **Frontend Static Site** (React/Vite SPA)

---

### Part 1: Backend Deployment (Web Service)
1. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `campushub-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Click **Advanced** and add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(Any secure random key)*
   - `MONGO_URI`: *(Your MongoDB Atlas connection URI)*
     - *Note: Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0` in Network Access) since Render uses dynamic IPs.*
5. Click **Deploy Web Service** and copy the live URL once generated (e.g. `https://campushub-backend.onrender.com`).

---

### Part 2: Frontend Deployment (Static Site)
1. Click **New +** > **Static Site**.
2. Connect the same GitHub repository.
3. Configure the following settings:
   - **Name**: `campushub`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click **Advanced** and add the following **Environment Variables**:
   - `VITE_SERVER_URL`: Paste your backend Web Service URL (e.g., `https://campushub-backend.onrender.com`).
   - `VITE_API_URL`: Paste your backend Web Service URL + `/api` (e.g., `https://campushub-backend.onrender.com/api`).
5. Click **Create Static Site**. Your frontend will be live on Render's CDN.

