import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const CourseContext = createContext();

// Initial state
const initialState = {
  courses: [],
  course: null,
  loading: false,
  error: null
};

// Reducer function
const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_COURSES':
      return {
        ...state,
        courses: action.payload,
        loading: false,
        error: null
      };
    case 'GET_COURSE':
      return {
        ...state,
        course: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
        loading: false,
        error: null
      };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course._id === action.payload._id ? action.payload : course
        ),
        course: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course._id !== action.payload),
        loading: false,
        error: null
      };
    case 'ADD_STUDENT':
      return {
        ...state,
        course: action.payload,
        courses: state.courses.map(course =>
          course._id === action.payload._id ? action.payload : course
        ),
        loading: false,
        error: null
      };
    case 'REMOVE_STUDENT':
      return {
        ...state,
        course: action.payload,
        courses: state.courses.map(course =>
          course._id === action.payload._id ? action.payload : course
        ),
        loading: false,
        error: null
      };
    case 'COURSE_ERROR':
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
export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setCourseToken = () => {
    // Get the latest token from localStorage in case it changed
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedToken !== token) {
      console.log('Found updated token in localStorage for course context');
      // We can't update the token here as it's from another context
      // But we can use it for the current request
    }
    
    // Use the most up-to-date token available
    const currentToken = storedToken || token;
    
    if (currentToken) {
      console.log('Setting auth token for course request');
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    } else {
      // Try to use hardcoded token for development
      if (process.env.NODE_ENV === 'development') {
        // For development - use a hardcoded token
        const devToken = 'devtoken123456';
        console.log('DEVELOPMENT MODE: Using default dev token for course context');
        axios.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
      } else {
        console.warn('No auth token available for course request');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  };

  // Get all courses
  const getCourses = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Make sure token is set properly
      setCourseToken();
      
      // Create a config object with authorization header
      const config = {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': axios.defaults.headers.common['Authorization']
        }
      };
      
      console.log('Fetching courses with auth header set:', !!config.headers.Authorization);
      
      const res = await axios.get('http://localhost:5000/api/courses', config);
      
      if (!res.data) {
        throw new Error('No data received from API');
      }
      
      // Handle different response formats
      const coursesData = res.data.data || res.data;
      
      dispatch({
        type: 'GET_COURSES',
        payload: coursesData
      });
      return coursesData;
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      
      // Development mode - attempt to fetch a dev token
      if (process.env.NODE_ENV === 'development') {
        try {
          console.log('Development mode: Attempting to get dev token for courses');
          const devResponse = await axios.get('http://localhost:5000/api/dev/token');
          if (devResponse.data && devResponse.data.token) {
            // Store the token for future use
            localStorage.setItem('token', devResponse.data.token);
            
            // Use the new token right away
            axios.defaults.headers.common['Authorization'] = `Bearer ${devResponse.data.token}`;
            
            // Try again with the new token
            console.log('Retrying course fetch with dev token');
            const retryRes = await axios.get('http://localhost:5000/api/courses', {
              headers: {
                'Authorization': `Bearer ${devResponse.data.token}`
              }
            });
            
            const coursesData = retryRes.data.data || retryRes.data;
            
            dispatch({
              type: 'GET_COURSES',
              payload: coursesData
            });
            return coursesData;
          }
        } catch (devError) {
          console.error('Failed to get development token:', devError);
        }
      }
      
      // If we got here, both regular and dev approaches failed
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error fetching courses'
      });
      return [];
    }
  };

  // Get single course
  const getCourse = async (courseId) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      dispatch({
        type: 'GET_COURSE',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error fetching course'
      });
      return null;
    }
  };

  // Create course
  const createCourse = async (courseData) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('http://localhost:5000/api/courses', courseData);
      dispatch({
        type: 'CREATE_COURSE',
        payload: res.data.data
      });
      return { success: true, course: res.data.data };
    } catch (error) {
      console.error('Error creating course:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error creating course'
      });
      return { success: false, message: error.response?.data?.message || 'Error creating course' };
    }
  };

  // Update course
  const updateCourse = async (courseId, courseData) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(
        `http://localhost:5000/api/courses/${courseId}`,
        courseData
      );
      dispatch({
        type: 'UPDATE_COURSE',
        payload: res.data.data
      });
      return { success: true, course: res.data.data };
    } catch (error) {
      console.error('Error updating course:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error updating course'
      });
      return { success: false, message: error.response?.data?.message || 'Error updating course' };
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      dispatch({
        type: 'DELETE_COURSE',
        payload: courseId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting course:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error deleting course'
      });
      return { success: false, message: error.response?.data?.message || 'Error deleting course' };
    }
  };

  // Add student to course
  const addStudent = async (courseId, rollNumber) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/students`,
        { rollNumber }
      );
      dispatch({
        type: 'ADD_STUDENT',
        payload: res.data.data
      });
      return { success: true, course: res.data.data };
    } catch (error) {
      console.error('Error adding student:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error adding student'
      });
      return { success: false, message: error.response?.data?.message || 'Error adding student' };
    }
  };

  // Remove student from course
  const removeStudent = async (courseId, studentId) => {
    setCourseToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.delete(
        `http://localhost:5000/api/courses/${courseId}/students/${studentId}`
      );
      dispatch({
        type: 'REMOVE_STUDENT',
        payload: res.data.data
      });
      return { success: true, course: res.data.data };
    } catch (error) {
      console.error('Error removing student:', error);
      dispatch({
        type: 'COURSE_ERROR',
        payload: error.response?.data?.message || 'Error removing student'
      });
      return { success: false, message: error.response?.data?.message || 'Error removing student' };
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        course: state.course,
        loading: state.loading,
        error: state.error,
        getCourses,
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse,
        addStudent,
        removeStudent,
        clearError
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;