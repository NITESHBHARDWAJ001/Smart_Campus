import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import mockAPI from '../services/mockApi';
import API from '../utils/serverConfig';

const AdminContext = createContext();

// Initial state
const initialState = {
  users: [],
  user: null,
  adminPlacements: [],
  stats: {
    users: { total: 0, students: 0, teachers: 0, admins: 0 },
    placements: { total: 0, active: 0, inactive: 0 },
    applications: { total: 0, pending: 0, selected: 0 }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  loading: false,
  error: null
};

// Reducer function
const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_USERS':
      return {
        ...state,
        users: action.payload.data || action.payload,
        pagination: {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || (action.payload.data || action.payload).length
        },
        loading: false,
        error: null
      };
    case 'GET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload),
        loading: false,
        error: null
      };
    case 'GET_ADMIN_PLACEMENTS':
      return {
        ...state,
        adminPlacements: action.payload.data || action.payload,
        pagination: {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || (action.payload.data || action.payload).length
        },
        loading: false,
        error: null
      };
    case 'GET_STATS':
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    case 'ADMIN_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
// Fix undefined issue in children render
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { token } = useContext(AuthContext);

  // Set axios default headers
  const setAdminToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get all users with filters and pagination
  const getUsers = async (page = 1, limit = 10, filters = {}) => {
    setAdminToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Create query string from filters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      }).toString();
      
      console.log('Fetching users from:', `${API.admin.users}?${queryParams}`);
      const res = await axios.get(`${API.admin.users}?${queryParams}`);
      console.log('Users API response:', res.data);
      
      if (!res.data) {
        throw new Error('No data returned from users API');
      }
      
      // Handle different response formats
      const formattedData = {
        data: Array.isArray(res.data) ? res.data : (res.data.data || []),
        currentPage: res.data.currentPage || page,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || (Array.isArray(res.data) ? res.data.length : 0)
      };
      
      console.log('Formatted user data:', formattedData);
      
      dispatch({
        type: 'GET_USERS',
        payload: formattedData
      });
      return formattedData;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ADMIN_ERROR',
        payload: error.response?.data?.message || 'Error fetching users'
      });
      return null;
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    setAdminToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.getUserById(userId);
      } else {
        res = await axios.get(`http://localhost:5000/api/admin/users/${userId}`);
      }
      
      dispatch({
        type: 'GET_USER',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ADMIN_ERROR',
        payload: error.response?.data?.message || 'Error fetching user'
      });
      return null;
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    setAdminToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      if (process.env.NODE_ENV === 'development') {
        await mockAPI.deleteUser(userId);
      } else {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      }
      
      dispatch({
        type: 'DELETE_USER',
        payload: userId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ADMIN_ERROR',
        payload: error.response?.data?.message || 'Error deleting user'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error deleting user' 
      };
    }
  };

  // Get all placements with application counts
  const getAdminPlacements = async (page = 1, limit = 10, filters = {}) => {
    setAdminToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Create query string from filters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      }).toString();
      
      console.log('Fetching admin placements from:', `${API.admin.placements}?${queryParams}`);
      const res = await axios.get(`${API.admin.placements}?${queryParams}`);
      console.log('Admin placements response:', res.data);
      
      if (!res.data) {
        throw new Error('No data returned from placements API');
      }
      
      // Handle different response formats
      const formattedData = {
        data: Array.isArray(res.data) ? res.data : (res.data.data || []),
        currentPage: res.data.currentPage || page,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || (Array.isArray(res.data) ? res.data.length : 0)
      };
      
      console.log('Formatted placement data:', formattedData);
      
      dispatch({
        type: 'GET_ADMIN_PLACEMENTS',
        payload: formattedData
      });
      return formattedData;
    } catch (error) {
      console.error('Error fetching placements:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ADMIN_ERROR',
        payload: error.response?.data?.message || 'Error fetching placements'
      });
      return null;
    }
  };

  // Get dashboard statistics
  const getStats = async () => {
    setAdminToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      console.log('Fetching admin stats from:', API.admin.stats);
      const res = await axios.get(API.admin.stats);
      console.log('Admin stats response:', res.data);
      
      // Handle different possible response formats
      const statsData = res.data.data || res.data;
      
      // Ensure stats has the expected structure
      const formattedStats = {
        users: statsData.users || {
          total: 0,
          students: 0,
          teachers: 0,
          admins: 0
        },
        placements: statsData.placements || {
          total: 0,
          active: 0,
          inactive: 0
        },
        applications: statsData.applications || {
          total: 0,
          pending: 0,
          selected: 0
        }
      };
      
      console.log('Formatted stats:', formattedStats);
      
      dispatch({
        type: 'GET_STATS',
        payload: formattedStats
      });
      return formattedStats;
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ADMIN_ERROR',
        payload: error.response?.data?.message || 'Error fetching stats'
      });
      return null;
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AdminContext.Provider
      value={{
        users: state.users,
        user: state.user,
        adminPlacements: state.adminPlacements,
        stats: state.stats,
        pagination: state.pagination,
        loading: state.loading,
        error: state.error,
        getUsers,
        getUserById,
        deleteUser,
        getAdminPlacements,
        getStats,
        clearError
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;