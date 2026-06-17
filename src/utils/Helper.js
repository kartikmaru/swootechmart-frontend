import { toast } from 'react-toastify';
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

// Har request me localStorage token ko Authorization header me lagao
// Cookie cross-origin block hoti hai — ye workaround hai
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
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
