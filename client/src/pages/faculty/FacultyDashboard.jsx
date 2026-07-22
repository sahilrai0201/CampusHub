import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { BookOpen, Users, FileText, CheckSquare, Bell, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    subjectsCount: 0,
    studentsCount: 0,
    notesCount: 0,
    assignmentsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/faculty/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching faculty dashboard stats:', err.message);
        setError('No subjects or data found. Please ask Admin to assign you a subject.');
      }

      try {
        const res = await api.get('/faculty/notices');
        if (res.data.success) {
          setRecentNotices(res.data.notices.slice(0, 3));
        }
      } catch (err) {}
      setLoading(false);
    };

    fetchFacultyData();
  }, []);

  const statCards = [
    {
      title: 'Assigned Subjects',
      value: stats.subjectsCount,
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-500',
      shadow: 'shadow-blue-500/10',
      link: '/faculty/subjects',
    },
    {
      title: 'Total Students',
      value: stats.studentsCount,
      icon: Users,
      color: 'from-purple-600 to-pink-500',
      shadow: 'shadow-purple-500/10',
      link: '/faculty/subjects', // Directs to list of subjects/students
    },
    {
      title: 'Uploaded Notes',
      value: stats.notesCount,
      icon: FileText,
      color: 'from-emerald-600 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      link: '/faculty/notes',
    },
    {
      title: 'Active Assignments',
      value: stats.assignmentsCount,
      icon: CheckSquare,
      color: 'from-orange-600 to-amber-500',
      shadow: 'shadow-orange-500/10',
      link: '/faculty/assignments',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Faculty Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage notes sharing, assignment grading, and attendance track logs</p>
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

        {/* Modules Console */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glassmorphism p-6 md:p-8 rounded-2xl border border-slate-800/80">
            <h3 className="text-lg font-bold text-gray-100 mb-6 font-display">Academic Management Console</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/faculty/attendance"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Mark Daily Attendance</h4>
                <p className="text-gray-400 text-xs mt-1">Select subject, specify date, and mark Present/Absent.</p>
              </Link>
              <Link
                to="/faculty/notes"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Upload Study Material</h4>
                <p className="text-gray-400 text-xs mt-1">Share syllabus notes and lecture PDFs with students.</p>
              </Link>
              <Link
                to="/faculty/assignments"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Create & Grade Assignments</h4>
                <p className="text-gray-400 text-xs mt-1">Define deadlines, review student uploads, and log marks.</p>
              </Link>
              <Link
                to="/faculty/notices"
                className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/20 hover:border-blue-500/25 transition-all text-left block"
              >
                <h4 className="font-semibold text-gray-200 text-sm">Announce Bulletins</h4>
                <p className="text-gray-400 text-xs mt-1">Broadcast academic news, notice changes, or notifications.</p>
              </Link>
            </div>
          </div>

          {/* Quick Notice board view */}
          <div className="lg:col-span-1 glassmorphism p-6 rounded-2xl border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 font-display">Recent Announcements</h3>
              <Link to="/faculty/notices" className="text-xs text-blue-400 hover:underline">
                Manage
              </Link>
            </div>
            
            <div className="flex-grow space-y-4">
              {recentNotices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                  <Bell className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500">No recent bulletins posted</p>
                </div>
              ) : (
                recentNotices.map((notice) => (
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

export default FacultyDashboard;
