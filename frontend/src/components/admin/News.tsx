import { useState, useEffect } from 'react';
import { newsApi } from '../../api/news';
import type { NewsItem } from '../../api/news';
import useAuthStore from '../../store/authStore';
import Loading from '../common/Loading'; // 추가

export default function News() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [apiNewsData, setApiNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Store에서 사용자 정보 가져오기
    const { user } = useAuthStore();
    const adminId = user?.memberId; // store의 memberId 사용

    // API 데이터 fetch
    const fetchNewsData = async () => {
        if (!adminId) {
            setError('관리자 권한이 필요합니다.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await newsApi.getAllNewsList(adminId);
            if (response.isSuccess && response.result) {
                setApiNewsData(response.result);
            } else {
                setError(response.message || 'API 응답 오류');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, [adminId]); // adminId 의존성 추가

    const getStatusLabel = (status: string) => {
        switch (status) {
            case '승인 대기': return 'pending';
            case '승인': return 'approved';
            case '승인됨': return 'approved';
            case '거절': return 'rejected';
            default: return 'unknown';
        }
    };

    // 뉴스 관리 API 호출 공통 함수
    const handleNewsAction = async (newsId: number, action: 'APPROVE' | 'REJECT' | 'UNAPPROVE', actionName: string) => {
        if (!adminId) {
            setError('관리자 권한이 필요합니다.');
            return;
        }

        try {
            setActionLoading(newsId);
            const response = await newsApi.manageNews(newsId, adminId, action);

            if (response.isSuccess) {
                await fetchNewsData();
            } else {
                setError(`${actionName} 실패: ${response.message}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : `${actionName} 중 오류가 발생했습니다`);
        } finally {
            setActionLoading(null);
        }
    };

    // 뉴스 상태별 액션 처리
    const handleApprove = (newsId: number) => {
        handleNewsAction(newsId, 'APPROVE', '승인');
    };

    const handleReject = (newsId: number) => {
        handleNewsAction(newsId, 'REJECT', '거절');
    };

    const handleUnapprove = (newsId: number) => {
        handleNewsAction(newsId, 'UNAPPROVE', '승인해제');
    };

    const filteredApiNews = apiNewsData.filter(item => {
        if (item.status === '거절' || item.status === '거부' || item.status === '거부됨') {
            return false;
        }

        if (statusFilter === 'all') return true;
        const statusLabel = getStatusLabel(item.status);
        if (statusFilter === 'registered') return statusLabel === 'approved';
        if (statusFilter === 'unregistered') return statusLabel === 'pending' || statusLabel === 'rejected';
        return true;
    });

    // adminId가 없으면 에러 표시
    if (!adminId) {
        return (
            <article className="News flex-[7] ml-20 flex flex-col h-full">
                <div className="bg-white rounded-lg shadow-md my-6 p-6 flex-1">
                    <div className="text-center text-red-500 py-8">
                        관리자 권한이 필요합니다.
                    </div>
                </div>
            </article>
        );
    }

    // 로딩 중일 때
    if (loading) {
        return (
            <article className="News flex-[7] flex flex-col h-full">
                <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-full flex flex-col">
                    <Loading 
                        message="뉴스 목록을 불러오는 중..." 
                        fullScreen={false}
                        size="md"
                    />
                </div>
            </article>
        );
    }

    return (
        <article className="News flex-[7] flex flex-col h-full">
            <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-full flex flex-col">
                {/* 필터 */}
                <div className="flex justify-end mb-4 p-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setStatusFilter('registered')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'registered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            등록
                        </button>
                        <button
                            onClick={() => setStatusFilter('unregistered')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'unregistered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            미등록
                        </button>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {/* 헤더 */}
                <figure className="flex p-3 border-b-2 border-gray-400 mb-2">
                    <span className="font-bold text-sm pr-4 lg:w-1/2 w-3/5">기사제목</span>
                    <span className="font-bold text-sm text-center lg:w-1/4 w-2/5">작성자</span>
                    <span className="font-bold text-sm text-center w-1/6 hidden xl:block">날짜</span>
                    <div className="w-24 text-center hidden xl:block">
                        <span className="font-bold text-sm">상태</span>
                    </div>
                    <div className="w-24 text-center">
                        <span className="font-bold text-sm">관리</span>
                    </div>
                </figure>

                {/* 뉴스 목록 */}
                <div className="flex-1 overflow-y-auto">
                    {filteredApiNews.map((item, index) => (
                        <figure key={index} className="flex p-3 border-b border-gray-300 last:border-b-0 items-center hover:bg-gray-50 transition-colors">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium w-1/2 truncate pr-4 text-gray-600 hover:text-blue-800 hover:underline cursor-pointer"
                                title={item.title}
                            >
                                {item.title}
                            </a>
                            <span className="text-gray-600 w-1/4 text-sm text-center">{item.expert}</span>
                            <span className="text-gray-600 w-1/6 text-sm text-center hidden xl:block">{item.date}</span>
                            {/* 상태 표시 */}
                            <div className="w-24 gap-1 justify-center hidden xl:flex">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === '승인' ? 'bg-green-100 text-green-700' :
                                    item.status === '승인 대기' ? 'bg-yellow-100 text-yellow-700' :
                                        item.status === '거절' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            {/* 관리 버튼 */}
                            <div className="w-24 flex gap-1 justify-center">
                                <div className="flex gap-1">
                                    {/* 승인 대기 상태: 승인/거절 버튼 */}
                                    {item.status === '승인 대기' && (
                                        <>
                                            {item.canApprove && (
                                                <button
                                                    onClick={() => handleApprove(item.newsId)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 px-1 disabled:text-gray-400"
                                                    disabled={actionLoading !== null}
                                                >
                                                    {actionLoading === item.newsId ? '처리중...' : '승인'}
                                                </button>
                                            )}
                                            {item.canReject && (
                                                <button
                                                    onClick={() => handleReject(item.newsId)}
                                                    className="text-xs text-red-600 hover:text-red-800 px-1 disabled:text-gray-400"
                                                    disabled={actionLoading !== null}
                                                >
                                                    {actionLoading === item.newsId ? '처리중...' : '거절'}
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* 승인 상태: 승인해제 버튼 */}
                                    {item.status === '승인됨' && (
                                        <>
                                            {item.canUnapprove && (
                                                <button
                                                    onClick={() => handleUnapprove(item.newsId)}
                                                    className="text-xs text-orange-600 hover:text-orange-800 px-1 disabled:text-gray-400"
                                                    disabled={actionLoading !== null}
                                                >
                                                    {actionLoading === item.newsId ? '처리중...' : '승인해제'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </figure>
                    ))}

                    {/* 필터 결과가 없을 때 */}
                    {filteredApiNews.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            해당 상태의 뉴스가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}