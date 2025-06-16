// frontend/src/components/layout/SideBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { authApi } from '../../api/auth';

export default function SideBar() {
  const { user, homeInfo } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // SideBar가 열릴 때마다 새로고침
  React.useEffect(() => {
    if (isOpen && user) {
      authApi.getHomeInfo().then((response) => {
        if (response.isSuccess) {
          useAuthStore.getState().setHomeInfo(response.result);
        }
      })
    }
  }, [isOpen, user]);

  const handleChatClick = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <div className={`
      ${isOpen ? 'w-[365px]' : 'w-[70px]'}
      border-l border-[#E2E8F0] h-full flex flex-col
    `}>
      
      {/* 헤더 영역 */}
      <div className="
        flex flex-row justify-between items-center py-[12px] px-[12px]
      ">
        <button 
          onClick={toggleOpen} 
          className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* 대화 목록 영역 */}
      {isOpen && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 사용자 이름 */}
          <div className="flex flex-row items-center fixed top-[30px] right-[12px] ">
            <div className="font-bold text-[20px] text-text-primary">
              {user?.name}
            </div>
          </div>

          {/* 최근 대화 헤더 */}
          <div className="
            flex flex-row p-[20px]
            border-t border-b border-[#E2E8F0]
          ">
            <div className="font-bold text-[18px] text-text-primary">최근 대화</div>
          </div>
          
          {/* 대화 목록 - 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto px-[24px]">
            {homeInfo?.recentChats?.map((recentChat) => (
              <div
                key={recentChat.conversationId || 'new-chat'}
                className="py-[16px] border-b border-[#E2E8F0] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                onClick={() => handleChatClick(recentChat.conversationId)}
              >
                <div className="text-[16px] text-text-primary">
                  {recentChat.title}
                </div>
              </div>
            ))}
            
            {/* 대화 목록이 없으면 기본 메시지 */}
            {(!homeInfo?.recentChats || homeInfo.recentChats.length === 0) && (
              <div className="mt-[20px]">
                아직 대화가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}