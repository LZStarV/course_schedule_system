import axios, { AxiosHeaders } from 'axios';
import { devConfig } from '@packages/config';
import { REQUEST_TIMEOUT_MS } from '@/config/request';

export const http = axios.create({
  baseURL: devConfig.backend.baseUrl,
  timeout: REQUEST_TIMEOUT_MS,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    } else {
      const headers = new AxiosHeaders(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return config;
});

http.interceptors.response.use(
  res => res,
  err => {
    if (
      err?.code === 'ECONNABORTED' ||
      /timeout/i.test(err?.message || '')
    ) {
      return Promise.reject(new Error('REQUEST_TIMEOUT'));
    }
    return Promise.reject(err);
  }
);
