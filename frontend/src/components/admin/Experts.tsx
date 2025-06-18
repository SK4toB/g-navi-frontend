import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import type { Member } from '../../api/admin';

export default function Experts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const adminId = 1; // 현재 관리자 ID

    // 모든 회원 데이터 조회
    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getAllMembers(adminId);

            if (response.isSuccess && response.result) {
                console.log('=== 전체 회원 목록 ===');
                console.log(response.result);
                setAllMembers(response.result);
            } else {
                setError(response.message || '회원 목록 조회 실패');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원 목록 조회 중 오류 발생');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // 현재 전문가 목록
    const currentExperts = allMembers.filter(member =>
        member.role === 'EXPERT' || member.isExpert
    );

    // 검색 결과
    const searchResults = allMembers.filter(member =>
        member.role === 'USER' &&
        !member.isExpert &&
        member.name.includes(searchTerm) &&
        searchTerm.trim() !== ''
    );

    // 전문가 등록 함수 (USER -> EXPERT)
    const handleRegisterExpert = async (memberId: number, memberName: string) => {
        try {
            setActionLoading(memberId);

            const response = await adminApi.updateMemberRole(adminId, {
                memberId,
                newRole: 'EXPERT'
            });

            if (response.isSuccess) {
                console.log(`${memberName} 전문가 등록 성공`);
                await fetchMembers();   // 목록 새로고침
                setSearchTerm('');      // 검색창 초기화
                alert(`${memberName}님이 전문가로 등록되었습니다.`);
            } else {
                setError(`전문가 등록 실패: ${response.message}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '전문가 등록 중 오류 발생');
        } finally {
            setActionLoading(null);
        }
    };

    // 전문가 삭제 함수 (EXPERT -> USER)
    const handleRemoveExpert = async (memberId: number, memberName: string) => {
        if (!window.confirm(`${memberName}님을 전문가에서 해제하시겠습니까?`)) {
            return;
        }

        try {
            setActionLoading(memberId);

            const response = await adminApi.updateMemberRole(adminId, {
                memberId,
                newRole: 'USER'
            });

            if (response.isSuccess) {
                console.log(`${memberName} 전문가 해제 성공`);
                await fetchMembers(); // 목록 새로고침
                alert(`${memberName}님이 일반 회원으로 변경되었습니다.`);
            } else {
                setError(`전문가 해제 실패: ${response.message}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '전문가 해제 중 오류 발생');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <article className="Expert flex-[3] mr-20 flex flex-col h-full">
            <figure className="bg-white rounded-lg shadow-md my-6 p-6 flex-1">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="이름을 검색하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
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

                {/* 검색 결과 (USER 역할인 사람들) */}
                {searchTerm && (
                    <div className="mb-4">
                        {searchResults.length > 0 ? (
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 mb-2">검색 결과 (클릭하여 전문가로 등록)</div>
                                {searchResults.map((member) => (
                                    <div
                                        key={member.memberId}
                                        onClick={() => actionLoading === null && handleRegisterExpert(member.memberId, member.name)}
                                        className={`p-2 bg-yellow-50 border border-yellow-200 rounded transition-colors flex justify-between items-center ${actionLoading === null ? 'cursor-pointer hover:bg-yellow-100' : 'cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-gray-700 font-medium">{member.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">({member.email})</span>
                                        </div>
                                        {actionLoading === member.memberId ? (
                                            <span className="text-xs text-gray-500">처리중...</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">[클릭하여 등록]</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : searchTerm.trim() !== '' ? (
                            <div className="text-center text-gray-500 py-4 text-sm">
                                검색 결과가 없습니다
                            </div>
                        ) : null}
                    </div>
                )}

                {/* 현재 전문가 목록 */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 mb-2 flex justify-between">
                        <span>등록된 전문가</span>
                        <span className="text-xs text-gray-500">총 {currentExperts.length}명</span>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 py-8">
                            전문가 목록을 불러오는 중...
                        </div>
                    ) : currentExperts.length > 0 ? (
                        currentExperts.map((expert) => (
                            <div key={expert.memberId} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <span className={`text-xs px-1 py-1 rounded ${expert.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            expert.role === 'EXPERT' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {expert.role === 'ADMIN' ? '관리자' :
                                                expert.role === 'EXPERT' ? '전문가' : '일반회원'}
                                        </span>
                                        <span className="font-medium">{expert.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        가입일: {expert.joinDate}
                                    </div>
                                    <div className="text-xs mt-1">

                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* 관리자는 삭제 불가 */}
                                    {expert.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => handleRemoveExpert(expert.memberId, expert.name)}
                                            className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                                            disabled={actionLoading !== null}
                                        >
                                            {actionLoading === expert.memberId ? '처리중...' : '해제'}
                                        </button>
                                    )}
                                    {expert.role === 'ADMIN' && (
                                        <span className="text-xs text-gray-400">변경불가</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            등록된 전문가가 없습니다
                        </div>
                    )}
                </div>

                {/* 새로고침 버튼 */}
                <div className="mt-6 text-center">
                    <button
                        onClick={fetchMembers}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        disabled={loading}
                    >
                        {loading ? '불러오는 중...' : '목록 새로고침'}
                    </button>
                </div>
            </figure>
        </article>
    );
}