// frontend/src/components/layout/SideBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { authApi } from '../../api/auth';

export default function SideBar() {
  const { user, homeInfo } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const isExpert = user?.role === 'EXPERT';
  const isUser = user?.role === 'USER';

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // SideBar가 열릴 때마다 새로고침 - ADMIN은 제외
  React.useEffect(() => {
    if (isOpen && user && !isAdmin) {
      authApi.getHomeInfo().then((response) => {
        if (response.isSuccess) {
          useAuthStore.getState().setHomeInfo(response.result);
        }
      })
    }
  }, [isOpen, user, isAdmin]);

  const handleMypage = () => {
    navigate('/mypage');
  };

  const handleNewChat = () => {
    navigate('/conversation');
  };

  const handleChatClick = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };

  const handleExpertPage = () => {
    navigate('/expert');
  };

  const handleAdminPage = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div 
      className={`
        ${isOpen ? 'w-[365px]' : 'w-[70px]'}
        border-l border-[#E2E8F0] h-full flex flex-col bg-white shadow-lg
        transition-all duration-300 ease-in-out
      `}
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% - 70px))'
      }}
    >
      
      {/* 헤더 영역 - 닫기 아이콘과 사용자 이름 */}
      <div className="flex flex-row justify-between items-center p-[12px] border-b border-[#E2E8F0]">
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

        {/* 사용자 이름 (열린 상태에서만 표시) - ADMIN은 마이페이지 링크 없음 */}
        {isOpen && (
          <div 
            className={`font-bold text-[20px] text-text-primary transition-colors relative group ${
              !isAdmin ? 'cursor-pointer underline hover:text-blue-600' : ''
            }`}
            onClick={!isAdmin ? handleMypage : undefined}
            title={!isAdmin ? "마이페이지" : undefined}
          >
            {user?.name}
            
            {/* 툴팁 - ADMIN이 아닌 경우만 */}
            {!isAdmin && (
              <div className="absolute top-0 right-20 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                마이페이지
              </div>
            )}
          </div>
        )}
      </div>

      {/* 닫혔을 때 아이콘들 */}
      {!isOpen && (
        <div className="flex flex-col">
          {/* 마이페이지 버튼 - USER, EXPERT만 */}
          {(isUser || isExpert) && (
            <div className="flex justify-center p-[12px]">
              <button 
                onClick={handleMypage}
                className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors relative group"
                title="마이페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                
                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  마이페이지
                </div>
              </button>
            </div>
          )}

          {/* 새 채팅 시작 버튼 - USER, EXPERT만 */}
          {(isUser || isExpert) && (
            <div className="flex justify-center p-[12px]">
              <button 
                onClick={handleNewChat}
                className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors relative group"
                title="새 채팅 시작"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                
                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  새 채팅 시작
                </div>
              </button>
            </div>
          )}

          {/* 전문가 뉴스 페이지 버튼 - EXPERT, ADMIN만 */}
          {(isExpert || isAdmin) && (
            <div className="flex justify-center p-[12px]">
              <button 
                onClick={handleExpertPage}
                className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors relative group"
                title="카드 뉴스 신청 페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                </svg>
                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  카드 뉴스 신청 페이지
                </div>
              </button>
            </div>
          )}

          {/* 관리자 페이지 버튼 - ADMIN만 */}
          {isAdmin && (
            <div className="flex justify-center p-[12px]">
              <button 
                onClick={handleAdminPage}
                className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors relative group"
                title="관리자 페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                
                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  관리자 페이지
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 대화 목록 영역 - ADMIN은 표시하지 않음 */}
      {!isAdmin && (
        <div 
          className={`
            flex-1 flex flex-col overflow-hidden
            transition-opacity duration-300 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* 최근 대화 헤더 - 최근 대화 텍스트와 새 채팅 아이콘 */}
          <div className="flex flex-row justify-between items-center p-4 border-b border-[#E2E8F0]">
            <div className="font-bold text-[18px] text-text-primary">최근 대화</div>
            <button
              onClick={handleNewChat}
              className="w-[40px] h-[40px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors relative group"
              title="새 채팅 시작"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              
              <div className="absolute top-1 right-20 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                새 채팅 시작
              </div>
            </button>
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
              <div className="mt-[20px] text-gray-500 text-center">
                아직 대화가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* ADMIN인 경우 flex-1로 공간을 채워서 로그아웃 버튼을 하단으로 밀어냄 */}
      {(isAdmin || !isOpen) && <div className="flex-1"></div>}
      
      {/* 로그아웃 버튼 */}
      <div className="flex flex-row items-center p-[12px]">
        <button 
          onClick={handleLogout} 
          className={`
            ${isOpen ? 'w-full flex items-center justify-start gap-3 px-3 py-2' : 'w-[40px] h-[40px] flex items-center justify-center relative group'} 
            bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors
          `}
          title={!isOpen ? "로그아웃" : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          
          {/* 열렸을 때만 텍스트 표시 */}
          {isOpen && (
            <span className="text-[16px] font-medium text-gray-700">로그아웃</span>
          )}
          
          {/* 닫혔을 때만 툴팁 표시 */}
          {!isOpen && (
            <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              로그아웃
            </div>
          )}
        </button>
      </div>

    </div>
  );
}