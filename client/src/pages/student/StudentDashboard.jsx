import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { ClipboardList, CheckSquare, Clock, FileText, Bell, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    pendingAssignments: 0,
    submittedAssignments: 0,
    totalNotes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching student dashboard stats:', err.message);
        setError('No classes or registration records found. Please consult the admin.');
      }

      try {
        const res = await api.get('/student/notices');
        if (res.data.success) {
          setLatestNotices(res.data.notices.slice(0, 3));
        }
      } catch (err) {}
      setLoading(false);
    };

    fetchStudentData();
  }, []);

  const statCards = [
    {
      title: 'My Attendance',
      value: stats.attendancePercentage !== null ? `${stats.attendancePercentage.toFixed(1)}%` : '0.0%',
      icon: ClipboardList,
      color: 'from-blue-600 to-indigo-500',
      shadow: 'shadow-blue-500/10',
      link: '/student/attendance',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingAssignments,
      icon: Clock,
      color: 'from-orange-600 to-pink-500',
      shadow: 'shadow-orange-500/10',
      link: '/student/assignments',
    },
    {
      title: 'Submissions Made',
      value: stats.submittedAssignments,
      icon: CheckSquare,
      color: 'from-emerald-600 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      link: '/student/assignments',
    },
    {
      title: 'Download Notes',
      value: stats.totalNotes,
      icon: FileText,
      color: 'from-purple-600 to-violet-500',
      shadow: 'shadow-purple-500/10',
      link: '/student/notes',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/20 via-indigo-950/10 to-transparent p-6 rounded-2xl border border-blue-500/10 relative overflow-hidden">
          <div className="absolute top-1/2 right-10 -translate-y-1/2 text-blue-500/10 pointer-events-none">
            <Sparkles className="w-36 h-36" />
          </div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Welcome to CampusHub</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Access study PDFs uploaded by teachers, complete pending home projects, check attendance targets, and view notices.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 text-blue-400 px-4 py-3.5 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-blue-400" />
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
                className="dashboard-card glassmorphism p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden group block"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300 pointer-events-none`} />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-lg ${card.shadow}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-850 animate-pulse rounded" />
                ) : (
                  <h3 className="text-3xl font-bold text-gray-100 font-display tracking-tight">{card.value}</h3>
                )}
              </Link>
            );
          })}
        </div>

        {/* Portal shortcut areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glassmorphism p-6 md:p-8 rounded-2xl border border-slate-800/80">
            <h3 className="text-lg font-bold text-gray-100 mb-6 font-display font-sans">Academic Modules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/student/attendance"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Attendance Logs</h4>
                <p className="text-gray-400 text-xs mt-1">Review lecture presence statistics and logs list.</p>
              </Link>
              <Link
                to="/student/notes"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Study Lectures Notes</h4>
                <p className="text-gray-400 text-xs mt-1">View, search, and download PDFs posted by professors.</p>
              </Link>
              <Link
                to="/student/assignments"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Assignments Board</h4>
                <p className="text-gray-400 text-xs mt-1">Submit files, download sheets, and verify status.</p>
              </Link>
              <Link
                to="/student/marks"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Mark Sheet & Grades</h4>
                <p className="text-gray-400 text-xs mt-1">View scores and comments returned by lecturers.</p>
              </Link>
            </div>
          </div>

          {/* Notices Section */}
          <div className="lg:col-span-1 glassmorphism p-6 rounded-2xl border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 font-display">Campus Announcements</h3>
              <Link to="/student/notices" className="text-xs text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex-grow space-y-4">
              {latestNotices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                  <Bell className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500">No notices posted recently</p>
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

export default StudentDashboard;
