import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Trash2, FileText, CheckCircle, AlertCircle, Loader, Download } from 'lucide-react';

const FacultyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [file, setFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get faculty's assigned subjects
      const resSubs = await api.get('/faculty/subjects');
      if (resSubs.data.success) {
        setSubjects(resSubs.data.subjects);
        if (resSubs.data.subjects.length > 0 && !subjectId) {
          setSubjectId(resSubs.data.subjects[0]._id);
        }
      }

      // Get uploaded notes
      const resNotes = await api.get('/faculty/notes');
      if (resNotes.data.success) {
        setNotes(resNotes.data.notes);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notes or subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !file) {
      return setError('Please fill all fields and choose a PDF file');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subjectId', subjectId);
    formData.append('noteFile', file);

    try {
      const res = await api.post('/faculty/notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess('Notes uploaded successfully!');
        setTitle('');
        setFile(null);
        // Reset file input element manually
        document.getElementById('noteFileInput').value = '';
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload study notes');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete these notes?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/faculty/notes/${id}`);
      if (res.data.success) {
        setSuccess('Notes deleted successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete notes');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Study Materials Repository</h1>
          <p className="text-gray-400 text-sm mt-1">Upload lecture notes, documents, and reference PDFs for students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Upload Notes PDF</h3>

              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {subjects.length === 0 ? (
                <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl leading-relaxed">
                  You are not assigned to any subjects. Please contact the administrator to assign subjects to your account before uploading notes.
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Notes Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Lecture 1: HTML & CSS basics"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subject Mapping</label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {subjects.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name} (Sem {sub.semester})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Choose File (PDF/Docs)</label>
                    <input
                      type="file"
                      id="noteFileInput"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 border border-slate-800 rounded-xl p-1 bg-slate-900/60 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><FileText className="w-4 h-4" /> Upload Material</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* List display */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Uploaded Notes Logs</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  You haven't uploaded any study materials yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-5 rounded-2xl border border-slate-800 bg-slate-900/25 flex flex-col justify-between gap-4 group hover:border-blue-500/20 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-gray-200 text-sm truncate" title={note.title}>
                            {note.title}
                          </h4>
                          <span className="text-[11px] text-gray-400 block mt-1">
                            {note.subject?.name} • Sem {note.semester}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 border-t border-slate-800/60 pt-3">
                        <span className="text-[10px] text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex gap-2">
                          <a
                            href={`http://localhost:5000${note.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Download Notes"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyNotes;
