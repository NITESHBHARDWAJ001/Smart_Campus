/**
 * Server configuration utilities
 * 
 * This file contains configuration for API endpoints and related server settings
 */

// Base API URL - change this if your server is hosted elsewhere
const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const API = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`
  },
  
  // Admin endpoints
  admin: {
    users: `${API_BASE_URL}/admin/users`,
    user: (id) => `${API_BASE_URL}/admin/users/${id}`,
    placements: `${API_BASE_URL}/admin/placements`,
    placement: (id) => `${API_BASE_URL}/admin/placements/${id}`,
    stats: `${API_BASE_URL}/admin/stats`
  },
  
  // Placement endpoints
  placements: {
    base: `${API_BASE_URL}/placements`,
    single: (id) => `${API_BASE_URL}/placements/${id}`,
    applications: (id) => `${API_BASE_URL}/placements/${id}/applications`,
    toggleActive: (id) => `${API_BASE_URL}/placements/${id}/toggle-active`
  },
  
  // Application endpoints
  applications: {
    base: `${API_BASE_URL}/applications`,
    single: (id) => `${API_BASE_URL}/applications/${id}`,
    myApplications: `${API_BASE_URL}/applications/my-applications`,
    status: (id) => `${API_BASE_URL}/applications/${id}/status`
  },
  
  // Profile endpoints
  profile: {
    base: `${API_BASE_URL}/profile`,
    avatar: `${API_BASE_URL}/profile/avatar`
  }
};

export default API;