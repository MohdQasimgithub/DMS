import axiosInstance from './axiosInstance';

export const dealerApi = {
  getAll: (params) => axiosInstance.get('/v1/dealers', { params }),
  getById: (id) => axiosInstance.get(`/v1/dealers/${id}`),
  create: (data) => axiosInstance.post('/v1/dealers', data),
  update: (id, data) => axiosInstance.put(`/v1/dealers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/dealers/${id}`),
  getRegions: () => axiosInstance.get('/v1/dealers/dropdown/regions'),
  getByRegion: (region) => axiosInstance.get('/v1/dealers/dropdown/by-region', { params: { region } }),
};
