// frontend/src/store/authStore.ts
import { create } from 'zustand';

// 사용자 정보 타입
interface UserInfo {
  memberId: number;
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (memberId: number, name: string, email: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  login: (memberId, name, email) => set({ 
    isLoggedIn: true, 
    user: { memberId, name, email }
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    user: null
  }),
}));

export default useAuthStore;