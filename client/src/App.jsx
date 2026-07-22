import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard / Private pages
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Admin child pages
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageStudents from './pages/admin/ManageStudents';
import ManageNotices from './pages/admin/ManageNotices';

// Faculty child pages
import FacultySubjects from './pages/faculty/FacultySubjects';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyNotes from './pages/faculty/FacultyNotes';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyNotices from './pages/faculty/FacultyNotices';

// Student child pages
import StudentAttendance from './pages/student/StudentAttendance';
import StudentMarks from './pages/student/StudentMarks';
import StudentNotes from './pages/student/StudentNotes';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentNotices from './pages/student/StudentNotices';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageFaculty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageNotices />
            </ProtectedRoute>
          }
        />

        {/* Faculty Dashboard Protected Routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/profile"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/subjects"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultySubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/attendance"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/notes"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/assignments"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/notices"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyNotices />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard Protected Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/marks"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notes"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notices"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentNotices />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
