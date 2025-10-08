import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://redis-backend-seyz.onrender.com/api' // Replace with your Railway URL
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.config?.url, error.response?.status);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Attempting token refresh...');

      try {
        // Try to refresh token
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        console.log('Token refreshed successfully');
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Show error toast for non-auth errors
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
