import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Session-related API calls
export const fetchSession = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

export const createSession = async (title) => {
  const response = await api.post('/sessions', { title });
  return response.data;
};

export const joinSession = async (code) => {
  const response = await api.get(`/sessions/join/${code}`);
  return response.data;
};

export const endSession = async (sessionId) => {
  await api.post(`/sessions/${sessionId}/end`);
};

// Question-related API calls
export const fetchQuestions = async (sessionId, sortByVotes = true) => {
  const response = await api.get(`/questions/session/${sessionId}?sortByVotes=${sortByVotes}`);
  return response.data;
};

export const addQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const voteQuestion = async (questionId) => {
  const response = await api.post(`/questions/${questionId}/vote`);
  return response.data;
};

export const markQuestionAsAnswered = async (questionId) => {
  await api.post(`/questions/${questionId}/mark-answered`);
};

// Confusion-related API calls
export const reportConfusionLevel = async (level, sessionId) => {
  const response = await api.post('/confusion', { level, sessionId });
  return response.data;
};

export const getAverageConfusionLevel = async (sessionId) => {
  const response = await api.get(`/confusion/session/${sessionId}/average`);
  return response.data;
};

export const getUserConfusionLevel = async (userId, sessionId) => {
  const response = await api.get(`/confusion/user/${userId}/session/${sessionId}`);
  return response.data;
};

export default api;