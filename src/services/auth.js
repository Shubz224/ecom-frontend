import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      console.log('Access token stored after registration');
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      console.log('Access token stored after login');
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      console.log('Access token removed');
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // Decode JWT to get user info (simple decode, not verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        return payload;
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('accessToken');
        return null;
      }
    }
    return null;
  }
};
