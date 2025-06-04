import { useNavigate } from 'react-router-dom';
import CommonTitle from '../common/CommonTitle';
import Button from '../common/CommonButton';
import useAuthStore from '../../store/authStore';

export default function HomeSection() {
  const navigate = useNavigate();
  const IntroMessage = "안녕하세요, 커리어 성장 여정을 함께할 지나비입니다.";
  // 로그인 여부 확인
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleNewChat = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <CommonTitle>G Navi</CommonTitle>
      <div className="h-[30%] flex flex-col items-center justify-center">
        <p className="font-bold text-[30px] text-[#636363] text-center mb-[50px]">
        {IntroMessage}
        </p>
      </div>
      <Button
        type="button"
        onClick={handleNewChat}
      >
        {'새로운 채팅 시작하기'}
      </Button>
    </div>
  );
}