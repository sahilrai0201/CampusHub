import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Loader, Mail, Shield, Key, User, Calendar } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSemester, setEditSemester] = useState('1');

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const resStudents = await api.get('/admin/students');
      if (resStudents.data.success) {
        setStudents(resStudents.data.students);
      }

      const resDepts = await api.get('/auth/departments');
      if (resDepts.data.success) {
        setDepartments(resDepts.data.departments);
        if (resDepts.data.departments.length > 0 && !department) {
          setDepartment(resDepts.data.departments[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !department || !semester) {
      return setError('All fields are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/students', {
        name,
        email,
        password,
        department,
        semester,
      });

      if (res.data.success) {
        setSuccess('Student registered successfully!');
        setName('');
        setEmail('');
        setPassword('');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create student profile');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (stud) => {
    setEditingId(stud._id);
    setEditName(stud.name);
    setEditEmail(stud.email);
    setEditDepartment(stud.department?._id || stud.department || '');
    setEditSemester(stud.semester || '1');
    setEditPassword('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editDepartment || !editSemester) {
      return setError('Name, Email, Department, and Semester are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const updatePayload = {
      name: editName,
      email: editEmail,
      department: editDepartment,
      semester: editSemester,
    };
    if (editPassword) {
      updatePayload.password = editPassword;
    }

    try {
      const res = await api.put(`/admin/students/${editingId}`, updatePayload);
      if (res.data.success) {
        setSuccess('Student profile updated successfully!');
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update student profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/admin/students/${id}`);
      if (res.data.success) {
        setSuccess('Student deleted successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Students Directory Console</h1>
          <p className="text-gray-400 text-sm mt-1">Enroll pupils, manage semester promotions, or change branches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Panel */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Enroll Student</h3>

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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Student Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Grace Hopper"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="grace@school.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Semester</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s.toString()}>Sem {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                          <option key={dep._id} value={dep._id}>{dep.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Enroll Student</>}
                </button>
              </form>
            </div>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Enrolled Students Directory</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No students registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-slate-800/85 text-xs text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Student</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Department</th>
                        <th className="pb-3 font-semibold">Semester</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {students.map((stud) => (
                        <tr key={stud._id} className="group hover:bg-slate-900/10 transition-colors">
                          <td className="py-4 font-semibold text-gray-200">
                            {editingId === stud._id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                              />
                            ) : stud.name}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === stud._id ? (
                              <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                              />
                            ) : stud.email}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === stud._id ? (
                              <select
                                value={editDepartment}
                                onChange={(e) => setEditDepartment(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                              </select>
                            ) : stud.department?.name || 'Unknown'}
                          </td>
                          <td className="py-4">
                            {editingId === stud._id ? (
                              <select
                                value={editSemester}
                                onChange={(e) => setEditSemester(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
                              </select>
                            ) : `Sem ${stud.semester}`}
                          </td>
                          <td className="py-4 text-right">
                            {editingId === stud._id ? (
                              <div className="flex flex-col gap-1.5 justify-end">
                                <input
                                  type="password"
                                  placeholder="New Password (optional)"
                                  value={editPassword}
                                  onChange={(e) => setEditPassword(e.target.value)}
                                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs mb-1.5 focus:outline-none"
                                />
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
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(stud)}
                                  className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-slate-800/40"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(stud._id)}
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

export default ManageStudents;
