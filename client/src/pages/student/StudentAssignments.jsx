import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { FileText, Download, UploadCloud, CheckCircle2, AlertCircle, Loader, Clock, Award } from 'lucide-react';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Local files for upload state (mapped by assignmentId)
  const [uploadFiles, setUploadFiles] = useState({});

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/student/assignments');
      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve assignments list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleFileChange = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFiles({ ...uploadFiles, [assignmentId]: file });
    }
  };

  const handleUploadSubmit = async (e, assignmentId) => {
    e.preventDefault();
    const fileToUpload = uploadFiles[assignmentId];
    if (!fileToUpload) return alert('Please select a file to upload first.');

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('submissionFile', fileToUpload);

    try {
      const res = await api.post('/student/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess('Assignment submitted successfully!');
        // Clear uploaded file from state
        const updatedFiles = { ...uploadFiles };
        delete updatedFiles[assignmentId];
        setUploadFiles(updatedFiles);
        
        fetchAssignments(); // Refresh assignment status
      }
    } catch (err) {
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Assignments Workspace</h1>
          <p className="text-gray-400 text-sm mt-1">Submit your coursework, download instruction sheets, and track grades</p>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-gray-500 text-sm">
            No assignments published for your semester yet.
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((asn) => {
              const isSubmitted = asn.submission !== null;
              const hasGrades = isSubmitted && asn.submission.marks !== null;

              return (
                <div
                  key={asn._id}
                  className={`p-6 rounded-2xl border ${
                    isSubmitted ? 'border-slate-800/80 bg-slate-900/10' : 'border-indigo-500/20 bg-indigo-500/[0.02]'
                  } flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-700/80 transition-colors`}
                >
                  {/* Left Column: Details */}
                  <div className="flex-grow space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                        {asn.subject?.name}
                      </span>
                      {isSubmitted ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Submitted
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-100 text-base">{asn.title}</h3>
                      <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{asn.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
                      <span>Publisher: {asn.uploadedBy?.name || 'Professor'}</span>
                      <span>•</span>
                      <span>Due Date: {new Date(asn.dueDate).toLocaleDateString()}</span>
                      {asn.file && (
                        <>
                          <span>•</span>
                          <a
                            href={`http://localhost:5000${asn.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Reference Material
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions / Grading info */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-6 lg:pt-0 lg:pl-6">
                    {isSubmitted ? (
                      <div className="space-y-4 text-center lg:text-left">
                        <div className="p-3 bg-slate-900/60 border border-slate-800/50 rounded-xl">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Submissions File</span>
                          <a
                            href={`http://localhost:5000${asn.submission.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-medium mt-1"
                          >
                            <FileText className="w-4 h-4" />
                            View Uploaded Paper
                          </a>
                        </div>

                        <div className="p-3.5 bg-slate-900/60 border border-slate-800/50 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Grades Awarded</span>
                            <span className="text-gray-500 text-xs mt-1 block">
                              {hasGrades ? 'Graded by Lecturer' : 'Pending Review'}
                            </span>
                          </div>
                          {hasGrades ? (
                            <div className="text-right">
                              <span className="text-2xl font-bold text-emerald-400 font-display">{asn.submission.marks}</span>
                              <span className="text-xs text-gray-500 font-medium">/100</span>
                            </div>
                          ) : (
                            <div className="p-2 rounded bg-slate-800/50 text-gray-500">
                              <Award className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleUploadSubmit(e, asn._id)} className="space-y-4">
                        <span className="text-xs font-semibold text-gray-300 block">Submit Assignment</span>
                        
                        <input
                          type="file"
                          required
                          onChange={(e) => handleFileChange(e, asn._id)}
                          className="w-full text-[10px] text-gray-400 file:mr-3 file:py-1.5 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600/10 file:text-blue-400 border border-slate-800/80 rounded p-1 bg-slate-950/60 cursor-pointer"
                        />

                        <button
                          type="submit"
                          disabled={submitLoading || !uploadFiles[asn._id]}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 disabled:opacity-40 disabled:pointer-events-none"
                        >
                          {submitLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              Upload Solution
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
