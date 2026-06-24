import { toast } from 'react-toastify';
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,   // send cookies on cross-origin requests (works when backend CORS allows exact origin + credentials)
});

// Request interceptor:
// Cross-origin deployments (Vercel frontend → Render backend) can block cookies.
// As a reliable fallback, we also send the token from localStorage as "Bearer <token>" in the Authorization header.
// The backend auth middleware checks cookie first, then Authorization header.
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.trim()}`
    }
  }
  return config
})

const notify = (msg, flag) => {
  toast(msg, {
    type: flag ? "success" : "error",
    icon: true,
  });
};

export { notify, client }
