import axiosInstance from './axiosInstance';

// ============================================
// Auth API - Authentication endpoints
// ============================================
export const authApi = {
  // Login - returns JWT access token + refresh token
  login: (data) => axiosInstance.post('/v1/auth/login', data),
  
  // Register new user account
  register: (data) => axiosInstance.post('/v1/auth/register', data),
  
  // Logout - invalidate current session
  logout: () => axiosInstance.post('/v1/auth/logout'),
  
  // Refresh access token using refresh token
  refresh: (token) => axiosInstance.post('/v1/auth/refresh', null, {
    headers: { 'X-Refresh-Token': token }
  }),
};
