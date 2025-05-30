// frontend/src/store/authStore.ts
import { create } from 'zustand';

// 전역 상태의 타입을 정의합니다.
interface AuthState {
  isLoggedIn: boolean;
  user: { employeeId: string | null; name: string | null; } | null;
  login: (employeeId: string, name: string) => void;
  logout: () => void;
}

// 주스탠드 스토어 생성
const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 초기 로그인 상태
  user: null, // 초기 사용자 정보
  
  // 로그인 액션 정의
  login: (employeeId, name) => set({ 
    isLoggedIn: true, 
    user: { employeeId, name } 
  }),
  
  // 로그아웃 액션 정의
  logout: () => set({ 
    isLoggedIn: false, 
    user: null 
  }),
}));

export default useAuthStore;