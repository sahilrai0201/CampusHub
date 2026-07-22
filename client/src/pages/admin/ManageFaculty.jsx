import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, Loader, Mail, Shield, Key, User } from 'lucide-react';

const ManageFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDepartment, setEditDepartment] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const resFaculty = await api.get('/admin/faculty');
      if (resFaculty.data.success) {
        setFaculties(resFaculty.data.faculties);
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
    if (!name.trim() || !email.trim() || !password || !department) {
      return setError('All fields are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/faculty', {
        name,
        email,
        password,
        department,
      });

      if (res.data.success) {
        setSuccess('Faculty member registered successfully!');
        setName('');
        setEmail('');
        setPassword('');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create faculty profile');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (fac) => {
    setEditingId(fac._id);
    setEditName(fac.name);
    setEditEmail(fac.email);
    setEditDepartment(fac.department?._id || fac.department || '');
    setEditPassword('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editDepartment) {
      return setError('Name, Email, and Department are required');
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const updatePayload = {
      name: editName,
      email: editEmail,
      department: editDepartment,
    };
    if (editPassword) {
      updatePayload.password = editPassword;
    }

    try {
      const res = await api.put(`/admin/faculty/${editingId}`, updatePayload);
      if (res.data.success) {
        setSuccess('Faculty profile updated successfully!');
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update faculty profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/admin/faculty/${id}`);
      if (res.data.success) {
        setSuccess('Faculty member deleted successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete faculty member');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Faculty Logins Console</h1>
          <p className="text-gray-400 text-sm mt-1">Register teachers, update emails, or assign academic departments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Panel */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Register Faculty</h3>

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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Teacher Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Prof. Alan Turing"
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
                      placeholder="turing@school.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Initial Password</label>
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep._id} value={dep._id}>{dep.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Register Faculty</>}
                </button>
              </form>
            </div>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Registered Faculty Directory</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : faculties.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No faculties registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-slate-800/85 text-xs text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Teacher</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Department</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {faculties.map((fac) => (
                        <tr key={fac._id} className="group hover:bg-slate-900/10 transition-colors">
                          <td className="py-4 font-semibold text-gray-200">
                            {editingId === fac._id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                              />
                            ) : fac.name}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === fac._id ? (
                              <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none"
                              />
                            ) : fac.email}
                          </td>
                          <td className="py-4 text-gray-400">
                            {editingId === fac._id ? (
                              <select
                                value={editDepartment}
                                onChange={(e) => setEditDepartment(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm"
                              >
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                              </select>
                            ) : fac.department?.name || 'Unknown'}
                          </td>
                          <td className="py-4 text-right">
                            {editingId === fac._id ? (
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
                                  onClick={() => startEdit(fac)}
                                  className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-slate-800/40"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(fac._id)}
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

export default ManageFaculty;
