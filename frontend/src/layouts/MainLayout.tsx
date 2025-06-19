// frontend/src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
// import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideBar from '../components/layout/SideBar';
import SKButterflyBackground from '../components/layout/SKButterflyBackground';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      
      {/* Glassmorphism 배경 */}
      <div className="fixed inset-0 -z-10">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* 몰랑몰랑한 블러 원들 */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-200/35 to-blue-200/35 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* 추가 작은 원들 */}
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/25 to-orange-200/25 rounded-full blur-2xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-indigo-200/30 to-blue-200/30 rounded-full blur-2xl animate-pulse delay-3000"></div>
        
        {/* 글래스 오버레이 */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      </div>

      {/* SK 나비 배경 (glassmorphism 위, 컨텐츠 아래) */}
      <SKButterflyBackground />

      {/* 헤더 */}
      {/* <div className="fixed z-10">
        <Header />
      </div> */}
      
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