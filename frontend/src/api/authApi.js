import axiosInstance from './axiosInstance';

export const authApi = {
  login: (data) => axiosInstance.post('/v1/auth/login', data),
  register: (data) => axiosInstance.post('/v1/auth/register', data),
  logout: () => axiosInstance.post('/v1/auth/logout'),
  refresh: (token) => axiosInstance.post('/v1/auth/refresh', null, {
    headers: { 'X-Refresh-Token': token }
  }),
};
