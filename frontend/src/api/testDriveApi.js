// ============================================================================
// TEST DRIVE API - Service layer for test drive scheduling
// ============================================================================

import axiosInstance from './axiosInstance';

export const testDriveApi = {
  // GET /v1/test-drives?page=0&size=10&status=SCHEDULED
  // Fetch test drives with pagination and filtering
  getAll: (params) => axiosInstance.get('/v1/test-drives', { params }),
  
  // GET /v1/test-drives/123
  // Fetch single test drive by ID
  getById: (id) => axiosInstance.get(`/v1/test-drives/${id}`),
  
  // POST /v1/test-drives
  // Create new test drive booking
  create: (data) => axiosInstance.post('/v1/test-drives', data),
  
  // PUT /v1/test-drives/123
  // Update test drive details or status
  update: (id, data) => axiosInstance.put(`/v1/test-drives/${id}`, data),
  
  // DELETE /v1/test-drives/123
  // Cancel test drive
  delete: (id) => axiosInstance.delete(`/v1/test-drives/${id}`),
};
