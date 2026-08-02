import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FILE_BASE_URL } from '../services/api';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  CheckSquare,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  School,
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define sidebar links based on roles
  const getSidebarLinks = () => {
    const commonLinks = [
      { path: `/${user.role}/profile`, label: 'My Profile', icon: User },
    ];

    if (user.role === 'admin') {
      return [
        { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
        { path: '/admin/departments', label: 'Departments', icon: School },
        { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
        { path: '/admin/faculty', label: 'Manage Faculty', icon: Users },
        { path: '/admin/students', label: 'Manage Students', icon: GraduationCap },
        { path: '/admin/notices', label: 'Notice Board', icon: Bell },
        ...commonLinks,
      ];
    } else if (user.role === 'faculty') {
      return [
        { path: '/faculty', label: 'Faculty Dashboard', icon: LayoutDashboard },
        { path: '/faculty/subjects', label: 'My Subjects', icon: BookOpen },
        { path: '/faculty/attendance', label: 'Attendance', icon: ClipboardList },
        { path: '/faculty/notes', label: 'Upload Notes', icon: FileText },
        { path: '/faculty/assignments', label: 'Assignments', icon: CheckSquare },
        { path: '/faculty/notices', label: 'Notices Board', icon: Bell },
        ...commonLinks,
      ];
    } else if (user.role === 'student') {
      return [
        { path: '/student', label: 'Student Dashboard', icon: LayoutDashboard },
        { path: '/student/attendance', label: 'Attendance', icon: ClipboardList },
        { path: '/student/marks', label: 'My Grades', icon: GraduationCap },
        { path: '/student/notes', label: 'Download Notes', icon: FileText },
        { path: '/student/assignments', label: 'Assignments', icon: CheckSquare },
        { path: '/student/notices', label: 'Notices Board', icon: Bell },
        ...commonLinks,
      ];
    }
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-[#0c0d12] text-gray-100 flex flex-col md:flex-row relative">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Section */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 glassmorphism border-r border-slate-800/80 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <School className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold font-display text-white">
              CampusHub
            </span>
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/40">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `${FILE_BASE_URL}${user.profilePhoto}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-blue-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-gray-100">{user.name}</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-900/20 border border-blue-900/30 px-1.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/25 border-l-4 border-blue-500 text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/30'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-blue-400 opacity-100' : 'text-gray-500'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c0d12]/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold font-display text-gray-100 md:block hidden">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {user.department && (
              <span className="hidden sm:inline-block text-xs font-semibold bg-slate-800/70 border border-slate-700/50 text-gray-300 px-3 py-1 rounded-lg">
                Dept: {typeof user.department === 'object' ? user.department.name : user.department}
              </span>
            )}
            {user.semester && (
              <span className="hidden sm:inline-block text-xs font-semibold bg-slate-800/70 border border-slate-700/50 text-gray-300 px-3 py-1 rounded-lg">
                Semester {user.semester}
              </span>
            )}

            <div className="h-8 w-px bg-slate-800" />
            
            <Link to={`/${user.role}/profile`} className="flex items-center gap-2 group">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `${FILE_BASE_URL}${user.profilePhoto}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs group-hover:scale-102 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
