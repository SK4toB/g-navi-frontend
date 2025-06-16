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
      
      {/* 메인 컨텐츠 + 사이드바 */}
      <div className="flex-1 flex">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 페이지 컨텐츠 */}
          <div className="flex-grow">
            <Outlet />
          </div>
          
          {/* 푸터 */}
          <div className="flex-shrink-0">
            <Footer />
          </div>
        </div>
        {isLoggedIn && (
          <SideBar />
        )}
      </div>
    </div>
  );
}