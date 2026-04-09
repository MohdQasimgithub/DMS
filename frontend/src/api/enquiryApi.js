import axiosInstance from './axiosInstance';

export const enquiryApi = {
  getAll: (params) => axiosInstance.get('/v1/enquiries', { params }),
  getById: (id) => axiosInstance.get(`/v1/enquiries/${id}`),
  create: (data) => axiosInstance.post('/v1/enquiries', data),
  update: (id, data) => axiosInstance.put(`/v1/enquiries/${id}`, data),
  delete: (id) => axiosInstance.delete(`/v1/enquiries/${id}`),
};
