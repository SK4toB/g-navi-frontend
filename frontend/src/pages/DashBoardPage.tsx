import { useEffect, useState } from 'react';
import { adminApi, type DashboardData, type LevelSkillStatistics } from "../api/admin"
import useAuthStore from '../store/authStore';
import StatsCards from '../components/admin/dashboard/StatsCards';
import LevelCharts from '../components/admin/dashboard/LevelCharts';
import ChatCharts from '../components/admin/dashboard/ChatCharts';
import SkillCharts from '../components/admin/dashboard/SkillCharts';
import WordCloudCharts from '../components/admin/dashboard/WordCloudCharts';
import Loading from '../components/common/Loading';

type TabType = 'user-analysis' | 'skill-analysis' | 'wordcloud-analysis';

export default function DashBoardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [skillData, setSkillData] = useState<LevelSkillStatistics | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('user-analysis');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();
    const adminId = user?.memberId;

    useEffect(() => {
        const fetchData = async () => {
            if (!adminId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 대시보드 데이터와 스킬 데이터를 병렬로 가져오기
                const [dashboardResponse, skillResponse] = await Promise.all([
                    adminApi.getDashboardData(adminId),
                    adminApi.getLevelSkills(adminId)
                ]);

                setDashboardData(dashboardResponse.result);
                
                if (skillResponse.isSuccess) {
                    setSkillData(skillResponse.result);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [adminId]);

    if (loading) {
        return <Loading message="대시보드 데이터를 불러오는 중..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-10 mt-10">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">관리자 페이지</h1>
                    <p className="text-gray-600">시스템 사용 현황을 한눈에 확인하세요</p>
                </div>

                {/* 상단 통계 카드 - skillData 전달 */}
                <div className="mb-4" style={{ maxHeight: '200px', overflow: 'visible' }}>
                    <StatsCards data={dashboardData} skillData={skillData} />
                </div>

                {/* 탭 네비게이션 */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('user-analysis')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'user-analysis'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    사용자 분석
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('skill-analysis')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'skill-analysis'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    스킬 분석
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('wordcloud-analysis')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'wordcloud-analysis'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    워드클라우드
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* 차트 섹션 - 탭에 따라 다른 내용 표시 */}
                <div className="transition-all duration-300 ease-in-out">
                    {activeTab === 'user-analysis' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {dashboardData.userStatistics ? (
                                <LevelCharts
                                    data={dashboardData}
                                    selectedLevel={selectedLevel}
                                    onLevelSelect={setSelectedLevel}
                                />
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">레벨별 사용자 분포</h2>
                                    <div className="h-80 flex items-center justify-center text-gray-500">
                                        <p>사용자 통계 데이터가 없습니다</p>
                                    </div>
                                </div>
                            )}

                            {dashboardData.categoryStatistics ? (
                                <ChatCharts data={dashboardData} />
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">질문 카테고리 분포</h2>
                                    <div className="h-80 flex items-center justify-center text-gray-500">
                                        <p>카테고리 통계 데이터가 없습니다</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'skill-analysis' ? (
                        <div>
                            {skillData ? (
                                <SkillCharts skillData={skillData} />
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">스킬 분석</h2>
                                    <div className="h-80 flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📊</div>
                                            <p>스킬 데이터를 불러오는 중입니다...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'wordcloud-analysis' ? (
                        <div>
                            {adminId ? (
                                <WordCloudCharts adminId={adminId} />
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">워드클라우드</h2>
                                    <div className="h-80 flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">⚠️</div>
                                            <p>관리자 정보가 필요합니다</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}