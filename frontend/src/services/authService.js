import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
const API_URL = BASE_URL.endsWith('/api') ? `${BASE_URL}/auth` : `${BASE_URL}/api/auth`;

const register = async (name, email, password) => {
  return await axios.post(`${API_URL}/register`, {
    name,
    email,
    password
  });
};

const login = async (email, password) => {
  return await axios.post(`${API_URL}/login`, {
    email,
    password
  });
};

export default {
  register,
  login
};