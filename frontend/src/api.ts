const API_BASE = 'http://localhost:8000';

// API base URL

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Create headers with auth token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};
