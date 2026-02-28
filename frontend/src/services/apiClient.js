import axios from 'axios';

/**
 * Advanced Axios Configuration for SaaS
 * Centralizes identical API base URLs, automatically attaching JWTs to every request,
 * and intercepts globally (e.g., throwing a user out if their token expires).
 */

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_BASE_URL || '/api';
    // Ensure absolute URLs from environment variables include the /api prefix if missing
    if (url.startsWith('http') && !url.includes('/api')) {
        url = url.endsWith('/') ? `${url}api` : `${url}/api`;
    }
    return url.endsWith('/') ? url : `${url}/`;
};

// Create Axios instance with Auth headers
const apiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
    // Prevent axios from taking down the app on 4xx/5xx errors
    validateStatus: (status) => status < 500
});

// Request Interceptor: Attach the JWT token securely
apiClient.interceptors.request.use(
    (config) => {
        // Read strictly from localStorage
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global 401s (Token expiries)
apiClient.interceptors.response.use(
    (response) => {
        // If the backend threw a 401 Unauthorized, wipe memory and force log out
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // If they are not already on the login page, boot them there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
