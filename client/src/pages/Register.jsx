import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import { User, Mail, Lock, UserPlus, AlertCircle, School, Calendar } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const { register, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Fetch departments list
  useEffect(() => {
    const fetchDepartments = async () => {
      // Populate departments list from DB, fallback if empty
      try {
        const res = await api.get('/auth/departments'); // Public departments endpoint
        if (res.data.success) {
          setDepartmentsList(res.data.departments);
          if (res.data.departments.length > 0) {
            setDepartment(res.data.departments[0]._id);
          }
        }
      } catch (err) {
        // Fallback to empty, we will try again, or use static departments for ease
      }
    };

    fetchDepartments();
    setError(null);
    setValidationError('');
  }, [setError]);

  // Fallback departments if backend has none yet or request fails
  useEffect(() => {
    if (departmentsList.length === 0) {
      // In register page we can pull departments or load seeded ones
    }
  }, [departmentsList]);

  // If there are no departments, let's try to query the backend again
  const refreshDepartments = async () => {
    try {
      const res = await api.get('/auth/departments');
      if (res.data.success && res.data.departments.length > 0) {
        setDepartmentsList(res.data.departments);
        setDepartment(res.data.departments[0]._id);
      }
    } catch (e) {}
  };


  // Run on mount to check if user already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    // Form validation checks
    if (!name.trim()) return setValidationError('Name is required');
    if (!email.trim()) return setValidationError('Email is required');
    if (!password) return setValidationError('Password is required');
    if (password.length < 6) return setValidationError('Password must be at least 6 characters');
    if (role !== 'admin' && !department) {
      return setValidationError('Department is required. Please seed departments or select one.');
    }

    try {
      setLoading(true);
      await register(name, email, password, role, role === 'admin' ? undefined : department, role === 'student' ? semester : undefined);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-lg glassmorphism p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display text-gray-100">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Join the CampusHub college portal</p>
          </div>

          {(validationError || error) && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{validationError || error}</span>
                {(!department && role !== 'admin') && (
                  <p className="text-xs text-red-400/90 mt-1">
                    Please make sure the backend database is seeded. Run `npm run seed` in the server folder, then{' '}
                    <button type="button" onClick={refreshDepartments} className="underline font-bold text-white hover:text-blue-300">
                      Click here to refresh departments
                    </button>.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-250 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role !== 'admin' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <School className="w-5 h-5" />
                    </div>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-250 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Department</option>
                      {departmentsList.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Semester
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-gray-250 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Profile
                </>
              )}
            </button>
          </form>

          {/* Trigger list refetch if empty */}
          {departmentsList.length === 0 && role !== 'admin' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={refreshDepartments}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
              >
                Click to load departments from seeded server
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
