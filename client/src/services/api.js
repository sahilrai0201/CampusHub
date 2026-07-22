const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campushub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    
    // Log user out if token is expired or invalid
    if (error.response?.status === 401 && localStorage.getItem('campushub_token')) {
      localStorage.removeItem('campushub_token');
      localStorage.removeItem('campushub_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
