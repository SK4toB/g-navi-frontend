import HomeSection from '../components/home/HomeSection';
import RightBar from '../components/home/RightBar';
import useAuthStore from '../store/authStore';

export default function Home() {
  // 로그인 상태 확인
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="w-[1440px] h-[1024px] bg-white">
      <div className="flex">
        <div className="flex-grow">
          <HomeSection />
        </div>
        {!isLoggedIn && (
          <RightBar />
        )}
      </div>
    </div>
  );
}