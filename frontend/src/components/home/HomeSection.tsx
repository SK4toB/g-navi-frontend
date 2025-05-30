import { useNavigate } from 'react-router-dom';
import PageTitle from '../common/CommonTitle';
import Button from '../common/CommonButton';
import useAuthStore from '../../store/authStore';

export default function HomeSection() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleNewChat = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <PageTitle>G Navi</PageTitle>

      <p className="font-pretendard font-bold text-[30px] leading-[0.8em] tracking-[-0.8%] text-[#636363] text-center mb-[111px]">
        안녕하세요, 커리어 성장 여정을 함께할 지나비입니다.
      </p>
      {/* 버튼 */}
      <Button
        type="button"
        onClick={handleNewChat}
      >
        {'새로운 채팅 시작하기'}
      </Button>
    </div>
  );
}