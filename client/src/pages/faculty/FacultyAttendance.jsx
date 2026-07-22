import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { ClipboardList, CheckSquare, Save, CheckCircle, AlertCircle, Loader, Calendar } from 'lucide-react';

const FacultyAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // studentId -> 'Present'/'Absent'

  // UI state
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch faculty subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/faculty/subjects');
        if (res.data.success) {
          setSubjects(res.data.subjects);
          if (res.data.subjects.length > 0) {
            setSubjectId(res.data.subjects[0]._id);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch assigned subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch students registered for the selected subject
  const fetchStudents = async () => {
    if (!subjectId) return;
    try {
      setStudentsLoading(true);
      setError('');
      setSuccess('');
      const res = await api.get(`/faculty/subjects/${subjectId}/students`);
      if (res.data.success) {
        setStudents(res.data.students);
        
        // Initialize all student records to 'Present' by default
        const records = {};
        res.data.students.forEach((stud) => {
          records[stud._id] = 'Present';
        });
        setAttendanceRecords(records);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student lists');
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [subjectId]);

  // Handle status toggle for a student
  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords({
      ...attendanceRecords,
      [studentId]: status,
    });
  };

  // Submit attendance records
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId || !date) return alert('Subject and Date are required');

    setActionLoading(true);
    setError('');
    setSuccess('');

    // Format records array: [{ studentId, status }]
    const records = Object.keys(attendanceRecords).map((studentId) => ({
      studentId,
      status: attendanceRecords[studentId],
    }));

    try {
      const res = await api.post('/faculty/attendance', {
        subjectId,
        date,
        records,
      });

      if (res.data.success) {
        setSuccess('Attendance logs saved successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit attendance logs');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Roll Call Workspace</h1>
          <p className="text-gray-400 text-sm mt-1">Select class, specify date, and mark Present/Absent targets</p>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3.5 rounded-xl text-sm max-w-4xl">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3.5 rounded-xl text-sm max-w-4xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm max-w-4xl">
            You are not assigned to any subjects. Ask the Administrator to map a subject to your account.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subject Class</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} (Sem {sub.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Roll Call Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-955 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Students Grid */}
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                Student Attendance Grid
              </h3>

              {studentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No students found registered for this subject's department/semester.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="hidden sm:grid grid-cols-3 text-xs font-semibold text-gray-400 border-b border-slate-850 pb-2 uppercase tracking-wider">
                    <span>Student Name</span>
                    <span>Email Address</span>
                    <span className="text-center">Status (Present / Absent)</span>
                  </div>

                  <div className="divide-y divide-slate-850">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="py-3 flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center gap-2"
                      >
                        <span className="font-semibold text-gray-200 text-sm">{student.name}</span>
                        <span className="text-xs text-gray-400 truncate w-full">{student.email}</span>
                        
                        {/* Radio toggles */}
                        <div className="flex items-center justify-center gap-6 w-full sm:w-auto">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="Present"
                              checked={attendanceRecords[student._id] === 'Present'}
                              onChange={() => handleStatusChange(student._id, 'Present')}
                              className="w-4.5 h-4.5 text-blue-600 border-slate-800 bg-slate-950 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">Present</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="radio"
                              name={`attendance-${student._id}`}
                              value="Absent"
                              checked={attendanceRecords[student._id] === 'Absent'}
                              onChange={() => handleStatusChange(student._id, 'Absent')}
                              className="w-4.5 h-4.5 text-blue-600 border-slate-800 bg-slate-950 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-red-400 font-semibold text-xs uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded">Absent</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Records
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyAttendance;
