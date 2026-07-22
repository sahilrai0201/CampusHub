import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store the original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If unauthorized, redirect to their respective dashboard
    let dashboardPath = '/';
    if (user.role === 'admin') dashboardPath = '/admin';
    else if (user.role === 'faculty') dashboardPath = '/faculty';
    else if (user.role === 'student') dashboardPath = '/student';

    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
