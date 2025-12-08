// src/utils/api.js
import axios from 'axios';
import { getPentestMode, applyPentestMode } from './pentestMode';

// Base URL selection:
// - If VITE_API_URL is set AND not localhost, use it (for prod/staging)
// - Otherwise, use relative /api/v1 so requests go through Vite proxy/ngrok/Burp
const rawApi = import.meta.env.VITE_API_URL;
const useEnv =
  rawApi &&
  !rawApi.toLowerCase().includes('localhost') &&
  !rawApi.toLowerCase().includes('127.0.0.1');
const API_URL = useEnv ? rawApi.replace(/\/$/, '') : '/api/v1';

// Ensure header is set on initial load
applyPentestMode(getPentestMode());

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Pentest-Mode': getPentestMode(),
  },
});

// Add token and pentest header to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Pentest-Mode'] = getPentestMode();
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLogout'));
    }
    return Promise.reject(error);
  }
);

export default api;

