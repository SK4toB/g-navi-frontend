// frontend/src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import useAuthStore from './store/authStore';
import { authApi } from './api/auth';

export default function App() {
  const { initializeAuth, isLoggedIn, user } = useAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  // 앱 시작시 인증 상태 초기화
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. 로컬 상태 초기화
        initializeAuth();
        
        // 2. localStorage에 memberId가 있지만 store에 사용자 정보가 없는 경우
        const storedMemberId = localStorage.getItem('memberId');
        if (storedMemberId && !isLoggedIn) {
          
          // 서버에서 사용자 정보 확인 및 복원
          const userData = await authApi.getCurrentUser();
          
          // ADMIN 사용자인 경우 admin 페이지로 리다이렉트할 준비
          if (userData?.result.role === 'ADMIN') {
            // router가 admin 페이지로 자동 리다이렉트하도록 함
          }
        }
      } catch (error) {
        // 오류 발생 시 로그아웃 처리
        useAuthStore.getState().logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [initializeAuth, isLoggedIn]);

  // 초기화 중일 때 로딩 표시
  if (isInitializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
        <p className="ml-4 text-gray-600">앱을 초기화하는 중...</p>
      </div>
    );
  }

  return (
    <RouterProvider router={router} />
  );
}