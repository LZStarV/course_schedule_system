import axios from 'axios';
import { devConfig } from '@packages/config';

export const http = axios.create({
  baseURL: devConfig.backend.baseUrl,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token)
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  return config;
});

http.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);
