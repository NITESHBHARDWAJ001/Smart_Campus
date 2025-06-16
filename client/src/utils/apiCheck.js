import axios from 'axios';

/**
 * Utility function to check API connectivity
 * and log helpful information for debugging
 */
export const checkApiConnectivity = async () => {
  try {
    console.log('Checking API connectivity...');
    const res = await axios.get('http://localhost:5000');
    console.log('API connectivity test successful:', res.data);
    return { success: true, message: res.data };
  } catch (error) {
    console.error('API connectivity test failed:', error);
    
    // Provide helpful debugging information
    if (error.code === 'ECONNREFUSED') {
      console.error('Server appears to be offline. Make sure your backend server is running on port 5000.');
    } else if (error.response) {
      console.error('Server responded with status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No details available'
    };
  }
};

/**
 * Test if CORS is properly configured
 */
export const testCorsConfiguration = async () => {
  try {
    const res = await axios.options('http://localhost:5000/api/auth/register');
    console.log('CORS test successful with headers:', res.headers);
    return { success: true };
  } catch (error) {
    console.error('CORS test failed:', error);
    return { 
      success: false, 
      error: error.message
    };
  }
};