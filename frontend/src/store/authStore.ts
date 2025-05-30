// frontend/src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { employeeId: string | null; name: string | null; } | null;
  login: (employeeId: string, name: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  
  login: (employeeId, name) => set({ 
    isLoggedIn: true, 
    user: { employeeId, name } 
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    user: null 
  }),
}));

export default useAuthStore;