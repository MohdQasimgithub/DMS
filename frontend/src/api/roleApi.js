import axiosInstance from './axiosInstance';

export const roleApi = {
  getAll: (params) => axiosInstance.get('/v1/roles', { params }),
  getAllActive: () => axiosInstance.get('/v1/roles/active'),
  getById: (id) => axiosInstance.get(`/v1/roles/${id}`),
  create: (data) => axiosInstance.post('/v1/roles', data),
  update: (id, data) => axiosInstance.put(`/v1/roles/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/roles/${id}`),
};
