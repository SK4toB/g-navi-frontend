import HomeSection from '../components/home/HomeSection';
import RightBar from '../components/myPage/RightBar';
import useAuthStore from '../store/authStore';

export default function Home() {
  // 로그인 상태 확인
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-[1440px] h-[1024px] bg-white">
      {/* 컨텐츠 래퍼: 가로 정렬 */}
      <div className="flex">
        {/* 메인 컨텐츠 영역: 남은 가로 공간 차지 */}
        <div className="flex-grow">
          <HomeSection />
        </div>
        {/* 임시 로그인 확인 (!) */}
        {!isLoggedIn && (
          <RightBar />
        )}
      </div>
    </div>
  );
}