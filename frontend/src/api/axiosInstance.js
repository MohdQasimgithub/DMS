// ============================================================================
// AXIOS INSTANCE - Centralized HTTP client with interceptors
// ============================================================================
// Handles: JWT token attachment, automatic token refresh, idempotency keys
// ============================================================================

import axios from 'axios';

// Base URL from environment variable or default to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,  // 15 second timeout
  headers: { 'Content-Type': 'application/json' },
});

// ============================================================================
// REQUEST INTERCEPTOR - Runs before every API request
// ============================================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Attach JWT token to Authorization header
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // 2. Add idempotency key for POST requests (prevents duplicate operations)
    if (config.method === 'post' && !config.headers['Idempotency-Key']) {
      config.headers['Idempotency-Key'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE INTERCEPTOR - Runs after every API response
// ============================================================================
axiosInstance.interceptors.response.use(
  (response) => response,  // Success - return as is
  
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Prevent infinite loop
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to refresh access token
          const res = await axios.post(`${BASE_URL}/v1/auth/refresh`, null, {
            headers: { 'X-Refresh-Token': refreshToken },
          });
          
          // Save new token
          const newToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
          
        } catch {
          // Refresh failed - logout user
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        // No refresh token - logout user
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
