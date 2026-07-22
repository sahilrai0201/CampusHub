import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Trash2, Calendar, FileText, CheckCircle, AlertCircle, Loader, Download, Eye, Award } from 'lucide-react';

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedAsn, setSelectedAsn] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);

  // Marks grading fields
  const [gradingMarks, setGradingMarks] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const resSubs = await api.get('/faculty/subjects');
      if (resSubs.data.success) {
        setSubjects(resSubs.data.subjects);
        if (resSubs.data.subjects.length > 0 && !subjectId) {
          setSubjectId(resSubs.data.subjects[0]._id);
        }
      }

      const resAsns = await api.get('/faculty/assignments');
      if (resAsns.data.success) {
        setAssignments(resAsns.data.assignments);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !subjectId || !dueDate) {
      return setError('Please fill all required fields');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subjectId', subjectId);
    formData.append('dueDate', dueDate);
    if (file) {
      formData.append('assignmentFile', file);
    }

    try {
      const res = await api.post('/faculty/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess('Assignment published successfully!');
        setTitle('');
        setDescription('');
        setFile(null);
        setDueDate('');
        if (document.getElementById('asnFileInput')) {
          document.getElementById('asnFileInput').value = '';
        }
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/faculty/assignments/${id}`);
      if (res.data.success) {
        setSuccess('Assignment deleted successfully!');
        if (selectedAsn?._id === id) {
          setSelectedAsn(null);
          setSubmissions([]);
        }
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete assignment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewSubmissions = async (asn) => {
    setSelectedAsn(asn);
    setSubmissions([]);
    setLoadingSubmissions(true);
    setError('');
    
    try {
      const res = await api.get(`/faculty/assignments/${asn._id}/submissions`);
      if (res.data.success) {
        setSubmissions(res.data.submissions);
        // Initialize grading marks state
        const marksObj = {};
        res.data.submissions.forEach(sub => {
          marksObj[sub._id] = sub.marks !== null ? sub.marks : '';
        });
        setGradingMarks(marksObj);
      }
    } catch (err) {
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Grade submission marks (Wait, we can hit PUT /api/faculty/submissions/:id/grade)
  // Let's make sure we implement this backend endpoint inside facultyController.js later or now.
  // Wait, let's look at the backend controller. We didn't define a grading endpoint in facultyRoutes or controller yet!
  // Let's add it dynamically next or write the frontend grading code, and make sure we add it to backend.
  // Yes! The backend controller needs a PUT /api/faculty/submissions/:id/grade or equivalent.
  // Let's design and code the grading handler in backend next, but let's complete the frontend layout first.
  const handleGrade = async (submissionId) => {
    const marksValue = gradingMarks[submissionId];
    if (marksValue === '') return alert('Please enter a marks value');
    const marksNum = parseInt(marksValue);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      return alert('Marks must be a number between 0 and 100');
    }

    try {
      // Let's use PUT /api/faculty/submissions/:id
      const res = await api.put(`/faculty/submissions/${submissionId}`, { marks: marksNum });
      if (res.data.success) {
        alert('Grade saved successfully!');
        handleViewSubmissions(selectedAsn); // Refresh list
      }
    } catch (err) {
      alert(err.message || 'Failed to submit grade');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Assignments & Evaluation</h1>
          <p className="text-gray-400 text-sm mt-1">Publish student tasks, download papers, and grade submissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Assignment Form */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Create Assignment</h3>

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
                  You are not assigned to any subjects. Ask the Administrator to assign a subject to you.
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Project 1: Portfolio Web Design"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Instructions</label>
                    <textarea
                      rows="3"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter assignment directions..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                      <select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      >
                        {subjects.map((sub) => (
                          <option key={sub._id} value={sub._id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Due Date</label>
                      <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Attachment (Optional)</label>
                    <input
                      type="file"
                      id="asnFileInput"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 border border-slate-800 rounded-xl p-1 bg-slate-900/60 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Publish Task</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Published Tasks</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No assignments published yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {assignments.map((asn) => (
                    <div
                      key={asn._id}
                      className="p-5 rounded-2xl border border-slate-800 bg-slate-900/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-500/25 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-gray-200 text-sm">{asn.title}</h4>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">{asn.description}</p>
                        <span className="text-[11px] text-gray-400 block mt-2">
                          Subject: <span className="text-blue-400">{asn.subject?.name}</span> • Due: {new Date(asn.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleViewSubmissions(asn)}
                          className="px-3.5 py-2 bg-indigo-600/10 hover:bg-indigo-600/25 text-indigo-400 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Submissions
                        </button>
                        <button
                          onClick={() => handleDelete(asn._id)}
                          className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submissions Section */}
            {selectedAsn && (
              <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
                  <div>
                    <h3 className="text-base font-bold text-gray-200">
                      Submissions for: <span className="text-indigo-400">{selectedAsn.title}</span>
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">Enter scores and download submitted homework papers</p>
                  </div>
                  <button onClick={() => setSelectedAsn(null)} className="text-xs text-gray-400 hover:underline">
                    Close Panel
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-gray-500 text-xs">
                    No submissions uploaded by students for this task yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/40">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="overflow-hidden">
                          <span className="font-semibold text-gray-200 text-sm block truncate">{sub.student?.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {sub.student?.email} • Submitted: {new Date(sub.submittedAt).toLocaleString()}
                          </span>
                          <a
                            href={`http://localhost:5000${sub.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download student's paper
                          </a>
                        </div>

                        {/* Grading Form */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="relative w-20">
                            <Award className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={gradingMarks[sub._id] !== undefined ? gradingMarks[sub._id] : ''}
                              onChange={(e) =>
                                setGradingMarks({ ...gradingMarks, [sub._id]: e.target.value })
                              }
                              placeholder="Marks"
                              className="w-full pl-8 pr-2 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-gray-100 focus:outline-none"
                            />
                          </div>
                          <button
                            onClick={() => handleGrade(sub._id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Grade
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
