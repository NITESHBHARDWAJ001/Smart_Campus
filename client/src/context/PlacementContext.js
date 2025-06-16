import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import mockAPI from '../services/mockApi';
import API from '../utils/serverConfig';

const PlacementContext = createContext();

// Initial state
const initialState = {
  placements: [],
  singlePlacement: null,
  applications: [],
  singleApplication: null,
  loading: false,
  error: null
};

// Reducer function
const placementReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_PLACEMENTS':
      return {
        ...state,
        placements: action.payload,
        loading: false,
        error: null
      };
    case 'GET_PLACEMENT':
      return {
        ...state,
        singlePlacement: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_PLACEMENT':
      console.log('Creating placement in reducer:', action.payload);
      return {
        ...state,
        placements: [action.payload, ...state.placements],
        loading: false,
        error: null
      };
    case 'UPDATE_PLACEMENT':
      return {
        ...state,
        placements: state.placements.map(placement =>
          placement._id === action.payload._id ? action.payload : placement
        ),
        singlePlacement: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_PLACEMENT':
      return {
        ...state,
        placements: state.placements.filter(placement => placement._id !== action.payload),
        loading: false,
        error: null
      };
    case 'TOGGLE_ACTIVE':
      return {
        ...state,
        placements: state.placements.map(placement =>
          placement._id === action.payload._id 
            ? { ...placement, active: action.payload.active } 
            : placement
        ),
        singlePlacement: state.singlePlacement?._id === action.payload._id
          ? { ...state.singlePlacement, active: action.payload.active }
          : state.singlePlacement,
        loading: false,
        error: null
      };
    case 'GET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
        loading: false,
        error: null
      };
    case 'GET_APPLICATION':
      return {
        ...state,
        singleApplication: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_APPLICATION':
      return {
        ...state,
        applications: [action.payload, ...state.applications],
        loading: false,
        error: null
      };
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...state,
        applications: state.applications.map(application =>
          application._id === action.payload._id 
            ? { ...application, status: action.payload.status } 
            : application
        ),
        singleApplication: state.singleApplication?._id === action.payload._id
          ? { ...state.singleApplication, status: action.payload.status }
          : state.singleApplication,
        loading: false,
        error: null
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(application => application._id !== action.payload),
        loading: false,
        error: null
      };
    case 'PLACEMENT_ERROR':
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
export const PlacementProvider = ({ children }) => {
  const [state, dispatch] = useReducer(placementReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setPlacementToken = () => {
    // Get the latest token from localStorage in case it changed
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedToken !== token) {
      console.log('Found updated token in localStorage');
      // We can't update the context token directly here
      // We'll just use the stored token for the current request
    }
    
    // Use the most up-to-date token (either from context or localStorage)
    const currentToken = storedToken || token;
    
    if (currentToken) {
      console.log('Setting auth token for placement request:', currentToken.substring(0, 10) + '...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    } else {
      // Try to use hardcoded token for development
      if (process.env.NODE_ENV === 'development') {
        // For development - use a hardcoded token
        const devToken = 'devtoken123456';
        console.log('DEVELOPMENT MODE: Using default dev token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
      } else {
        console.warn('No auth token available for placement request');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  };

  // Get all placements
  const getPlacements = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Get token from localStorage for the most up-to-date value
      const currentToken = localStorage.getItem('token') || token || 'devtoken123456';
      
      // Update axios default headers first
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      
      // Make sure we have the latest token
      setPlacementToken();
      
      // Create a config object with authorization header
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      };
      
      console.log('Fetching placements from:', API.placements.base);
      
      // Try the API call with direct token in header
      const res = await axios.get(API.placements.base, config);
      console.log('Get placements response:', res.data);
      
      // Handle different response formats
      let placementsData;
      
      if (res.data && res.data.data) {
        // Server returned {success: true, data: [...]} format
        placementsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        // Server returned direct array format
        placementsData = res.data;
      } else {
        // Unknown format - use empty array as fallback
        console.warn('Unexpected response format from placements API:', res.data);
        placementsData = [];
      }
      
      dispatch({
        type: 'GET_PLACEMENTS',
        payload: placementsData
      });
      return placementsData;
    } catch (error) {
      // Force refresh token if unauthorized
      if (error.response && error.response.status === 401) {
        console.error('Token expired or invalid - please login again');
      }
      
      console.error('Error fetching placements:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching placements'
      });
      return [];
    }
  };

  // Get single placement
  const getPlacement = async (placementId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.getPlacement(placementId);
      } else {
        res = await axios.get(`http://localhost:5000/api/placements/${placementId}`);
      }
      
      dispatch({
        type: 'GET_PLACEMENT',
        payload: res.data
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching placement:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching placement'
      });
      return null;
    }
  };

  // Create placement (Admin only)
  const createPlacement = async (placementData) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      console.log('Creating placement with data:', placementData);
      console.log('Posting to:', API.placements.base);
      
      // Create the placement with explicit headers
      const dataToSend = {
        ...placementData
        // We don't need createdBy - server will handle this
      };
      
      // Set up specific axios config for this request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Using auth token:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      // Always use the real API for creating placements
      const res = await axios.post(API.placements.base, dataToSend, config);
      console.log('Create placement response:', res.data);
      
      // Extract the placement data from the response
      const placementResult = res.data.data || res.data;
      
      dispatch({
        type: 'CREATE_PLACEMENT',
        payload: placementResult
      });
      return { success: true, placement: placementResult };
    } catch (error) {
      console.error('Error creating placement:', error);
      console.error('Error details:', error.response?.data?.message || error.message);
      
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error creating placement'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creating placement' 
      };
    }
  };

  // Update placement (Admin only)
  const updatePlacement = async (placementId, placementData) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.updatePlacement(placementId, placementData);
      } else {
        res = await axios.put(`http://localhost:5000/api/placements/${placementId}`, placementData);
      }
      
      dispatch({
        type: 'UPDATE_PLACEMENT',
        payload: res.data
      });
      return { success: true, placement: res.data };
    } catch (error) {
      console.error('Error updating placement:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error updating placement'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating placement' 
      };
    }
  };

  // Delete placement (Admin only)
  const deletePlacement = async (placementId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      if (process.env.NODE_ENV === 'development') {
        await mockAPI.deletePlacement(placementId);
      } else {
        await axios.delete(`http://localhost:5000/api/placements/${placementId}`);
      }
      
      dispatch({
        type: 'DELETE_PLACEMENT',
        payload: placementId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting placement:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error deleting placement'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error deleting placement' 
      };
    }
  };

  // Toggle placement active status (Admin only)
  const togglePlacementActive = async (placementId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.togglePlacementActive(placementId);
      } else {
        res = await axios.put(`http://localhost:5000/api/placements/${placementId}/toggle-active`);
      }
      
      dispatch({
        type: 'TOGGLE_ACTIVE',
        payload: res.data
      });
      return { success: true, placement: res.data };
    } catch (error) {
      console.error('Error toggling placement status:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error toggling placement status'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error toggling placement status' 
      };
    }
  };

  // Get applications for a placement (Admin only)
  const getPlacementApplications = async (placementId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.getPlacementApplications(placementId);
      } else {
        res = await axios.get(`http://localhost:5000/api/placements/${placementId}/applications`);
      }
      
      dispatch({
        type: 'GET_APPLICATIONS',
        payload: res.data
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching applications:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching applications'
      });
      return [];
    }
  };

  // Get student's applications (Student only)
  const getMyApplications = async () => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.getMyApplications();
      } else {
        res = await axios.get('http://localhost:5000/api/applications/my-applications');
      }
      
      dispatch({
        type: 'GET_APPLICATIONS',
        payload: res.data
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching applications:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching applications'
      });
      return [];
    }
  };

  // Apply for a placement (Student only)
  const applyForPlacement = async (applicationData) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.applyForPlacement(applicationData);
      } else {
        res = await axios.post('http://localhost:5000/api/applications', applicationData);
      }
      
      dispatch({
        type: 'CREATE_APPLICATION',
        payload: res.data
      });
      return { success: true, application: res.data };
    } catch (error) {
      console.error('Error applying for placement:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error applying for placement'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error applying for placement' 
      };
    }
  };

  // Update application status (Admin only)
  const updateApplicationStatus = async (applicationId, status) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      if (process.env.NODE_ENV === 'development') {
        res = await mockAPI.updateApplicationStatus(applicationId, { status });
      } else {
        res = await axios.put(`http://localhost:5000/api/applications/${applicationId}/status`, { status });
      }
      
      dispatch({
        type: 'UPDATE_APPLICATION_STATUS',
        payload: res.data
      });
      return { success: true, application: res.data };
    } catch (error) {
      console.error('Error updating application status:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error updating application status'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating application status' 
      };
    }
  };

  // Get application details
  const getApplication = async (applicationId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let res;
      // Mock API call for getApplication is not implemented in this example
      // Would need to be added to mockApi.js for development mode
      res = await axios.get(`http://localhost:5000/api/applications/${applicationId}`);
      
      dispatch({
        type: 'GET_APPLICATION',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching application:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching application'
      });
      return null;
    }
  };

  // Delete/withdraw application
  const deleteApplication = async (applicationId) => {
    setPlacementToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      
      if (process.env.NODE_ENV === 'development') {
        await mockAPI.deleteApplication(applicationId);
      } else {
        await axios.delete(`http://localhost:5000/api/applications/${applicationId}`);
      }
      
      dispatch({
        type: 'DELETE_APPLICATION',
        payload: applicationId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error.response?.data?.message || error.message);
      dispatch({
        type: 'PLACEMENT_ERROR',
        payload: error.response?.data?.message || 'Error deleting application'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error deleting application' 
      };
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <PlacementContext.Provider
      value={{
        placements: state.placements,
        singlePlacement: state.singlePlacement,
        applications: state.applications,
        singleApplication: state.singleApplication,
        loading: state.loading,
        error: state.error,
        getPlacements,
        getPlacement,
        createPlacement,
        updatePlacement,
        deletePlacement,
        togglePlacementActive,
        getPlacementApplications,
        getMyApplications,
        applyForPlacement,
        updateApplicationStatus,
        getApplication,
        deleteApplication,
        clearError
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export default PlacementContext;