// frontend/src/store/authStore.ts
import { create } from 'zustand';
import type { RecentChatItem, HomeResponseData } from '../api/auth';

// 사용자 정보 타입
interface UserInfo {
  memberId: number;
  name: string;
  email: string;
}

// 홈 정보 타입 (auth.ts의 HomeResponseData.result 타입 사용)
type HomeInfo = HomeResponseData['result'];

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  homeInfo: HomeInfo | null;
  
  login: (memberId: number, name: string, email: string) => void;
  logout: () => void;
  setHomeInfo: (homeInfo: HomeInfo) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  homeInfo: null,

  login: (memberId, name, email) => set({ 
    isLoggedIn: true, 
    user: { memberId, name, email }
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    user: null,
    homeInfo: null
  }),

  setHomeInfo: (homeInfo) => set({ homeInfo }),
}));

export default useAuthStore;