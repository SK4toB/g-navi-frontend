// frontend/src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTitle from '../components/common/CommonTitle';
import CommonButton from '../components/common/CommonButton';
import useAuthStore from '../store/authStore';
import HomeCard from '../components/home/HomeCard';

export default function HomePage() {
  const navigate = useNavigate();
  const IntroMessage = "커리어 성장 여정을 함께할 지나비입니다.";
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>`;

  React.useEffect(() => {

  }, []);

  const handleNewChat = () => {
    if (isLoggedIn) {
      navigate('/conversation');
    } else {
      navigate('/join');
    }
  };

  const handleMyPage = () => {
    if (isLoggedIn) {
      navigate('/myPage');
    } else {
      navigate('/join');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <CommonTitle>G Navi</CommonTitle>
      <div className='mt-[50px]'></div>
      <p className="font-bold text-[24px] text-main-color">
        {IntroMessage}
      </p>
      <div className="mt-[30px]"></div>
      <CommonButton
        type="button"
        onClick={handleNewChat}
        icon={arrowIcon}
      >
        {'새로운 채팅 시작하기'}
      </CommonButton>
      <HomeCard />
      {/* <div className="mt-[20px]"></div> */}
      {/* <CommonButton
        type="button"
        onClick={handleMyPage}
      >
        {'내 정보 확인하기'}
      </CommonButton> */}
    </div>
  );
}