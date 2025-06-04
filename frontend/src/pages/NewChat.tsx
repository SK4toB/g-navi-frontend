import NewChatSection from '../components/newChat/NewChatSection';
import RightBar from '../components/home/RightBar';
import useAuthStore from '../store/authStore';

export default function NewChat() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="flex">
      <div className="flex-grow">
        <NewChatSection />
      </div>
      {!isLoggedIn && (
        <RightBar />
      )}
    </div>
  );
}