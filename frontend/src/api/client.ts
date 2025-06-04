// frontend/src/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 수정필요: 백엔드 API의 기본 주소를 설정합니다.
const API_BASE_URL = 'http://localhost:8080/api'; 

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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
      console.error('API 응답 오류:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.error('인증 실패: 토큰이 만료되었거나 유효하지 않습니다.');
      }
      return Promise.reject(new Error(error.response.data.message || 'API 요청 실패'));
    } else if (error.request) {
      console.error('API 요청 실패: 서버로부터 응답이 없습니다.', error.request);
      return Promise.reject(new Error('네트워크 오류: 서버에 연결할 수 없습니다.'));
    } else {
      console.error('API 요청 설정 오류:', error.message);
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