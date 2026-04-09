import axiosInstance from './axiosInstance';

export const loginHistoryApi = {
  getAll: (params) => axiosInstance.get('/v1/login-history', { params }),
};
