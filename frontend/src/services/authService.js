// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return {
      id: response.data.user?.id,
      name: response.data.user?.name,
      email: response.data.user?.email
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const checkAuth = () => {
  return localStorage.getItem('token') !== null;
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Export the api instance if needed elsewhere
export { api };