import HomeSection from '../components/home/HomeSection';
import RightBar from '../components/home/RightBar';
import useAuthStore from '../store/authStore';

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
      <div className="flex">
        <div className="flex-grow">
          <HomeSection />
        </div>
        {!isLoggedIn && (
          <RightBar />
        )}
      </div>
  );
}