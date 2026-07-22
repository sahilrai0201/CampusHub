import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { FileText, Download, Search, AlertCircle, Loader } from 'lucide-react';

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/student/notes');
        if (res.data.success) {
          setNotes(res.data.notes);
          
          // Extract unique subjects from notes list
          const uniqueSubjects = [];
          const subjectIds = new Set();
          
          res.data.notes.forEach(note => {
            if (note.subject && !subjectIds.has(note.subject._id)) {
              subjectIds.add(note.subject._id);
              uniqueSubjects.push(note.subject);
            }
          });
          
          setSubjectsList(uniqueSubjects);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve notes list');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on search query and subject
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subject?.name && note.subject.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesSubject = selectedSubject === '' || (note.subject?._id === selectedSubject);
    
    return matchesSearch && matchesSubject;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Study Materials Repository</h1>
          <p className="text-gray-400 text-sm mt-1">Search, filter, and download lecture notes shared by professors</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/20 p-4 rounded-2xl border border-slate-800/80">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by note title or subject..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-955 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              {subjectsList.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List of notes */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-gray-500 text-sm">
            No study materials matching your filter/search criteria found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="dashboard-card glassmorphism p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600/25 transition-colors">
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-200 text-sm truncate" title={note.title}>
                      {note.title}
                    </h4>
                    <span className="text-[11px] text-blue-400 font-semibold block mt-1">
                      {note.subject?.name}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Uploaded by: {note.uploadedBy?.name || 'Professor'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/40">
                  <span className="text-[10px] text-gray-500">
                    Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  
                  <a
                    href={`http://localhost:5000${note.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotes;
