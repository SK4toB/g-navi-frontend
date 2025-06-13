// frontend/src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RightBar from '../components/layout/RightBar';
import useAuthStore from '../store/authStore';

export default function MainLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-full h-full flex">
      <div className="flex flex-row w-full h-full">
       <div className="flex flex-col flex-grow">
          {/* 헤더 */} 
          <div className="">
            <Header />
          </div>
          {/* 메인 컨텐츠 */}
          <div className="flex-grow">
            <Outlet />
          </div>
          {/* 푸터 */}
          <div className="">
            <Footer />
          </div>
        </div>
        {isLoggedIn && (
          <RightBar />
        )}
        </div>
      </div>
  );
}