// frontend/src/services/predictionService.js
import { api } from './authService';

export const predictHeartDisease = async (data) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await api.post('/predict', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Prediction failed');
  }
};