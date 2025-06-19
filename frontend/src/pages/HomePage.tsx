// frontend/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import HomeCard from '../components/home/HomeCard';
import CommonButton from '../components/common/CommonButton';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const [phase, setPhase] = useState(2);  // 1: 초기화면, 2: 애니메이션 후

  const isAdmin = user?.role === 'ADMIN';
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleNewChat = () => {
    if (isLoggedIn && !isAdmin) {
      navigate('/conversation');
    } else if (!isLoggedIn) {
      navigate('/join');
    } else {
      navigate('/admin');
    }
  };

  const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>`;

  useEffect(() => {
    // 비로그인 사용자는 항상 온보딩 표시
    if (!isLoggedIn) {
      setShowOnboarding(true);
      setPhase(1);
      const timer = setTimeout(() => {
        setPhase(2);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // 로그인 사용자는 온보딩을 본 적이 있는지 확인
      const hasSeenOnboarding = sessionStorage.getItem('hasSeenOnboarding');
      
      if (!hasSeenOnboarding) {
        // 처음 방문이면 온보딩 화면 표시
        setShowOnboarding(true);
        setPhase(1);
        const timer = setTimeout(() => {
          setPhase(2);
          sessionStorage.setItem('hasSeenOnboarding', 'true');
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // 이미 온보딩을 본 경우
        setShowOnboarding(false);
        setPhase(2);
      }
    }
  }, [isLoggedIn]);

  const buttonText = isAdmin
    ? '관리자 페이지로 이동'
    : isLoggedIn
      ? '새로운 채팅 시작하기'
      : '커리어 여정 시작하기';

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* 제목 + 인트로 메시지 */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out text-center z-10"
        style={{
          transform: `translate(-50%, ${phase === 1 ? '-50%' : '-100%'})`, // 중앙 → 살짝 위로
        }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            G Navi
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full opacity-70"></div>
        </div>
        <div className="mb-8">
          <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-2">
            커리어 성장 여정을 함께할 지나비입니다.
          </p>
          <p className="text-gray-600 text-base">
            AI와 함께하는 개인 맞춤형 커리어 컨설팅
          </p>
        </div>
      </div>

      {/* 기능 카드 영역 - 1화면에서만 표시 */}
      {phase === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mt-40">
            {/* 카드 1 */}
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm text-center">AI 분석</h3>
              <p className="text-xs text-gray-600 text-center">개인 역량을 분석하여 최적의 방향을 제시합니다</p>
            </div>

            {/* 카드 2 */}
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm text-center">맞춤 전략</h3>
              <p className="text-xs text-gray-600 text-center">개인목표에 맞는 구체적인 성장 전략을 수립합니다</p>
            </div>

            {/* 카드 3 */}
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm text-center">지속 관리</h3>
              <p className="text-xs text-gray-600 text-center">장기적인 커리어 여정을 관리하고 지원합니다</p>
            </div>
          </div>
        </div>
      )}

      {/* 메인 버튼과 뉴스 카드를 담는 컨테이너 */}
      {phase === 2 && (
        <div className="flex flex-col items-center justify-center h-full pt-60">
          {/* 메인 버튼 */}
          <div className="animate-fade-in-up">
            <CommonButton
              type="button"
              onClick={handleNewChat}
              icon={arrowIcon}
            >
              {buttonText}
            </CommonButton>
          </div>

          {/* 뉴스 카드 */}
          <div className="w-full max-w-6xl animate-slide-up">
            <HomeCard />
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(2rem);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(2rem);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out 0.3s forwards;
            opacity: 0;
          }

          .animate-slide-up {
            animation: slideUp 1s ease-out 0.8s forwards;
            opacity: 0;
          }
        `}
      </style>
    </div>
  );
}