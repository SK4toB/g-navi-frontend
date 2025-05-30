import { useNavigate } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import Button from '../common/Button'; // Button 컴포넌트 임포트
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
    // HomeSection 컨테이너: 너비 1071px, 높이 1024px, 세로 정렬, 아이템 중앙 정렬, 내용 중앙 정렬
    <div className="w-[1071px] h-[1024px] flex flex-col items-center justify-center">
      {/* 페이지 제목 (G Navi): Pretendard 폰트, 굵게, 50px 크기, 줄 간격 0.48em, 글자 간격 -0.8%, 글자색 #122250, 중앙 정렬, 너비/높이 auto, 하단 마진 210px */}
      <PageTitle className="font-pretendard font-bold text-[50px] leading-[0.48em] tracking-[-0.8%] text-[#122250] text-center w-auto h-auto mb-210">G Navi</PageTitle>

      {/* 인사말 텍스트: Pretendard 폰트, 굵게, 30px 크기, 줄 간격 0.8em, 글자 간격 -0.8%, 글자색 #636363, 중앙 정렬, 하단 마진 111px */}
      <p className="font-pretendard font-bold text-[30px] leading-[0.8em] tracking-[-0.8%] text-[#636363] text-center mb-[111px]">
        안녕하세요, 커리어 성장 여정을 함께할 지나비입니다.
      </p>

      {/* 단일 버튼 */}
      {/* 버튼: Pretendard 폰트, 18px 크기, 줄 간격 1.11em, 글자 간격 -0.6%, 텍스트 왼쪽 정렬, 왼쪽 패딩 40px, flex, 아이템 시작점에 정렬, 아이템 중앙 정렬 */}
      <Button
        onClick={handleNewChat}
        className="font-pretendard text-[18px] leading-[1.11em] tracking-[-0.6%] text-left pl-[40px] flex justify-start items-center"
      >
        {'새로운 채팅 시작하기'}
        {/* 아이콘 자리 - SVG 컴포넌트로 분리하여 여기에 삽입 가능 */}
      </Button>
    </div>
  );
}