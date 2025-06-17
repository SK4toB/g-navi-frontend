// frontend/src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideBar from '../components/layout/SideBar';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-full h-full flex flex-col relative">

      {/* 헤더 */}
      <div className="fixed z-10">
        <Header />
      </div>
      
      <div className='w-full h-full flex flex-col'>
        {/* 중앙 컨텐츠 - 항상 전체 너비 유지 */}
        <div className="w-full h-full flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          {/* 푸터 */}
          <div className="flex justify-center">
            <Footer />
          </div>
        </div>
        
        {/* 사이드바 영역 - 고정 위치로 오버레이 */}
        {isLoggedIn && (
          <div className="fixed top-0 right-0 h-full z-20">
            <SideBar />
          </div>
        )}
      </div>
    </div>
  );
}