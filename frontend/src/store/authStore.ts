// frontend/src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  memberId: number | null;
  login: (memberId: number, name: string, email: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  memberId: null,

  login: (memberId) => set({ 
    isLoggedIn: true, 
    memberId 
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    memberId: null 
  }),
}));

export default useAuthStore;