// ============================================================================
// DEALER API - Service layer for dealer-related HTTP requests
// ============================================================================
// All dealer CRUD operations and dropdown data fetching
// ============================================================================

import axiosInstance from './axiosInstance';

export const dealerApi = {
  // GET /v1/dealers?page=0&size=10&search=seoul&status=ACTIVE
  // Fetch dealers with pagination, search, and filtering
  getAll: (params) => axiosInstance.get('/v1/dealers', { params }),
  
  // GET /v1/dealers/123
  // Fetch single dealer by ID
  getById: (id) => axiosInstance.get(`/v1/dealers/${id}`),
  
  // POST /v1/dealers
  // Create new dealer
  create: (data) => axiosInstance.post('/v1/dealers', data),
  
  // PUT /v1/dealers/123
  // Update existing dealer
  update: (id, data) => axiosInstance.put(`/v1/dealers/${id}`, data),
  
  // DELETE /v1/dealers/123
  // Soft delete dealer (sets active=false)
  delete: (id) => axiosInstance.delete(`/v1/dealers/${id}`),
  
  // GET /v1/dealers/dropdown/regions
  // Fetch unique regions for dropdown
  getRegions: () => axiosInstance.get('/v1/dealers/dropdown/regions'),
  
  // GET /v1/dealers/dropdown/by-region?region=Seoul
  // Fetch dealers by region for dropdown
  getByRegion: (region) => axiosInstance.get('/v1/dealers/dropdown/by-region', { params: { region } }),
};