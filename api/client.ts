import axios from 'axios';

const API_BASE_URL = `http://${process.env.EXPO_PUBLIC_SERVER_IP}:8080`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiBaseUrl = () => API_BASE_URL;
