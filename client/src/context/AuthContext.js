import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          // Handle admin token
          if (token === 'admin-token') {
            setUser({ name: 'Admin', role: 'admin' });
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
          
          // Get user data for regular users
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.log('Authentication error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
          // Don't display error message automatically
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Set token in axios headers and localStorage
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };
  
  // Set base URL for axios
  axios.defaults.baseURL = 'http://localhost:5000';

  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      
      // Log the data being sent for debugging
      console.log('Sending registration data:', formData);
      
      const res = await axios.post('/api/auth/register', formData);
      setToken(res.data.token);
      setUser({ name: res.data.name, role: res.data.role });
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Registration failed');
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed. Please check your information and try again.',
        field: err.response?.data?.field // Pass along the field that caused the error
      };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', formData);
      setToken(res.data.token);
      setUser({ name: res.data.name, role: res.data.role });
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, role: res.data.role };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;