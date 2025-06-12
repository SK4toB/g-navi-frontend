// frontend/src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTitle from '../components/common/CommonTitle';
import CommonButton from '../components/common/CommonButton';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  const navigate = useNavigate();
  const IntroMessage = "안녕하세요, 커리어 성장 여정을 함께할 지나비입니다.";
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  React.useEffect(() => {
    
  }, []);

  const handleNewChat = () => {
    if (isLoggedIn) {
      navigate('/conversation');
    } else {
      navigate('/join');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <CommonTitle>G Navi</CommonTitle>
      <div className='mt-[100px]'></div>
        <p className="font-bold text-[30px] text-main-color">
        {IntroMessage}
        </p>
      <div className="mt-[50px]"></div>
      <CommonButton
        type="button"
        onClick={handleNewChat}
      >
        {'새로운 채팅 시작하기'}
      </CommonButton>
    </div>
  );
}