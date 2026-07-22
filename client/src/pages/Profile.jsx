import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import useAuth from '../hooks/useAuth';
import { User, Mail, Shield, Key, Image, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile fields state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [semester, setSemester] = useState(user.semester || '1');
  const [photo, setPhoto] = useState(null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (user.role === 'student') {
        formData.append('semester', semester);
      }
      if (photo) {
        formData.append('profilePhoto', photo);
      }

      await updateProfile(formData);
      setProfileSuccess('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      return setPassError('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return setPassError('Password must be at least 6 characters long');
    }

    setPassLoading(true);
    try {
      const msg = await changePassword(currentPassword, newPassword);
      setPassSuccess(msg || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPassLoading(false);
    } catch (err) {
      setPassError(err.message || 'Failed to change password');
      setPassLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Profile Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account information, profile image, and credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4 group">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-blue-500/40"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-3xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Image className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-100">{user.name}</h3>
              <p className="text-gray-400 text-xs mt-1 uppercase font-semibold tracking-wider">{user.role}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-800/40 text-left space-y-3.5 text-sm text-gray-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-gray-500" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.department && (
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4.5 h-4.5 text-gray-500" />
                    <span>{typeof user.department === 'object' ? user.department.name : 'Registered Department'}</span>
                  </div>
                )}
                {user.semester && (
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4.5 h-4.5 text-gray-500" />
                    <span>Semester {user.semester}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Update details and Password Change forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Update Profile Form */}
            <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2.5">
                <User className="w-5 h-5 text-blue-400" />
                Edit Profile Details
              </h3>

              {profileSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {user.role === 'student' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Semester</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s.toString()}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 file:cursor-pointer cursor-pointer border border-slate-800 rounded-xl p-1 bg-slate-900/60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/10 text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2.5">
                <Key className="w-5 h-5 text-indigo-400" />
                Security Credentials
              </h3>

              {passSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}
              {passError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/10 text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                >
                  {passLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
