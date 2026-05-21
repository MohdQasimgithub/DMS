import axiosInstance from './axiosInstance';

// ============================================
// Role API - Role management endpoints
// ============================================
export const roleApi = {
  // Fetch all roles with pagination
  getAll: (params) => axiosInstance.get('/v1/roles', { params }),
  
  // Fetch only active roles (for dropdowns)
  getAllActive: () => axiosInstance.get('/v1/roles/active'),
  
  // Fetch single role by ID
  getById: (id) => axiosInstance.get(`/v1/roles/${id}`),
  
  // Create new role (idempotency key auto-added)
  create: (data) => axiosInstance.post('/v1/roles', data),
  
  // Update existing role
  update: (id, data) => axiosInstance.put(`/v1/roles/${id}`, data),
  
  // Delete role
  delete: (id) => axiosInstance.delete(`/v1/roles/${id}`),
};
