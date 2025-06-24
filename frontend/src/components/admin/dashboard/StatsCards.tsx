import { type DashboardData, type LevelSkillStatistics } from "../../../api/admin";

interface StatsCardsProps {
    data: DashboardData;
    skillsData?: LevelSkillStatistics | null;
}

export default function StatsCards({ data, skillsData }: StatsCardsProps) {
    // 총 스킬 수 계산
    const totalSkills = skillsData ? Object.values(skillsData).reduce((total, level) => total + level.totalSkillCount, 0) : 0;
    
    // 가장 많이 사용되는 스킬 찾기
    const topSkill = skillsData ? (() => {
        let maxCount = 0;
        let topSkillName = '';
        
        Object.values(skillsData).forEach(level => {
            level.skills.forEach(skill => {
                if (skill.userCount > maxCount) {
                    maxCount = skill.userCount;
                    topSkillName = skill.skillName;
                }
            });
        });
        
        return { name: topSkillName, count: maxCount };
    })() : { name: '', count: 0 };

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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

            {/* 총 스킬 수 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm px-4 py-6 border-l-4 border-amber-500">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">총 스킬 수</h3>
                        <p className="text-3xl font-bold text-amber-600">{totalSkills}</p>
                        {topSkill.name && (
                            <p className="text-xs text-gray-500 mt-1">
                                인기: {topSkill.name} ({topSkill.count}명)
                            </p>
                        )}
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <SkillIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}