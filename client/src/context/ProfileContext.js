import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const ProfileContext = createContext();

// Initial state
const initialState = {
  profile: null,
  loading: false,
  error: null
};

// Reducer function
const profileReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        error: null
      };
    case 'PROFILE_ERROR':
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
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setProfileToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get user profile
  const getProfile = async () => {
    setProfileToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('http://localhost:5000/api/profile');
      dispatch({
        type: 'GET_PROFILE',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PROFILE_ERROR',
        payload: error.response?.data?.message || 'Error fetching profile'
      });
      return null;
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    setProfileToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put('http://localhost:5000/api/profile', profileData);
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: res.data.data
      });
      return { success: true, profile: res.data.data };
    } catch (error) {
      console.error('Error updating profile:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PROFILE_ERROR',
        payload: error.response?.data?.message || 'Error updating profile'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating profile' 
      };
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <ProfileContext.Provider
      value={{
        profile: state.profile,
        loading: state.loading,
        error: state.error,
        getProfile,
        updateProfile,
        clearError
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;