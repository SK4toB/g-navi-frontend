// frontend/src/components/layout/SideBar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import useAuthStore from '../../store/authStore';
import { authApi } from '../../api/auth';
import { newsApi, type NewsItem } from '../../api/news';
import { conversationApi } from '../../api/conversation';

export default function SideBar() {
  const { user, homeInfo } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChatListOpen, setIsChatListOpen] = React.useState(true); // 최근 대화 목록 상태
  const [isNewsListOpen, setIsNewsListOpen] = React.useState(true); // 뉴스 관리 목록 상태
  const [pendingNews, setPendingNews] = React.useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<number | null>(null);
  const [deletingChatId, setDeletingChatId] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인을 위해 추가

  const isAdmin = user?.role === 'ADMIN';
  const isExpert = user?.role === 'EXPERT';
  const isUser = user?.role === 'USER';

  // 현재 경로에 따른 활성 상태 확인 함수
  const isActivePage = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/conversation') {
      return location.pathname.startsWith('/conversation');
    }
    return location.pathname === path;
  };

  // 활성 페이지일 때 적용할 배경 스타일
  const getActiveStyle = (path: string) => {
    return isActivePage(path) ? 'bg-[#FEEDE8]' : 'bg-transparent hover:bg-gray-100';
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 네비게이션 핸들러 - 중복 제거를 위한 공통 함수
  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  // 대화 삭제 함수
  const handleDeleteChat = async (conversationId: string, chatTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 네비게이션 이벤트 방지

    if (!window.confirm(`"${chatTitle}" 대화를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeletingChatId(conversationId);
      const response = await conversationApi.deleteConversation(conversationId);

      if (response.isSuccess) {
        // 홈 정보 새로고침으로 대화 목록 업데이트
        await refreshHomeInfo();
        console.log(`대화 "${chatTitle}" 삭제 완료`);
      } else {
        alert(`대화 삭제 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('대화 삭제 중 오류:', error);
      alert('대화 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingChatId(null);
    }
  };

  // 홈 정보 새로고침 함수
  const refreshHomeInfo = async () => {
    if (!user) return;

    try {
      const response = await authApi.getHomeInfo();
      if (response.isSuccess) {
        useAuthStore.getState().setHomeInfo(response.result);
      }
    } catch (error) {
      console.error('홈 정보 새로고침 실패:', error);
    }
  };

  // messageCount가 1인 대화 자동 삭제 함수
  const autoDeleteEmptyChats = async () => {
    if (!homeInfo?.recentChats) return;

    const currentPath = window.location.pathname;
    const currentConversationId = currentPath.includes('/conversation/') ?
      currentPath.split('/conversation/')[1] : null;

    const emptyChats = homeInfo.recentChats.filter(chat =>
      chat.messageCount === 1 &&
      chat.conversationId !== currentConversationId // 현재 보고 있는 대화는 제외
    );

    for (const chat of emptyChats) {
      try {
        await conversationApi.deleteConversation(chat.conversationId);
        console.log(`빈 대화 "${chat.title}" 자동 삭제`);
      } catch (error) {
        console.error(`빈 대화 삭제 실패: ${chat.conversationId}`, error);
      }
    }

    // 삭제 후 홈 정보 새로고침
    if (emptyChats.length > 0) {
      await refreshHomeInfo();
    }
  };

  // 승인 대기 뉴스 가져오기 (ADMIN만)
  const fetchPendingNews = async () => {
    if (!isAdmin || !user?.memberId) return;

    setLoadingNews(true);
    try {
      const response = await newsApi.getAllNewsList(user.memberId);
      if (response.isSuccess && response.result) {
        // 승인 대기 상태인 뉴스만 필터링
        const pending = response.result.filter(news =>
          news.status === '승인 대기' && news.canApprove
        );
        setPendingNews(pending);
      }
    } catch (error) {
      console.error('뉴스 목록 조회 실패:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  // SideBar가 열릴 때마다 새로고침
  React.useEffect(() => {
    if (isOpen && user) {
      if (!isAdmin) {
        // 일반 사용자/전문가는 홈 정보 새로고침 및 빈 대화 자동 삭제
        authApi.getHomeInfo().then((response) => {
          if (response.isSuccess) {
            useAuthStore.getState().setHomeInfo(response.result);
            // 홈 정보 업데이트 후 빈 대화 자동 삭제
            autoDeleteEmptyChats();
          }
        });
      } else {
        // 관리자는 승인 대기 뉴스 조회
        fetchPendingNews();
      }
    }
  }, [isOpen, user, isAdmin]);

  // 뉴스 승인/승인해제/거절 처리
  const handleNewsAction = async (newsId: number, action: 'APPROVE' | 'UNAPPROVE' | 'REJECT', newsTitle: string) => {
    if (!isAdmin || !user?.memberId) return;

    try {
      setActionLoading(newsId);
      const response = await newsApi.manageNews(newsId, user.memberId, action);

      if (response.isSuccess) {
        // 성공 시 목록에서 제거
        setPendingNews(prev => prev.filter(news => news.newsId !== newsId));

        const actionText = action === 'APPROVE' ? '승인' : action === 'REJECT' ? '거절' : '승인해제';
        console.log(`"${newsTitle}" ${actionText} 완료`);
      } else {
        alert(`뉴스 ${action === 'APPROVE' ? '승인' : action === 'REJECT' ? '거절' : '승인해제'} 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('뉴스 관리 중 오류:', error);
      alert(`뉴스 ${action === 'APPROVE' ? '승인' : action === 'REJECT' ? '거절' : '승인해제'} 중 오류가 발생했습니다.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // 대화 목록 정렬 (lastUpdated 기준 내림차순)
  const sortedRecentChats = React.useMemo(() => {
    if (!homeInfo?.recentChats) return [];

    return [...homeInfo.recentChats]
      .filter(chat => chat.messageCount > 1) // messageCount가 1인 것은 제외 (자동 삭제됨)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [homeInfo?.recentChats]);

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
          <div className="flex items-center gap-2 relative group">
            {/* 레벨 표시 - 이름 왼쪽에 */}
            {homeInfo?.level && (
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-medium">
                {homeInfo.level}
              </span>
            )}

            {/* 사용자 이름 */}
            <div
              className={`font-bold text-[20px] text-text-primary transition-colors ${!isAdmin ? 'cursor-pointer underline hover:text-blue-600' : ''}`}
              onClick={!isAdmin ? () => handleNavigation('/mypage') : undefined}
              title={!isAdmin ? "마이페이지" : undefined}
            >
              {user?.name}
            </div>

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
          {/* 홈 버튼 - 모든 사용자 */}
          <div className="flex justify-center p-[12px]">
            <button
              onClick={() => handleNavigation('/')}
              className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/')}`}
              title="홈"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>

              <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                홈
              </div>
            </button>
          </div>
          {/* 마이페이지 버튼 - USER, EXPERT만 */}
          {(isUser || isExpert) && (
            <div className="flex justify-center p-[12px]">
              <button
                onClick={() => handleNavigation('/mypage')}
                className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/mypage')}`}
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
                onClick={() => handleNavigation('/conversation')}
                className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/conversation')}`}
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
                onClick={() => handleNavigation('/expert')}
                className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/expert')}`}
                title="카드 뉴스 신청 페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                </svg>
                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  카드 뉴스 신청 페이지
                </div>
              </button>
            </div>
          )}

          {/* 대시보드 버튼 - ADMIN만 */}
          {isAdmin && (
            <div className="flex justify-center p-[12px]">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/dashboard')}`}
                title="대시보드"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>

                <div className="absolute right-12 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  대시보드
                </div>
              </button>
            </div>
          )}

          {/* 관리자 페이지 버튼 - ADMIN만 */}
          {isAdmin && (
            <div className="flex justify-center p-[12px]">
              <button
                onClick={() => handleNavigation('/admin')}
                className={`w-[40px] h-[40px] flex items-center justify-center p-0 border-none cursor-pointer rounded-full transition-colors relative group ${getActiveStyle('/admin')}`}
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

      {/* 대화 목록 영역 - USER, EXPERT만 */}
      {(isUser || isExpert) && (
        <div
          className={`
            flex-1 flex flex-col overflow-hidden
            transition-opacity duration-300 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* 최근 대화 헤더 - 최근 대화 텍스트와 새 채팅 아이콘 */}
          <div className="flex flex-row justify-between items-center p-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="font-bold text-[18px] text-text-primary">최근 대화</div>
              <button
                onClick={() => setIsChatListOpen(!isChatListOpen)}
                className="w-[24px] h-[24px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                title={isChatListOpen ? "목록 접기" : "목록 펼치기"}
              >
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isChatListOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => handleNavigation('/conversation')}
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
          {isChatListOpen && (
            <div className="flex-1 overflow-y-auto px-[24px] transition-all duration-300 ease-in-out">
              {sortedRecentChats.map((recentChat) => (
                <div
                  key={recentChat.conversationId || 'new-chat'}
                  className="py-[16px] border-b border-[#E2E8F0] cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors flex items-center justify-between group"
                  onClick={() => handleNavigation(`/conversation/${recentChat.conversationId}`)}
                >
                  <div className="text-[16px] text-text-primary flex-1 truncate pr-2">
                    {recentChat.title}
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => handleDeleteChat(recentChat.conversationId, recentChat.title, e)}
                    disabled={deletingChatId === recentChat.conversationId}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 disabled:opacity-50"
                    title="대화 삭제"
                  >
                    {deletingChatId === recentChat.conversationId ? (
                      <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}

              {/* 대화 목록이 없으면 기본 메시지 */}
              {(!homeInfo?.recentChats || homeInfo.recentChats.length === 0) && (
                <div className="mt-[20px] text-gray-500 text-center">
                  아직 대화가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 뉴스 관리 영역 - ADMIN만 */}
      {isAdmin && (
        <div
          className={`
            flex-1 flex flex-col overflow-hidden
            transition-opacity duration-300 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* 뉴스 관리 헤더 */}
          <div className="flex flex-row justify-between items-center p-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="font-bold text-[18px] text-text-primary">뉴스 관리</div>
              <button
                onClick={() => setIsNewsListOpen(!isNewsListOpen)}
                className="w-[24px] h-[24px] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                title={isNewsListOpen ? "목록 접기" : "목록 펼치기"}
              >
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isNewsListOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 승인 대기 개수 표시 */}
            <div className="flex items-center gap-2">
              {loadingNews ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <span className={`text-sm px-2 py-1 rounded-full ${pendingNews.length > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {pendingNews.length}
                </span>
              )}
            </div>
          </div>

          {/* 승인 대기 뉴스 목록 */}
          {isNewsListOpen && (
            <div className="flex-1 overflow-y-auto px-[24px] transition-all duration-300 ease-in-out">
              {pendingNews.length > 0 ? (
                pendingNews.map((news) => (
                  <div
                    key={news.newsId}
                    className="py-[16px] border-b border-[#E2E8F0] transition-colors"
                  >
                    <div className="mb-2">
                      <div className="text-[14px] text-text-primary font-medium truncate" title={news.title}>
                        {news.title}
                      </div>
                      <div className="text-[12px] text-gray-500 mt-1">
                        작성자: {news.expert}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        날짜: {news.date}
                      </div>
                    </div>

                    {/* 승인/거절 버튼 */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleNewsAction(news.newsId, 'APPROVE', news.title)}
                        disabled={actionLoading === news.newsId}
                        className="flex-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === news.newsId ? '처리중...' : '승인'}
                      </button>
                      <button
                        onClick={() => handleNewsAction(news.newsId, 'REJECT', news.title)}
                        disabled={actionLoading === news.newsId}
                        className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-[20px] text-gray-500 text-center text-sm">
                  {loadingNews ? '뉴스를 불러오는 중...' : '승인 대기 중인 뉴스가 없습니다.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ADMIN이 아닌 경우나 닫혔을 때 flex-1로 공간을 채워서 로그아웃 버튼을 하단으로 밀어냄 */}
      {(!isAdmin || !isOpen) && <div className="flex-1"></div>}

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