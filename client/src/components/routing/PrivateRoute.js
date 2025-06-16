import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  // Check if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has the required role
  if (role && user.role !== role) {
    // Redirect based on role
    if (user.role === 'student') {
      return <Navigate to="/student" />;
    }
    if (user.role === 'teacher') {
      return <Navigate to="/teacher" />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;