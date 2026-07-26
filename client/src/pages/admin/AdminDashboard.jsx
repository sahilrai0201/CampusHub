import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Users, GraduationCap, School, BookOpen, AlertCircle, Plus, Calendar, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    facultyCount: 0,
    departmentsCount: 0,
    subjectsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err.message);
        setError('Could not retrieve dashboard statistics. Database may be empty.');
      }

      // Fetch notices for dashboard preview
      try {
        const res = await api.get('/admin/notices');
        if (res.data.success) {
          setLatestNotices(res.data.notices.slice(0, 3));
        }
      } catch (err) {}
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.studentsCount,
      icon: GraduationCap,
      iconClass: 'bg-blue-600/10 text-blue-400',
      link: '/admin/students',
    },
    {
      title: 'Total Faculty',
      value: stats.facultyCount,
      icon: Users,
      iconClass: 'bg-purple-600/10 text-purple-400',
      link: '/admin/faculty',
    },
    {
      title: 'Departments',
      value: stats.departmentsCount,
      icon: School,
      iconClass: 'bg-emerald-600/10 text-emerald-400',
      link: '/admin/departments',
    },
    {
      title: 'Subjects Offered',
      value: stats.subjectsCount,
      icon: BookOpen,
      iconClass: 'bg-amber-600/10 text-amber-400',
      link: '/admin/subjects',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-100">System Overview</h1>
            <p className="text-gray-400 text-sm mt-1">Configure users, departments, and course schemas</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/15 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Link>
            <Link
              to="/admin/faculty"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/15 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Faculty
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3.5 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="dashboard-card glassmorphism p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden group block animate-fade-in"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2.5 rounded-xl ${card.iconClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                {loading ? (
                  <div className="h-9 w-16 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <h3 className="text-3xl font-bold text-gray-100 font-display tracking-tight">{card.value}</h3>
                )}
              </Link>
            );
          })}
        </div>

        {/* Info Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Management Shortcuts */}
          <div className="lg:col-span-2 glassmorphism p-6 md:p-8 rounded-2xl border border-slate-800/80">
            <h3 className="text-lg font-bold text-gray-100 mb-6 font-display">Administrative Console</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/departments"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Manage Departments</h4>
                <p className="text-gray-400 text-xs mt-1">Configure degree streams and faculties divisions.</p>
              </Link>
              <Link
                to="/admin/subjects"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Course Syllabus & Subjects</h4>
                <p className="text-gray-400 text-xs mt-1">Map topics and lectures to semesters and instructors.</p>
              </Link>
              <Link
                to="/admin/faculty"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Faculty Logins</h4>
                <p className="text-gray-400 text-xs mt-1">Register teachers, update details, or assign streams.</p>
              </Link>
              <Link
                to="/admin/students"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Student Directory</h4>
                <p className="text-gray-400 text-xs mt-1">Register pupils, manage semesters, and view archives.</p>
              </Link>
            </div>
          </div>

          {/* Quick Notice board view */}
          <div className="lg:col-span-1 glassmorphism p-6 rounded-2xl border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 font-display">System Notices</h3>
              <Link to="/admin/notices" className="text-xs text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex-1 space-y-4">
              {latestNotices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                  <Bell className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500">No notices posted yet</p>
                </div>
              ) : (
                latestNotices.map((notice) => (
                  <div key={notice._id} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/40">
                    <h4 className="font-semibold text-gray-200 text-xs truncate">{notice.title}</h4>
                    <p className="text-gray-400 text-[11px] mt-1 line-clamp-2">{notice.description}</p>
                    <span className="text-[10px] text-gray-500 block mt-2">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
