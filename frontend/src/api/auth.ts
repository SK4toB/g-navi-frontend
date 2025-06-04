// frontend/src/api/auth.ts
import { api } from './client';
import useAuthStore from '../store/authStore';

// 로그인 요청 시 사용될 데이터의 공통 타입 정의
export interface LoginData {
  employeeId: string;
  password: string;
}

// 로그인 응답 시 서버로부터 받을 데이터의 공통 타입 정의
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  employeeId: string;
  name: string;
}

// 회원가입 요청 시 사용될 데이터의 공통 타입 정의
export interface SignupData {
  name: string;
  email: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

// 회원가입 응답 시 서버로부터 받을 데이터의 공통 타입 정의
export interface SignupResponseData {
  message: string;
}

export const authApi = {
  login: async (payload: LoginData): Promise<LoginResponseData> => {
    const data = await api.post<LoginResponseData>('/auth/login', payload);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      useAuthStore.getState().login(data.employeeId, data.name);
    }
    return data;
  },

  signup: async (payload: SignupData): Promise<SignupResponseData> => {
    const data = await api.post<SignupResponseData>('/auth/signup', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    useAuthStore.getState().logout();
  },
};