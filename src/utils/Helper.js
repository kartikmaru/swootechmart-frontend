import { toast } from 'react-toastify';
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true
});


const notify = (msg, flag) => {
  toast(msg, {
    type: flag ? "success" : "error", // lowercase 'success'/'error'
    icon: true,                        // allow default icon
  });
};

export { notify, client }