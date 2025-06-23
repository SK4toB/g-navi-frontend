import { useEffect, useState } from 'react';
import { adminApi, type DashboardData } from "../api/admin"
import useAuthStore from '../store/authStore';
import StatsCards from '../components/admin/dashboard/StatsCards';
import LevelCharts from '../components/admin/dashboard/LevelCharts';
import ChatCharts from '../components/admin/dashboard/ChatCharts';

export default function DashBoardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();
    const adminId = user?.memberId;

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!adminId) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await adminApi.getDashboardData(adminId);
                console.log('Dashboard data:', response.result); // 데이터 구조 확인
                console.log('userStatistics:', response.result?.userStatistics); // 유저 통계 확인
                console.log('categoryStatistics:', response.result?.categoryStatistics); // 카테고리 통계 확인
                setDashboardData(response.result);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [adminId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        );
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

                {/* 상단 통계 카드 */}
                <div className="mb-4" style={{ maxHeight: '200px', overflow: 'visible' }}>
                    <StatsCards data={dashboardData} />
                </div>

                {/* 차트 섹션 */}
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
            </div>
        </div>
    );
}