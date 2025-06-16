import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const AssignmentContext = createContext();

// Initial state
const initialState = {
  assignments: [],
  singleAssignment: null,
  loading: false,
  error: null
};

// Reducer function
const assignmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_ASSIGNMENTS':
      return {
        ...state,
        assignments: action.payload,
        loading: false,
        error: null
      };
    case 'GET_ASSIGNMENT':
      return {
        ...state,
        singleAssignment: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_ASSIGNMENT':
      return {
        ...state,
        assignments: [action.payload, ...state.assignments],
        loading: false,
        error: null
      };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment._id === action.payload._id ? action.payload : assignment
        ),
        singleAssignment: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment._id !== action.payload),
        loading: false,
        error: null
      };
    case 'ASSIGNMENT_ERROR':
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
export const AssignmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(assignmentReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setAssignmentToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get assignments by course
  const getAssignmentsByCourse = async (courseId) => {
    setAssignmentToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/assignments/course/${courseId}`);
      dispatch({
        type: 'GET_ASSIGNMENTS',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching assignments:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ASSIGNMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching assignments'
      });
      return [];
    }
  };

  // Get single assignment
  const getAssignment = async (assignmentId) => {
    setAssignmentToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}`);
      dispatch({
        type: 'GET_ASSIGNMENT',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching assignment:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ASSIGNMENT_ERROR',
        payload: error.response?.data?.message || 'Error fetching assignment'
      });
      return null;
    }
  };

  // Create assignment
  const createAssignment = async (assignmentData) => {
    setAssignmentToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('http://localhost:5000/api/assignments', assignmentData);
      dispatch({
        type: 'CREATE_ASSIGNMENT',
        payload: res.data.data
      });
      return { success: true, assignment: res.data.data };
    } catch (error) {
      console.error('Error creating assignment:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ASSIGNMENT_ERROR',
        payload: error.response?.data?.message || 'Error creating assignment'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creating assignment' 
      };
    }
  };

  // Update assignment
  const updateAssignment = async (assignmentId, assignmentData) => {
    setAssignmentToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`http://localhost:5000/api/assignments/${assignmentId}`, assignmentData);
      dispatch({
        type: 'UPDATE_ASSIGNMENT',
        payload: res.data.data
      });
      return { success: true, assignment: res.data.data };
    } catch (error) {
      console.error('Error updating assignment:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ASSIGNMENT_ERROR',
        payload: error.response?.data?.message || 'Error updating assignment'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating assignment' 
      };
    }
  };

  // Delete assignment
  const deleteAssignment = async (assignmentId) => {
    setAssignmentToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`http://localhost:5000/api/assignments/${assignmentId}`);
      dispatch({
        type: 'DELETE_ASSIGNMENT',
        payload: assignmentId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting assignment:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ASSIGNMENT_ERROR',
        payload: error.response?.data?.message || 'Error deleting assignment'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error deleting assignment' 
      };
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AssignmentContext.Provider
      value={{
        assignments: state.assignments,
        singleAssignment: state.singleAssignment,
        loading: state.loading,
        error: state.error,
        getAssignmentsByCourse,
        getAssignment,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        clearError
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export default AssignmentContext;