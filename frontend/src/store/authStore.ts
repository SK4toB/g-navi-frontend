// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecentChatItem, HomeResponseData } from '../api/auth';

// 사용자 정보 타입
interface UserInfo {
  memberId: number;
  name: string;
  email: string;
  role: 'USER' | 'EXPERT' | 'ADMIN';
  isExpert: boolean;
}

type HomeInfo = HomeResponseData['result'];

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  homeInfo: HomeInfo | null;
  
  login: (memberId: number, name: string, email: string, role: 'USER' | 'EXPERT' | 'ADMIN', isExpert: boolean) => void;
  logout: () => void;
  setHomeInfo: (homeInfo: HomeInfo) => void;
  updateHomeInfo: (updates: Partial<HomeInfo>) => void;
  initializeAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      homeInfo: null,

      login: (memberId, name, email, role, isExpert) => {
        const userInfo = { memberId, name, email, role, isExpert };
        localStorage.setItem('memberId', memberId.toString());
        set({ 
          isLoggedIn: true, 
          user: userInfo
        });
      },
      
      logout: () => {
        localStorage.removeItem('memberId');
        set({ 
          isLoggedIn: false, 
          user: null,
          homeInfo: null
        });
      },

      setHomeInfo: (homeInfo) => set({ homeInfo }),

      // updateHomeInfo 메서드 구현 추가
      updateHomeInfo: (updates) => {
        const currentHomeInfo = get().homeInfo;
        if (currentHomeInfo) {
          set({ 
            homeInfo: { 
              ...currentHomeInfo, 
              ...updates 
            } 
          });
        }
      },

      initializeAuth: () => {
        const storedMemberId = localStorage.getItem('memberId');
        const currentState = get();
        
        if (storedMemberId && !currentState.isLoggedIn) {
          if (currentState.user && currentState.user.memberId.toString() === storedMemberId) {
            set({ isLoggedIn: true });
          }
        }
        
        if (!storedMemberId && currentState.isLoggedIn) {
          set({ 
            isLoggedIn: false, 
            user: null, 
            homeInfo: null 
          });
        }
      },
    }),
    {
      name: 'auth-storage',

      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;