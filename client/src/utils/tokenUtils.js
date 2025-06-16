/**
 * Token utilities for authentication
 */

import axios from 'axios';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The stored token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store the authentication token in localStorage
 * @param {string} token - The token to store
 */
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if a token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} Whether the token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT
    const payload = token.split('.')[1];
    if (!payload) return true;
    
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    if (!decodedPayload.exp) return true;
    
    // Compare expiration time with current time
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Set the Authorization header for all axios requests
 * @param {string} token - The token to use
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Get a development token from the server
 * @returns {Promise<string|null>} The development token or null
 */
export const getDevelopmentToken = async (role = 'student') => {
  try {
    const endpoint = role === 'admin' ? 'admin-token' : 'token';
    const response = await axios.get(`http://localhost:5000/api/dev/${endpoint}`);
    if (response.data && response.data.token) {
      storeToken(response.data.token);
      setAuthToken(response.data.token);
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error('Failed to get development token:', error);
    return null;
  }
};

export default {
  getStoredToken,
  storeToken,
  removeToken,
  isTokenExpired,
  setAuthToken,
  getDevelopmentToken
};