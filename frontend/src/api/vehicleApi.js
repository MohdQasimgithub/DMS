import axiosInstance from './axiosInstance';

export const vehicleApi = {
  getAll: (params) => axiosInstance.get('/v1/vehicles', { params }),
  getById: (id) => axiosInstance.get(`/v1/vehicles/${id}`),
  create: (data) => axiosInstance.post('/v1/vehicles', data),
  update: (id, data) => axiosInstance.put(`/v1/vehicles/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/vehicles/${id}`),
  getModels: () => axiosInstance.get('/v1/vehicles/dropdown/models'),
  getVariants: (model) => axiosInstance.get('/v1/vehicles/dropdown/variants', { params: { model } }),
  getColors: (model, variant) => axiosInstance.get('/v1/vehicles/dropdown/colors', { params: { model, variant } }),
};
