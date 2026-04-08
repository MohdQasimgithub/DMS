import axiosInstance from './axiosInstance';

export const userApi = {
  getAll: (params) => axiosInstance.get('/v1/users', { params }),
  getById: (id) => axiosInstance.get(`/v1/users/${id}`),
  create: (data) => axiosInstance.post('/v1/users', data),
  update: (id, data) => axiosInstance.put(`/v1/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/users/${id}`),
  unlock: (id) => axiosInstance.patch(`/v1/users/${id}/unlock`),
};
