// frontend/src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RightBar from '../components/layout/RightBar';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 헤더 */}
      <div className='fixed top-0 left-0 z-999'>
        <Header />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-grow">
        <div className="flex-grow">
          <Outlet />
        </div>
        {isLoggedIn && (
          <RightBar />
        )}
      </div>

      {/* 푸터 */}
      <div className=''>
        <Footer />
      </div>
    </div>
  );
}