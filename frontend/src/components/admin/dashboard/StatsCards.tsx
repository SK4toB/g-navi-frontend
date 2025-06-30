import { type DashboardData, type LevelSkillStatistics } from "../../../api/admin";

interface StatsCardsProps {
    data: DashboardData;
    skillData?: LevelSkillStatistics | null; // 스킬 데이터 추가
}

export default function StatsCards({ data, skillData }: StatsCardsProps) {
    // 가장 인기 있는 스킬 계산
    const getMostPopularSkill = () => {
        if (!skillData) return { name: '데이터 없음', userCount: 0 };
        
        const allSkills: Array<{ skillName: string; userCount: number }> = [];
        
        // 모든 레벨의 스킬을 하나의 배열로 합치기
        Object.values(skillData).forEach(levelData => {
            levelData.skills.forEach(skill => {
                const existingSkill = allSkills.find(s => s.skillName === skill.skillName);
                if (existingSkill) {
                    existingSkill.userCount += skill.userCount;
                } else {
                    allSkills.push({
                        skillName: skill.skillName,
                        userCount: skill.userCount
                    });
                }
            });
        });
        
        // 사용자 수 기준으로 정렬하여 가장 인기 있는 스킬 반환
        const sortedSkills = allSkills.sort((a, b) => b.userCount - a.userCount);
        return sortedSkills.length > 0 
            ? { name: sortedSkills[0].skillName, userCount: sortedSkills[0].userCount }
            : { name: '스킬 없음', userCount: 0 };
    };

    const mostPopularSkill = getMostPopularSkill();

    // 아이콘 컴포넌트들
    const UserIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const ChatIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );

    const QuestionIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    );

    const SkillIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 전체 사용자 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm px-4 py-6 border-l-4 border-indigo-500">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">전체 사용자</h3>
                        <p className="text-3xl font-bold text-indigo-600">{data.userStatistics.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <UserIcon />
                    </div>
                </div>
            </div>

            {/* 오늘 채팅 사용자 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm px-4 py-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">오늘 채팅 사용자</h3>
                        <p className="text-3xl font-bold text-purple-600">{data.todayChatUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <ChatIcon />
                    </div>
                </div>
            </div>

            {/* 총 질문 수 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm px-4 py-6 border-l-4 border-cyan-500">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">총 질문 수</h3>
                        <p className="text-3xl font-bold text-cyan-600">{data.categoryStatistics.totalQuestions}</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                        <QuestionIcon />
                    </div>
                </div>
            </div>

            {/* 가장 인기 있는 스킬 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm px-4 py-6 border-l-4 border-emerald-500">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">인기 스킬</h3>
                        <div className="mt-1">
                            <p className="text-2xl font-bold text-emerald-600">{mostPopularSkill.userCount}명</p>
                            <p className="text-sm text-gray-600 truncate" title={mostPopularSkill.name}>
                                {mostPopularSkill.name}
                            </p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <SkillIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}