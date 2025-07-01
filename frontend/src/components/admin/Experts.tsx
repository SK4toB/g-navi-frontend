import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import type { Member } from '../../api/admin';
import useAuthStore from '../../store/authStore';
import Loading from '../common/Loading';

export default function Experts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [selectedDomains, setSelectedDomains] = useState<Record<number, string>>({});
    const [domainFilter, setDomainFilter] = useState<string>('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const { user } = useAuthStore();
    const adminId = user?.memberId;

    const domainOptions = [
        { label: '금융', value: 'FINANCE' },
        { label: '제조', value: 'MANUFACTURE' },
        { label: '반도체', value: 'SEMICONDUCTOR' },
        { label: 'AI', value: 'AI' }
    ];

    const fetchMembers = async () => {
        if (!adminId) {
            setError('관리자 권한이 필요합니다.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getAllMembers(adminId);
            console.log(response.result)

            if (response.isSuccess && response.result) {
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
    }, [adminId]);

    const currentExperts = allMembers.filter(member => {
        const isExpert = member.role === 'EXPERT' || member.isExpert;
        if (!isExpert) return false;
        
        if (domainFilter === 'all') return true;
        return member.expertiseArea === domainFilter;
    });

    const searchResults = allMembers.filter(member =>
        member.role === 'USER' &&
        !member.isExpert &&
        member.name.includes(searchTerm) &&
        searchTerm.trim() !== ''
    );

    const handleRegisterExpert = async (memberId: number, memberName: string) => {
        const selectedDomain = selectedDomains[memberId];
        
        if (!selectedDomain) {
            alert('도메인을 선택해주세요.');
            return;
        }

        if (!adminId) {
            setError('관리자 권한이 필요합니다.');
            return;
        }

        try {
            setActionLoading(memberId);

            console.log('전문가 등록 요청:', {
                memberId,
                newRole: 'EXPERT',
                expertiseArea: selectedDomain
            });

            const response = await adminApi.updateMemberRole(adminId, {
                memberId,
                newRole: 'EXPERT',
                expertiseArea: selectedDomain as 'FINANCE' | 'MANUFACTURE' | 'SEMICONDUCTOR' | 'AI'
            });

            if (response.isSuccess) {
                setSelectedDomains(prev => {
                    const newState = { ...prev };
                    delete newState[memberId];
                    return newState;
                });
                
                await fetchMembers();
                setSearchTerm('');
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

    const handleRemoveExpert = async (memberId: number, memberName: string) => {
        if (!window.confirm(`${memberName}님을 전문가에서 해제하시겠습니까?`)) {
            return;
        }

        try {
            setActionLoading(memberId);

            const response = await adminApi.updateMemberRole(adminId!, {
                memberId,
                newRole: 'USER',
                expertiseArea: 'FINANCE'
            });

            if (response.isSuccess) {
                await fetchMembers();
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

    if (!adminId) {
        return (
            <article className="Expert flex-[3] flex flex-col h-full">
                <figure className="bg-white rounded-lg shadow-md my-6 p-6 flex-1">
                    <div className="text-center text-red-500 py-8">
                        관리자 권한이 필요합니다.
                    </div>
                </figure>
            </article>
        );
    }

    if (loading) {
        return (
            <article className="Expert flex-[3] flex flex-col h-full">
                <figure className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-full flex flex-col">
                    <Loading message="전문가 목록을 불러오는 중..." fullScreen={false} size="md" />
                </figure>
            </article>
        );
    }

    return (
        <article className="Expert flex-[3] flex flex-col h-full">
            <figure className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 h-full flex flex-col">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="이름을 검색하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                {/* 검색 결과 */}
                {searchTerm && (
                    <div className="mb-4">
                        {searchResults.length > 0 ? (
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 mb-2">검색 결과</div>
                                {searchResults.map((member) => (
                                    <div key={member.memberId} className="p-3 border border-gray-200 rounded flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setSelectedDomains(prev => ({
                                                        ...prev,
                                                        [`${member.memberId}_dropdown`]: !prev[`${member.memberId}_dropdown`]
                                                    }))}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500 min-w-[90px] flex items-center justify-between"
                                                >
                                                    <span>
                                                        {selectedDomains[member.memberId] 
                                                            ? domainOptions.find(d => d.value === selectedDomains[member.memberId])?.label 
                                                            : '도메인 선택'
                                                        }
                                                    </span>
                                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                
                                                {/* 도메인 선택 드롭다운 */}
                                                {selectedDomains[`${member.memberId}_dropdown`] && (
                                                    <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-[120px]">
                                                        {domainOptions.map((domain) => (
                                                            <button
                                                                key={domain.value}
                                                                onClick={() => {
                                                                    setSelectedDomains(prev => ({
                                                                        ...prev,
                                                                        [member.memberId]: domain.value,
                                                                        [`${member.memberId}_dropdown`]: false
                                                                    }));
                                                                }}
                                                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                                                                    selectedDomains[member.memberId] === domain.value ? 'bg-blue-50 text-blue-600' : ''
                                                                }`}
                                                            >
                                                                {domain.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-gray-700 font-medium">{member.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRegisterExpert(member.memberId, member.name)}
                                            disabled={actionLoading === member.memberId || !selectedDomains[member.memberId]}
                                            className={`px-3 py-1 text-xs rounded transition-colors ${
                                                actionLoading === member.memberId
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : selectedDomains[member.memberId]
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {actionLoading === member.memberId ? '처리중...' : '등록'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-4 text-sm">검색 결과가 없습니다</div>
                        )}
                    </div>
                )}

                {/* 전문가 헤더 - 고정 */}
                <div className="text-sm font-medium text-gray-700 mb-3 flex justify-between items-center">
                    <span>등록된 전문가</span>
                    <div className="flex items-center gap-2 relative">
                        <span className="text-xs text-gray-500">총 {currentExperts.length}명</span>
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        
                        {/* 필터 드롭다운 */}
                        {showFilterDropdown && (
                            <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                                <button
                                    onClick={() => {
                                        setDomainFilter('all');
                                        setShowFilterDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${domainFilter === 'all' ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                    전체
                                </button>
                                {domainOptions.map((domain) => (
                                    <button
                                        key={domain.value}
                                        onClick={() => {
                                            setDomainFilter(domain.value);
                                            setShowFilterDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${domainFilter === domain.value ? 'bg-blue-50 text-blue-600' : ''}`}
                                    >
                                        {domain.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 전문가 목록 - 스크롤 영역 */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="space-y-3">
                        {currentExperts.length > 0 ? (
                            currentExperts.map((expert) => (
                                <div key={expert.memberId} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                expert.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {expert.role === 'ADMIN' ? '관리자' : `${expert.expertiseAreaText} 전문가`}
                                            </span>
                                            <span className="font-medium">{expert.name}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            가입일: {expert.joinDate}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {expert.role !== 'ADMIN' ? (
                                            <button
                                                onClick={() => handleRemoveExpert(expert.memberId, expert.name)}
                                                className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                                                disabled={actionLoading !== null}
                                            >
                                                {actionLoading === expert.memberId ? '처리중...' : '해제'}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">변경불가</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                {domainFilter === 'all' ? '등록된 전문가가 없습니다' : `${domainOptions.find(d => d.value === domainFilter)?.label} 전문가가 없습니다`}
                            </div>
                        )}
                    </div>
                </div>
            </figure>
        </article>
    );
}