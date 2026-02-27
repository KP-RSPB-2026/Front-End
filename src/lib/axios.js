import axios from 'axios';

// Prefer explicit API base URL to keep frontend/backend decoupled; fall back to proxy path.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export default api;
