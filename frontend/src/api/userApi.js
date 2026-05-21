import axiosInstance from './axiosInstance';

// ============================================
// User API - User management endpoints
// ============================================
export const userApi = {
  // Fetch all users with pagination and search
  getAll: (params) => axiosInstance.get('/v1/users', { params }),
  
  // Fetch single user by ID
  getById: (id) => axiosInstance.get(`/v1/users/${id}`),
  
  // Create new user (idempotency key auto-added)
  create: (data) => axiosInstance.post('/v1/users', data),
  
  // Update existing user
  update: (id, data) => axiosInstance.put(`/v1/users/${id}`, data),
  
  // Delete user
  delete: (id) => axiosInstance.delete(`/v1/users/${id}`),
  
  // Unlock user account (after 5 failed login attempts)
  unlock: (id) => axiosInstance.patch(`/v1/users/${id}/unlock`),
};
