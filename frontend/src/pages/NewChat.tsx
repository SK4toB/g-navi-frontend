import NewChatSection from '../components/newChat/NewChatSection';
import RightBar from '../components/home/RightBar';
export default function NewChat() {
  return (
    <div className="flex">
    <div className="w-full">
    <NewChatSection />
    </div>
    <RightBar />
    </div>
  );
}