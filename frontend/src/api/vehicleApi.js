import axiosInstance from './axiosInstance';

// ============================================
// Vehicle API - All vehicle-related endpoints
// ============================================
export const vehicleApi = {
  // Fetch all vehicles with pagination, search, and filters
  getAll: (params) => axiosInstance.get('/v1/vehicles', { params }),
  
  // Fetch single vehicle by ID
  getById: (id) => axiosInstance.get(`/v1/vehicles/${id}`),
  
  // Create new vehicle (idempotency key auto-added)
  create: (data) => axiosInstance.post('/v1/vehicles', data),
  
  // Update existing vehicle
  update: (id, data) => axiosInstance.put(`/v1/vehicles/${id}`, data),
  
  // Delete vehicle
  delete: (id) => axiosInstance.delete(`/v1/vehicles/${id}`),
  
  // ============================================
  // Linked Dropdowns - Model → Variant → Color
  // ============================================
  
  // Get all unique models
  getModels: () => axiosInstance.get('/v1/vehicles/dropdown/models'),
  
  // Get variants for selected model
  getVariants: (model) => axiosInstance.get('/v1/vehicles/dropdown/variants', { params: { model } }),
  
  // Get colors for selected model + variant
  getColors: (model, variant) => axiosInstance.get('/v1/vehicles/dropdown/colors', { params: { model, variant } }),
};
