// frontend/src/api/auth.ts
import { api } from './client';
import useAuthStore from '../store/authStore';

// 회원가입 요청 시 사용될 데이터의 타입 정의
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// 회원가입 응답 시 서버로부터 받을 데이터의 타입 정의
export interface SignupResponseData {
  code: string;
  message: string;
  result: {
    name: string;
    email: string;
    message: string;
  };
  isSuccess: boolean;
}

// 로그인 요청 시 사용될 데이터의 공통 타입 정의
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 응답 시 서버로부터 받을 데이터의 공통 타입 정의
export interface LoginResponseData {
  code: string;
  message: string;
  result: {
    memberId: number;
    name: string;
    email: string;
    role: 'USER' | 'EXPERT' | 'ADMIN';
    isExpert: boolean;
    message: string;
  };
  isSuccess: boolean;
}

// 최근 대화 정보 타입 정의
export interface RecentChatItem {
  conversationId: string;
  title: string;
  lastUpdated: string;
  hasMessages: boolean;
  messageCount: number;
}

// 홈에서 불러올 정보 타입 정의
export interface HomeResponseData {
  code: string;
  message: string;
  result: {
    userName: string;
    level: string;
    skills: string[];
    projectNames: string[];
    recentChats: RecentChatItem[];
  };
  isSuccess: boolean;
}

// 레벨 수정 요청 타입 추가
export interface UpdateMemberLevelRequest {
  memberId: number;
  newLevel: 'CL1' | 'CL2' | 'CL3' | 'CL4' | 'CL5';
}

// 레벨 수정 응답 타입 추가
export interface UpdateMemberLevelResponse {
  code: string;
  message: string;
  result: string;
  isSuccess: boolean;
}

export const authApi = {
  signup: async (payload: SignupData): Promise<SignupResponseData> => {
    const data = await api.post<SignupResponseData>('/api/auth/signup', payload);
    return data;
  },

  login: async (payload: LoginData): Promise<LoginResponseData> => {
    const data = await api.post<LoginResponseData>('/api/auth/login', payload);

    if (data.result.memberId) {
      useAuthStore.getState().login(
        data.result.memberId,
        data.result.name,
        data.result.email,
        data.result.role,
        data.result.isExpert
      );
    }

    return data;
  },

  logout: async (): Promise<void> => {
    useAuthStore.getState().logout();
  },

  // 현재 사용자 정보 확인 (새로고침 시 사용)
  getCurrentUser: async (): Promise<LoginResponseData | null> => {
    try {
      const memberId = localStorage.getItem('memberId');
      if (!memberId) return null;

      // 서버에서 현재 사용자 정보 확인
      const data = await api.get<LoginResponseData>(`/api/auth/user/${memberId}`);

      if (data.isSuccess) {
        // 로그인 상태 복원
        useAuthStore.getState().login(
          data.result.memberId,
          data.result.name,
          data.result.email,
          data.result.role,
          data.result.isExpert
        );
        return data;
      }

      return null;
    } catch (error) {
      useAuthStore.getState().logout();
      return null;
    }
  },

  // 홈 정보 조회 API
  getHomeInfo: async (): Promise<HomeResponseData> => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const data = await api.get<HomeResponseData>(`/api/auth/${user.memberId}/home`, {
      params: { memberId: user.memberId }
    });
    return data;
  },

  // 회원 레벨 수정 API 추가
  updateMemberLevel: async (payload: UpdateMemberLevelRequest): Promise<UpdateMemberLevelResponse> => {
    const data = await api.put<UpdateMemberLevelResponse>('/api/auth/members/level', payload);
    return data;
  },
};