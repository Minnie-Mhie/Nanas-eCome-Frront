import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://separate-backend.vercel.app';

const axiosInstance = axios.create({
    baseURL: "https://separate-backend.vercel.app",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth tokens if needed
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;