import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const AttendanceContext = createContext();

// Initial state
const initialState = {
  attendanceRecords: [],
  singleDayAttendance: null,
  courseAttendanceSummary: null,
  studentAttendanceStats: null,
  loading: false,
  error: null
};

// Reducer function
const attendanceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_ATTENDANCE_BY_COURSE':
      return {
        ...state,
        attendanceRecords: action.payload,
        loading: false,
        error: null
      };
    case 'GET_ATTENDANCE_BY_DATE':
      return {
        ...state,
        singleDayAttendance: action.payload,
        loading: false,
        error: null
      };
    case 'GET_STUDENT_STATS':
      return {
        ...state,
        studentAttendanceStats: action.payload,
        loading: false,
        error: null
      };
    case 'GET_COURSE_SUMMARY':
      return {
        ...state,
        courseAttendanceSummary: action.payload,
        loading: false,
        error: null
      };
    case 'MARK_ATTENDANCE':
      return {
        ...state,
        singleDayAttendance: action.payload,
        attendanceRecords: [
          action.payload, 
          ...state.attendanceRecords.filter(record => 
            record._id !== action.payload._id
          )
        ],
        loading: false,
        error: null
      };
    case 'ATTENDANCE_ERROR':
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
export const AttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setAttendanceToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get attendance by course
  const getAttendanceByCourse = async (courseId) => {
    setAttendanceToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/attendance/course/${courseId}`);
      dispatch({
        type: 'GET_ATTENDANCE_BY_COURSE',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ATTENDANCE_ERROR',
        payload: error.response?.data?.message || 'Error fetching attendance records'
      });
      return [];
    }
  };

  // Get attendance by date
  const getAttendanceByDate = async (courseId, date) => {
    setAttendanceToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const res = await axios.get(
        `http://localhost:5000/api/attendance/course/${courseId}/date/${formattedDate}`
      );
      dispatch({
        type: 'GET_ATTENDANCE_BY_DATE',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching attendance by date:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ATTENDANCE_ERROR',
        payload: error.response?.data?.message || 'Error fetching attendance by date'
      });
      return null;
    }
  };

  // Mark attendance
  const markAttendance = async (attendanceData) => {
    setAttendanceToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('http://localhost:5000/api/attendance', attendanceData);
      dispatch({
        type: 'MARK_ATTENDANCE',
        payload: res.data.data
      });
      return { success: true, attendance: res.data.data };
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ATTENDANCE_ERROR',
        payload: error.response?.data?.message || 'Error marking attendance'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error marking attendance' 
      };
    }
  };

  // Get student attendance statistics
  const getStudentAttendanceStats = async (courseId, studentId) => {
    setAttendanceToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(
        `http://localhost:5000/api/attendance/statistics/course/${courseId}/student/${studentId}`
      );
      dispatch({
        type: 'GET_STUDENT_STATS',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching student statistics:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ATTENDANCE_ERROR',
        payload: error.response?.data?.message || 'Error fetching student statistics'
      });
      return null;
    }
  };

  // Get course attendance summary
  const getCourseAttendanceSummary = async (courseId) => {
    setAttendanceToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(
        `http://localhost:5000/api/attendance/summary/course/${courseId}`
      );
      dispatch({
        type: 'GET_COURSE_SUMMARY',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching course summary:', error.response?.data?.message || error.message);
      dispatch({
        type: 'ATTENDANCE_ERROR',
        payload: error.response?.data?.message || 'Error fetching course summary'
      });
      return null;
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords: state.attendanceRecords,
        singleDayAttendance: state.singleDayAttendance,
        courseAttendanceSummary: state.courseAttendanceSummary,
        studentAttendanceStats: state.studentAttendanceStats,
        loading: state.loading,
        error: state.error,
        getAttendanceByCourse,
        getAttendanceByDate,
        markAttendance,
        getStudentAttendanceStats,
        getCourseAttendanceSummary,
        clearError
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;