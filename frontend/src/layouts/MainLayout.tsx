// frontend/src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideBar from '../components/layout/SideBar';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-full h-full flex flex-col">

      {/* 헤더 */}
      <div className="fixed">
        <Header />
      </div>
      
      <div className='w-full h-full flex flex-col'>
      <div className="w-full h-full flex">
        {/* 중앙 컨텐츠 */}
        <div className="w-full h-full flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          {/* 푸터 */}
          <div className="flex justify-center">
            <Footer />
          </div>
        </div>
        
        {/* 사이드바 영역 */}
        {isLoggedIn && (
          <SideBar />
        )}
      </div>
    </div>
  </div>
);
}