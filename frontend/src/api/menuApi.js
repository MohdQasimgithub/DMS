import axiosInstance from './axiosInstance';

export const menuApi = {
  getTree: () => axiosInstance.get('/v1/menus/tree'),
  getAll: () => axiosInstance.get('/v1/menus'),
  getById: (id) => axiosInstance.get(`/v1/menus/${id}`),
  create: (data) => axiosInstance.post('/v1/menus', data),
  update: (id, data) => axiosInstance.put(`/v1/menus/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/menus/${id}`),
};
