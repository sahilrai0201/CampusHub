import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user session already exists in localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('campushub_token');
      const savedUser = localStorage.getItem('campushub_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          
          // Verify session status with backend
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('campushub_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session validation failed:', err.message);
          // Handled by response interceptor mostly, but clear state to be safe
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem('campushub_token', token);
        localStorage.setItem('campushub_user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (name, email, password, role, department, semester) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        department,
        semester,
      });
      if (res.data.success) {
        const { token, user: registeredUser } = res.data;
        localStorage.setItem('campushub_token', token);
        localStorage.setItem('campushub_user', JSON.stringify(registeredUser));
        setUser(registeredUser);
        setLoading(false);
        return registeredUser;
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('campushub_token');
    localStorage.removeItem('campushub_user');
    setUser(null);
    setError(null);
  };

  // Update profile handler
  const updateProfile = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const isMultipart = formData instanceof FormData;
      const res = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        },
      });
      if (res.data.success) {
        const updatedUser = res.data.user;
        localStorage.setItem('campushub_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setLoading(false);
        return updatedUser;
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Profile update failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Change password handler
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setLoading(false);
      return res.data.message;
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Change password failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
