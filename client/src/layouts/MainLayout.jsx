import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Layout, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine user's dashboard link
  const getDashboardLink = () => {
    if (!user) return '/';
    return `/${user.role}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d12] text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/10 group-hover:scale-102 transition-transform duration-200">
                <Layout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight font-display text-white">
                CampusHub
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
              <a href="/#features" className="hover:text-blue-400 transition-colors duration-200">Features</a>
              <a href="/#about" className="hover:text-blue-400 transition-colors duration-200">About</a>
              <a href="/#how-it-works" className="hover:text-blue-400 transition-colors duration-200">How It Works</a>
              <a href="/#faq" className="hover:text-blue-400 transition-colors duration-200">FAQs</a>
              <a href="/#contact" className="hover:text-blue-400 transition-colors duration-200">Contact</a>
            </nav>

            {/* Authentication Buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#08090d] border-t border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Layout className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold tracking-tight font-display text-white">
                  CampusHub
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mx-auto md:mx-0">
                A modern, responsive, and role-based College Management System to organize, assign, track, and empower students and educators.
              </p>
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold mb-3 text-sm font-display uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="/#about" className="hover:text-blue-400 transition-colors">About Hub</a></li>
                <li><a href="/#how-it-works" className="hover:text-blue-400 transition-colors">Process</a></li>
                <li><a href="/#contact" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold mb-3 text-sm font-display uppercase tracking-wider">Admin Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: admin@campushub.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Location: Campus Admin Block, NY</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>&copy; 2026 CampusHub CMS. All rights reserved.</p>
            <p>Designed for educational excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
