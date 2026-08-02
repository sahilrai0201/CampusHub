import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { BookOpen, School, Clock, ClipboardList, FileText, CheckSquare, Loader, AlertCircle } from 'lucide-react';

const FacultySubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch subjects assigned to the logged-in lecturer
  const fetchMySubjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("Fetching subjects for faculty member:", user?.name);
      
      const res = await api.get('/faculty/subjects');
      console.log("Subjects response data:", res.data);

      if (res.data.success) {
        setSubjects(res.data.subjects);
      } else {
        setError('Failed to fetch subjects list');
      }
    } catch (err) {
      console.error("Error inside fetchMySubjects:", err);
      setError(err.message || 'Something went wrong while retrieving subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubjects();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* Page title and sub */}
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">My Assigned Subjects</h1>
          <p className="text-gray-400 text-sm mt-1">
            View the syllabus courses you are teaching this term, manage class attendance, and upload study PDFs.
          </p>
        </div>

        {/* Errors section if something fails */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content list */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-400 text-sm">Loading course data...</span>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-gray-500 text-sm">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p>You have not been assigned to teach any subjects yet.</p>
            <p className="text-xs text-gray-600 mt-1">Please contact the System Admin to allocate your classes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div 
                key={subject._id} 
                className="glassmorphism rounded-2xl border border-slate-850 overflow-hidden flex flex-col hover:border-blue-500/40 transition-all duration-200 shadow-lg"
              >
                {/* Header card area */}
                <div className="p-6 bg-slate-900/30 border-b border-slate-850/50 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-600/10 text-blue-400 rounded-xl">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Active Course
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-white leading-snug">
                    {subject.name}
                  </h3>

                  {/* Course meta details */}
                  <div className="mt-4 space-y-2.5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-gray-500" />
                      <span>{subject.department?.name || 'Department'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Semester {subject.semester}</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions strip */}
                <div className="p-4 bg-slate-950/40 border-t border-slate-850/50 grid grid-cols-3 gap-1">
                  <Link 
                    to="/faculty/attendance" 
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-800/40 text-gray-400 hover:text-white transition-colors"
                    title="Mark attendance log"
                  >
                    <ClipboardList className="w-4 h-4 mb-1 text-blue-400" />
                    <span className="text-[10px] font-semibold">Attendance</span>
                  </Link>

                  <Link 
                    to="/faculty/notes" 
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-800/40 text-gray-400 hover:text-white transition-colors"
                    title="Upload reading files"
                  >
                    <FileText className="w-4 h-4 mb-1 text-purple-400" />
                    <span className="text-[10px] font-semibold">Syllabus Notes</span>
                  </Link>

                  <Link 
                    to="/faculty/assignments" 
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-800/40 text-gray-400 hover:text-white transition-colors"
                    title="Publish homework solutions"
                  >
                    <CheckSquare className="w-4 h-4 mb-1 text-emerald-400" />
                    <span className="text-[10px] font-semibold">Homework</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultySubjects;
