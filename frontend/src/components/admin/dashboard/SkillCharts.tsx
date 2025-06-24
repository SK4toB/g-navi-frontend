import { useState } from 'react';
import { type LevelSkillStatistics } from "../../../api/admin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SkillChartsProps {
    data: LevelSkillStatistics;
    selectedLevel: string | null;
    onLevelSelect: (level: string | null) => void;
}

export default function SkillCharts({ data, selectedLevel, onLevelSelect }: SkillChartsProps) {
    const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('CL1');

    // 레벨 선택 버튼들
    const levels = ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'];
    const levelColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

    // 선택된 레벨의 스킬 데이터 준비
    const currentLevelData = data[selectedSkillLevel as keyof LevelSkillStatistics];
    const skillsChartData = currentLevelData ? currentLevelData.skills.slice(0, 10).map(skill => ({
        name: skill.skillName.length > 15 ? skill.skillName.substring(0, 15) + '...' : skill.skillName,
        fullName: skill.skillName,
        users: skill.userCount,
        projects: skill.projectCount,
        percentage: skill.percentage
    })) : [];

    // 레벨별 멤버 수 데이터 (파이차트용)
    const levelMemberData = levels.map((level, index) => ({
        name: level,
        value: data[level as keyof LevelSkillStatistics]?.memberCount || 0,
        color: levelColors[index],
        skillCount: data[level as keyof LevelSkillStatistics]?.totalSkillCount || 0
    })).filter(item => item.value > 0);

    // 커스텀 툴팁
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800 mb-2">{data.fullName}</p>
                    <div className="space-y-1">
                        <p className="text-sm text-blue-600">사용자: {data.users}명</p>
                        <p className="text-sm text-green-600">프로젝트: {data.projects}개</p>
                        <p className="text-sm text-gray-600">비율: {data.percentage.toFixed(1)}%</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* 레벨별 멤버 수 개요 */}
            <div className="grid grid-cols-5 gap-3 mb-6">
                {levels.map((level, index) => {
                    const levelData = data[level as keyof LevelSkillStatistics];
                    const isActive = selectedSkillLevel === level;
                    
                    return (
                        <button
                            key={level}
                            onClick={() => setSelectedSkillLevel(level)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                isActive 
                                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="text-center">
                                <div className={`text-lg font-bold ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                                    {level}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {levelData?.memberCount || 0}명
                                </div>
                                <div className="text-xs text-gray-400">
                                    스킬: {levelData?.totalSkillCount || 0}개
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 선택된 레벨의 스킬 분포 차트 */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedSkillLevel} 레벨 상위 스킬 분포
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        (총 {currentLevelData?.totalSkillCount || 0}개 스킬 중 상위 10개)
                    </span>
                </h3>
                
                {skillsChartData.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={skillsChartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    fontSize={12}
                                    stroke="#6b7280"
                                />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {skillsChartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={`hsl(${220 + index * 15}, 70%, ${60 - index * 3}%)`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-3">📊</div>
                            <p className="text-lg font-medium">해당 레벨에 스킬 데이터가 없습니다</p>
                            <p className="text-sm mt-1">다른 레벨을 선택해보세요</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 스킬 상세 목록 */}
            {currentLevelData && currentLevelData.skills.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800">
                            {selectedSkillLevel} 레벨 스킬 상세 목록
                        </h4>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                            {currentLevelData.skills.map((skill, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate" title={skill.skillName}>
                                                {skill.skillName}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-xs text-blue-600">
                                                    👥 {skill.userCount}명
                                                </span>
                                                <span className="text-xs text-green-600">
                                                    📁 {skill.projectCount}개
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {skill.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 도움말 */}
            <div className="text-sm text-gray-600 text-center">
                💡 레벨 버튼을 클릭하여 해당 레벨의 스킬 분포를 확인하세요
            </div>
        </div>
    );
}