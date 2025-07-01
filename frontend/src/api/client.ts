// frontend/src/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = useAuthStore.getState().user;
    if (user) {
      if (config.headers) {
        config.headers['X-Member-Id'] = user.memberId.toString();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(new Error(error.response.data.message || 'API 요청 실패'));
    } else if (error.request) {
      return Promise.reject(new Error('네트워크 오류: 서버에 연결할 수 없습니다.'));
    } else {
      return Promise.reject(new Error(`요청 설정 오류: ${error.message}`));
    }
  }
);

export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(endpoint, config).then(res => res.data),

  post: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(endpoint, data, config).then(res => res.data),

  put: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(endpoint, data, config).then(res => res.data),

  delete: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(endpoint, config).then(res => res.data),
};

export default apiClient;