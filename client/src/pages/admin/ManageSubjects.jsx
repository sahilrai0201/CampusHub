import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  // Form fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  const [faculty, setFaculty] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSemester, setEditSemester] = useState('1');
  const [editFaculty, setEditFaculty] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch subjects
      const resSubjects = await api.get('/admin/subjects');
      if (resSubjects.data.success) {
        setSubjects(resSubjects.data.subjects);
      }

      // Fetch departments
      const resDepts = await api.get('/auth/departments');
      if (resDepts.data.success) {
        setDepartments(resDepts.data.departments);
        if (resDepts.data.departments.length > 0 && !department) {
          setDepartment(resDepts.data.departments[0]._id);
        }
      }

      // Fetch faculty users
      const resFaculty = await api.get('/admin/faculty');
      if (resFaculty.data.success) {
        setFacultyList(resFaculty.data.faculties);
        if (resFaculty.data.faculties.length > 0 && !faculty) {
          setFaculty(resFaculty.data.faculties[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch requirements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !department || !semester || !faculty) {
      return setError('Please fill all required fields');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/subjects', {
        name,
        department,
        semester,
        faculty,
      });

      if (res.data.success) {
        setSuccess('Subject created successfully!');
        setName('');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create subject');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub._id);
    setEditName(sub.name);
    setEditDepartment(sub.department._id || sub.department);
    setEditSemester(sub.semester);
    setEditFaculty(sub.faculty._id || sub.faculty);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editDepartment || !editSemester || !editFaculty) {
      return setError('All fields are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/admin/subjects/${editingId}`, {
        name: editName,
        department: editDepartment,
        semester: editSemester,
        faculty: editFaculty,
      });

      if (res.data.success) {
        setSuccess('Subject updated successfully!');
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update subject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/admin/subjects/${id}`);
      if (res.data.success) {
        setSuccess('Subject deleted successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete subject');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Subjects Syllabus Registry</h1>
          <p className="text-gray-400 text-sm mt-1">Configure subjects, map semesters, and assign lecturers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Add subject */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Create New Subject</h3>

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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Web Engineering"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>{dep.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s.toString()}>Sem {s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Assigned Faculty</label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Teacher</option>
                      {facultyList.map((fac) => (
                        <option key={fac._id} value={fac._id}>{fac.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Create Subject</>}
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Table */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Registered Subjects</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No subjects created yet. Ensure you have seeded departments and registered faculties first.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-slate-800/85 text-xs text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Subject</th>
                        <th className="pb-3 font-semibold">Department</th>
                        <th className="pb-3 font-semibold">Sem</th>
                        <th className="pb-3 font-semibold">Faculty Assigned</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {subjects.map((sub) => (
                        <tr key={sub._id} className="group hover:bg-slate-900/10 transition-colors">
                          <td className="py-4 font-semibold text-gray-200">
                            {editingId === sub._id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                              />
                            ) : sub.name}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === sub._id ? (
                              <select
                                value={editDepartment}
                                onChange={(e) => setEditDepartment(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                              </select>
                            ) : sub.department?.name || 'Unknown'}
                          </td>
                          <td className="py-4">
                            {editingId === sub._id ? (
                              <select
                                value={editSemester}
                                onChange={(e) => setEditSemester(e.target.value)}
                                className="px-1.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>{s}</option>)}
                              </select>
                            ) : `Sem ${sub.semester}`}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === sub._id ? (
                              <select
                                value={editFaculty}
                                onChange={(e) => setEditFaculty(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {facultyList.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                              </select>
                            ) : sub.faculty?.name || 'Not assigned'}
                          </td>
                          <td className="py-4 text-right">
                            {editingId === sub._id ? (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={handleUpdate}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2.5 py-1 bg-slate-800 text-gray-300 rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(sub)}
                                  className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-slate-800/40"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sub._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-slate-800/40"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageSubjects;
