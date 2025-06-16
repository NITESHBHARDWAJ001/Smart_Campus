/**
 * Database connection checker utility
 * 
 * This file provides functions to check database connectivity and API status
 */

import axios from 'axios';
import API from './serverConfig';

// Check if the API is running and database is connected
export const checkDatabaseConnection = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // First try a public endpoint that doesn't require admin authentication
    const response = await axios.get('http://localhost:5000');
    
    if (response.status === 200) {
      console.log('✅ API server is running');
      
      try {
        // Try to get a development token if we're in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('Getting development token for database check...');
          try {
            const tokenResponse = await axios.get('http://localhost:5000/api/dev/token');
            
            if (tokenResponse.data && tokenResponse.data.token) {
              // Store this token for future use
              localStorage.setItem('token', tokenResponse.data.token);
              
              // Basic check - just making sure we can access a protected endpoint
              const placementsResponse = await axios.get('http://localhost:5000/api/placements', {
                headers: {
                  'Authorization': `Bearer ${tokenResponse.data.token}`
                }
              });
              
              if (placementsResponse.data) {
                console.log('✅ Database connection successful (accessed protected endpoint)');
                return {
                  success: true,
                  message: 'Database connection successful',
                  data: placementsResponse.data
                };
              }
            }
          } catch (devTokenError) {
            console.warn('Could not get development token:', devTokenError.message);
          }
        }
        
        // If we reach here, either we're not in development mode or dev token approach failed
        console.log('Checking database connection using server status endpoint...');
        const healthCheck = await axios.get('http://localhost:5000/api/status');
        
        if (healthCheck.data && healthCheck.data.success) {
          console.log('✅ Database connection successful via status check');
          return {
            success: true,
            message: 'Database connection successful',
            data: healthCheck.data
          };
        }
      } catch (dbError) {
        console.warn('⚠️ API is running but database check failed:', dbError.message);
        return {
          success: false,
          message: 'API is running but database connection could not be verified',
          error: dbError
        };
      }
    }
    
    return {
      success: false,
      message: 'Could not verify database connection'
    };
  } catch (error) {
    console.error('❌ Database connection check failed:', error);
    return {
      success: false,
      message: `Connection error: ${error.message}`,
      error
    };
  }
};

// Check authentication and role permissions
export const checkAuthPermissions = async (token) => {
  try {
    console.log('Testing auth permissions...');
    
    // Set auth header
    const config = {
      headers: {
        Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`
      }
    };
    
    const response = await axios.get(`${API.auth.me}`, config);
    
    if (response.status === 200) {
      console.log('✅ Auth check successful');
      console.log('User:', response.data);
      return {
        success: true,
        message: 'Authentication successful',
        user: response.data
      };
    } else {
      console.error('❌ Auth check failed:', response.status, response.statusText);
      return {
        success: false,
        message: `Auth check returned status ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('❌ Auth check failed:', error);
    return {
      success: false,
      message: `Auth error: ${error.message}`,
      error
    };
  }
};

export default {
  checkDatabaseConnection,
  checkAuthPermissions
};