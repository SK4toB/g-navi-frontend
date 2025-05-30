// frontend/src/api/auth.ts
import { api } from './client'; // 설정한 공통 API 클라이언트 import

interface LoginPayload {
  employeeId: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  employeeId: string;
  name: string; // 로그인 후 받을 사용자 이름 등
}

interface SignupPayload {
  name: string;
  email: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string; // 회원가입 성공 메시지 등
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse>('/auth/login', payload);
    // 로그인 성공 시 토큰 저장 (클라이언트에서 관리)
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },

  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const data = await api.post<SignupResponse>('/auth/signup', payload);
    return data;
  },

  // 로그아웃 API (백엔드에서 토큰 무효화 등)
  logout: async (): Promise<void> => {
    // await api.post('/auth/logout'); // 필요하다면 실제 로그아웃 API 호출
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};