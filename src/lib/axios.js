import axios from 'axios';
import storage from './storage';

// Prefer explicit API base URL to keep frontend/backend decoupled; fall back to proxy path.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Inject bearer token for authenticated calls.
api.interceptors.request.use((config) => {
  const token = storage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
