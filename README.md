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

## ☁️ Deployment Guide

### Frontend → Vercel
1. Set up a Vercel account and connect it to your GitHub repository.
2. Set Build Command to `npm run build` and Output Directory to `dist`.
3. Add Environment Variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend → Render
1. Create a Web Service on Render pointing to your backend repository.
2. Build Command: `cd server && npm install`
3. Start Command: `cd server && npm start`
4. Add environment configurations (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) inside Render Settings.
