import axiosInstance from './axiosInstance';

export const testDriveApi = {
  getAll: (params) => axiosInstance.get('/v1/test-drives', { params }),
  getById: (id) => axiosInstance.get(`/v1/test-drives/${id}`),
  create: (data) => axiosInstance.post('/v1/test-drives', data),
  update: (id, data) => axiosInstance.put(`/v1/test-drives/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/test-drives/${id}`),
};
