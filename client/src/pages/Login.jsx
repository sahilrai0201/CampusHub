import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear previous errors when landing on the login page
  useEffect(() => {
    setError(null);
    setValidationError('');
  }, [setError]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || `/${user.role}`;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    // Simple validation checks
    if (!email) {
      return setValidationError('Email is required');
    }
    if (!password) {
      return setValidationError('Password is required');
    }
    if (password.length < 6) {
      return setValidationError('Password must be at least 6 characters long');
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      // Error is set in AuthContext
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md glassmorphism p-8 rounded-2xl border border-slate-800/80 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display text-gray-100">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to access your CampusHub dashboard</p>
          </div>

          {/* Validation or Auth API Error messages */}
          {(validationError || error) && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{validationError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick links to seed info */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              Default system administrator account info:<br />
              Email: <span className="text-gray-300 font-medium">admin@campushub.com</span><br />
              Password: <span className="text-gray-300 font-medium">adminpassword</span>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
