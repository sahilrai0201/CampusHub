import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Loader, Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const FacultyNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      // Faculty notice list
      const res = await api.get('/faculty/notices');
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return setError('Title and description are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/faculty/notices', {
        title,
        description,
      });

      if (res.data.success) {
        setSuccess('Notice published successfully!');
        setTitle('');
        setDescription('');
        fetchNotices();
      }
    } catch (err) {
      setError(err.message || 'Failed to create notice');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (notice) => {
    setEditingId(notice._id);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      return setError('Title and description are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/faculty/notices/${editingId}`, {
        title: editTitle,
        description: editDescription,
      });

      if (res.data.success) {
        setSuccess('Notice updated successfully!');
        setEditingId(null);
        fetchNotices();
      }
    } catch (err) {
      setError(err.message || 'Failed to update notice');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/faculty/notices/${id}`);
      if (res.data.success) {
        setSuccess('Notice deleted successfully!');
        fetchNotices();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete notice');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Academic notice Board</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast class messages and announcements for your students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Notice Panel */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Create Announcement</h3>

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

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tomorrow's Lab Session Location change"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Bulletin Description</label>
                  <textarea
                    rows="4"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter notice details..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Publish Notice</>}
                </button>
              </form>
            </div>
          </div>

          {/* Notices log */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                Live Bulletins
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : notices.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No notices published yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((not) => {
                    const isCreator = not.createdBy?._id === user._id || not.createdBy === user._id;

                    return (
                      <div
                        key={not._id}
                        className="p-5 rounded-2xl border border-slate-850 bg-slate-900/10 flex flex-col gap-4 hover:border-slate-700 transition-colors"
                      >
                        {editingId === not._id ? (
                          <form onSubmit={handleUpdate} className="space-y-3.5 w-full">
                            <input
                              type="text"
                              required
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                            />
                            <textarea
                              rows="3"
                              required
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl bg-slate-955 border border-slate-800 text-sm focus:outline-none resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="submit"
                                disabled={actionLoading}
                                className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-4.5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-gray-200 text-sm">{not.title}</h4>
                                <span className="text-[10px] text-gray-500 mt-1 block">
                                  Posted by: <span className="text-blue-400 font-semibold">{not.createdBy?.name || 'Professor'}</span>
                                </span>
                              </div>
                              
                              {/* Edit/Delete control (Creator checks) */}
                              {isCreator && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(not)}
                                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                    title="Edit notice"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(not._id)}
                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                    title="Delete notice"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed">
                              {not.description}
                            </p>

                            <div className="border-t border-slate-900/60 pt-3 flex justify-between text-[10px] text-gray-500">
                              <span>Published: {new Date(not.createdAt).toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyNotices;
