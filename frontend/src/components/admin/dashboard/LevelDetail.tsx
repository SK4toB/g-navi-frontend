// src\components\admin\dashboard\LevelDetail.tsx

import { type DashboardData } from "../../../api/admin";

interface LevelDetailProps {
  level: string;
  data: DashboardData;
}

export default function LevelDetail({ level, data }: LevelDetailProps) {
  const levelStats = data.levelCategoryStatistics[level];
  const userCount = data.userStatistics.usersByLevel[level] || 0;
  
  if (!levelStats) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">{level} 상세 통계</h3>
        <p className="text-gray-500">해당 레벨의 데이터가 없습니다.</p>
      </div>
    );
  }

  const categoryData = [
    { name: '커리어', count: levelStats.careerQuestions, percentage: levelStats.careerPercentage, color: 'bg-blue-500' },
    { name: '스킬', count: levelStats.skillQuestions, percentage: levelStats.skillPercentage, color: 'bg-green-500' },
    { name: '프로젝트', count: levelStats.projectQuestions, percentage: levelStats.projectPercentage, color: 'bg-yellow-500' },
    { name: '기타', count: levelStats.otherQuestions, percentage: levelStats.otherPercentage, color: 'bg-gray-500' }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{level} 상세 통계</h3>
      
      {/* 기본 정보 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">사용자 수</p>
            <p className="text-xl font-bold text-gray-900">{userCount}명</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">총 질문 수</p>
            <p className="text-xl font-bold text-gray-900">{levelStats.totalQuestions}개</p>
          </div>
        </div>
      </div>

      {/* 카테고리별 질문 통계 */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-3">카테고리별 질문 분포</h4>
        {levelStats.totalQuestions > 0 ? (
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{category.count}개</span>
                  <span className="text-sm text-gray-500">
                    ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">아직 질문이 없습니다.</p>
        )}
      </div>

      {/* 시각적 진행률 바 */}
      {levelStats.totalQuestions > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">비율 분포</h4>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="flex h-full rounded-full overflow-hidden">
              {categoryData.map((category, index) => (
                category.percentage > 0 && (
                  <div
                    key={index}
                    className={category.color.replace('bg-', 'bg-')}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}