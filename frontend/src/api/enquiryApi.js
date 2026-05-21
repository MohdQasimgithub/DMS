import axiosInstance from './axiosInstance';

// ============================================
// Enquiry API - Customer enquiry management
// ============================================
export const enquiryApi = {
  // Fetch all enquiries with pagination and search
  getAll: (params) => axiosInstance.get('/v1/enquiries', { params }),
  
  // Fetch single enquiry by ID
  getById: (id) => axiosInstance.get(`/v1/enquiries/${id}`),
  
  // Create new enquiry (idempotency key auto-added)
  create: (data) => axiosInstance.post('/v1/enquiries', data),
  
  // Update existing enquiry
  update: (id, data) => axiosInstance.put(`/v1/enquiries/${id}`, data),
  
  // Delete enquiry
  delete: (id) => axiosInstance.delete(`/v1/enquiries/${id}`),
};
