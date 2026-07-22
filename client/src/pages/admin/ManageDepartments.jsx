import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Plus, Trash2, Edit, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/departments');
      if (res.data.success) {
        setDepartments(res.data.departments);
      }
    } catch (err) {
      setError(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Form Submit (Create)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/departments', { name });
      if (res.data.success) {
        setSuccess('Department created successfully!');
        setName('');
        fetchDepartments();
      }
    } catch (err) {
      setError(err.message || 'Failed to create department');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Initiator
  const startEdit = (dep) => {
    setEditingId(dep._id);
    setEditName(dep.name);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/admin/departments/${editingId}`, { name: editName });
      if (res.data.success) {
        setSuccess('Department updated successfully!');
        setEditingId(null);
        setEditName('');
        fetchDepartments();
      }
    } catch (err) {
      setError(err.message || 'Failed to update department');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.delete(`/admin/departments/${id}`);
      if (res.data.success) {
        setSuccess('Department deleted successfully!');
        fetchDepartments();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete department');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Departments Directory</h1>
          <p className="text-gray-400 text-sm mt-1">Add, update, or remove academic branches of study</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form Card */}
          <div className="lg:col-span-1">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 sticky top-24">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Add New Department</h3>
              
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Department
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* List Card */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6">Registered Departments</h3>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : departments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                  No departments found. Use the panel on the left to add your first department.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {departments.map((dep) => (
                    <div key={dep._id} className="py-4 flex items-center justify-between gap-4">
                      {editingId === dep._id ? (
                        <form onSubmit={handleUpdate} className="flex-1 flex gap-3">
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <span className="font-semibold text-gray-200 text-sm">{dep.name}</span>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => startEdit(dep)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                              title="Edit Department"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dep._id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                              title="Delete Department"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
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

export default ManageDepartments;
