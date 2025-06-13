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
      border-l border-[#E2E8F0] h-[1024px] flex flex-col
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
        <>
          <div className="flex flex-row items-center gap-[12px] p-[12px]">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center bg-gray-200 text-gray-500 text-lg font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="font-bold text-[24px] text-[#1E293B]">
              {user?.name || '사용자'}
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="
              flex flex-row items-center justify-center p-[24px]
              border-b border-[#E2E8F0]
            ">
              <div className="font-bold text-[24px] text-[#1E293B]">최근 대화</div>
            </div>
            
            {/* 대화 목록 */}
            <div className="flex flex-col px-[24px] overflow-y-auto flex-1">
              {homeInfo?.recentChats?.map((recentChat) => (
                <div
                  key={recentChat.conversationId || 'new-chat'}
                  className="py-[16px] border-b border-[#E2E8F0] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  onClick={() => {
                    if (recentChat.conversationId) {
                      navigate(`/conversation/${recentChat.conversationId}`);
                    } else {
                      navigate('/conversation');
                    }
                  }}
                >
                  <div className="text-[16px] text-[#1E293B] font-medium">
                    {recentChat.title}
                  </div>
                </div>
              ))}
              
              {/* 대화 목록이 없을 때 - 전역 데이터가 있으면 표시, 없으면 기본 메시지 */}
              {(!homeInfo?.recentChats || homeInfo.recentChats.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  아직 대화가 없습니다
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}