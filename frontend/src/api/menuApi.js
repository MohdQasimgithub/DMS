import axiosInstance from './axiosInstance';

// ============================================
// Menu API - Menu management endpoints
// ============================================
export const menuApi = {
  // Fetch menu tree structure (hierarchical)
  getTree: () => axiosInstance.get('/v1/menus/tree'),
  
  // Fetch all menus (flat list)
  getAll: () => axiosInstance.get('/v1/menus'),
  
  // Fetch single menu by ID
  getById: (id) => axiosInstance.get(`/v1/menus/${id}`),
  
  // Create new menu (idempotency key auto-added)
  create: (data) => axiosInstance.post('/v1/menus', data),
  
  // Update existing menu (supports drag-and-drop reordering)
  update: (id, data) => axiosInstance.put(`/v1/menus/${id}`, data),
  
  // Delete menu
  delete: (id) => axiosInstance.delete(`/v1/menus/${id}`),
};
