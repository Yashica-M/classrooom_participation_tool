import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Login failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Registration failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};