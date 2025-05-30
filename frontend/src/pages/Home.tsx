import React from 'react';
import HomeSection from '../components/home/HomeSection';
import RightBar from '../components/rightBar/RightBar';
import useAuthStore from '../store/authStore';

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    // 컨테이너: 세로 정렬, 너비 1440px, 높이 1024px, 배경색 흰색
    <div className="flex flex-col w-[1440px] h-[1024px] bg-white">
      {/* 컨텐츠 래퍼: 가로 정렬, 남은 공간 모두 차지 */}
      <div className="flex flex-grow">
        {/* 메인 컨텐츠 영역: 남은 가로 공간 차지, 세로 정렬, 중앙 정렬 */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <HomeSection />
        </div>
        {/* 임시 로그인 확인 (!) */}
        {!isLoggedIn && (
          // RightBar: 너비 365px, 높이 1024px, 배경색 흰색, 왼쪽 테두리, 세로 정렬, 중앙 정렬
          <RightBar className="w-[365px] h-[1024px] bg-white border-l border-[#ECECF1] flex flex-col items-center" />
        )}
      </div>
    </div>
  );
}