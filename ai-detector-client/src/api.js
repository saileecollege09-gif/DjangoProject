import axios from 'axios';

// Configure your backend URL here
// For local development: http://localhost:8000
// For production on Render: https://your-render-app.onrender.com
// You can also set this via environment variable REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically add Token to every request if user is logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

