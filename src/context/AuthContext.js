import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      console.log('Initializing authentication...');
      
      const token = localStorage.getItem('accessToken');
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (token) {
        try {
          // Try to get user profile with current token
          const response = await api.get('/users/profile');
          console.log('Profile response:', response.data);
          
          const userData = response.data;
          setUser({
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role
          });
          
          console.log('User authenticated successfully:', userData.email, userData.role);
        } catch (error) {
          console.error('Token validation failed:', error);
          
          // If profile fetch fails, try to refresh token
          try {
            console.log('Trying to refresh token...');
            const refreshResponse = await api.post('/auth/refresh-token');
            
            if (refreshResponse.data.accessToken) {
              localStorage.setItem('accessToken', refreshResponse.data.accessToken);
              
              // Try getting profile again with new token
              const profileResponse = await api.get('/users/profile');
              const userData = profileResponse.data;
              
              setUser({
                id: userData._id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role
              });
              
              console.log('Token refreshed and user authenticated:', userData.email);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear invalid token
            localStorage.removeItem('accessToken');
            setUser(null);
          }
        }
      } else {
        console.log('No token found, user not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setLoading(false);
      console.log('Auth initialization complete');
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Logging in user:', credentials.email);
      
      const response = await authService.login(credentials);
      
      const userData = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      console.log('Login successful:', userData.email, userData.role);
      
      toast.success(`Welcome back, ${userData.firstName}!`);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Registering user:', userData.email);
      
      const response = await authService.register(userData);
      
      const userInfo = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userInfo);
      console.log('Registration successful:', userInfo.email, userInfo.role);
      
      toast.success(`Welcome to ShopEasy, ${userInfo.firstName}!`);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      await authService.logout();
      setUser(null);
      console.log('Logout successful');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  // Don't render children until auth is initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
