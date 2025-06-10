// frontend/src/components/layout/RightBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';

export default function RightBar() {
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();

  // 스토어에서 데이터 가져오기
  const { chatSummaries, isLoading, loadChatSummaries } = useChatStore();
  const { memberId } = useAuthStore();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 채팅방 클릭 핸들러
  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // 컴포넌트 마운트 시 채팅 목록 로드
  React.useEffect(() => {
    if (isOpen && memberId) {
      loadChatSummaries();
    }
  }, [isOpen, memberId, loadChatSummaries]);

  // 사용자 프로필 정보 (임시)
  const userProfile = {
    name: '하니',
    avatar: '/src/assets/avatar.png',
  };

  // 요약 텍스트 길이 제한 함수
  const truncateSummary = (summary: string, maxLength: number = 30) => {
    return summary.length > maxLength ? `${summary.slice(0, maxLength)}...` : summary;
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    }
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
        
        {isOpen && (
          <div className="flex flex-row items-center gap-[12px] p-[12px]">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center relative">
              <img 
                src={userProfile.avatar} 
                alt="User Avatar" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 아바타 표시
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* 기본 아바타 (이미지 로드 실패 시) */}
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                {userProfile.name.charAt(0)}
              </div>
            </div>
            <div className="font-bold text-[24px] text-[#1E293B]">
              {userProfile.name}
            </div>
          </div>
        )}
      </div>

      {/* 채팅 목록 영역 */}
      {isOpen && (
        <>
          <div className="flex flex-col flex-1">
            <div className="
              flex flex-row items-center justify-between p-[24px]
              border-b border-[#E2E8F0]
            ">
              <div className="font-bold text-[24px] text-[#1E293B]">최근 대화</div>
              {/* 새로고침 버튼 */}
              <button
                onClick={loadChatSummaries}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                title="채팅 목록 새로고침"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                >
                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* 채팅 목록 */}
            <div className="flex flex-col px-[24px] overflow-y-auto flex-1">
              {isLoading ? (
                // 로딩 상태
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                  <span className="ml-2">로딩 중...</span>
                </div>
              ) : chatSummaries.length === 0 ? (
                // 채팅이 없는 경우
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">아직 대화가 없습니다</p>
                  <p className="text-xs mt-1">새로운 채팅을 시작해보세요!</p>
                </div>
              ) : (
                // 채팅 목록 표시
                chatSummaries.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="py-[16px] border-b border-[#E2E8F0] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className="flex flex-col">
                      <div className="text-[16px] text-[#1E293B] font-medium mb-1">
                        {truncateSummary(chat.summary || '새로운 대화')}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-gray-500">
                          메시지 {chat.messageCount}개
                        </span>
                        <span className="text-[12px] text-gray-400">
                          {formatDate(chat.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}