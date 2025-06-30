// frontend/src/components/admin/dashboard/SkillCharts.tsx
import { type LevelSkillStatistics } from "../../../api/admin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';

interface SkillChartsProps {
    skillData: LevelSkillStatistics;
}

export default function SkillCharts({ skillData }: SkillChartsProps) {
    // 색상 정의를 맨 위로 이동
    const LEVEL_COLORS = {
        'CL1': '#3b82f6',
        'CL2': '#8b5cf6', 
        'CL3': '#06b6d4',
        'CL4': '#f59e0b',
        'CL5': '#ef4444'
    };

    const SKILL_COLORS = [
        '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', 
        '#f59e0b', '#ef4444', '#f97316', '#84cc16'
    ];

    // 초기값을 전체로 설정
    const getInitialLevel = () => {
        return 'ALL'; // 기본값을 전체로 설정
    };

    const [selectedLevel, setSelectedLevel] = useState<string>(getInitialLevel());

    // 레벨별 보유 스킬 개수 데이터
    const getLevelSkillCounts = () => {
        if (!skillData) return [];
        
        const result = Object.entries(skillData)
            .map(([level, levelData]) => ({
                level,
                skillCount: levelData?.skills?.length || 0,
                memberCount: levelData?.memberCount || 0
            }))
            .filter(item => item.memberCount > 0 || item.skillCount > 0)
            .sort((a, b) => a.level.localeCompare(b.level));

        console.log('Level Skill Counts:', result);
        return result;
    };

    // 선택된 레벨의 스킬 분포 데이터 (원형 차트용)
    const getSelectedLevelSkills = () => {
        if (!skillData) return [];

        if (selectedLevel === 'ALL') {
            // 전체 레벨의 스킬 통합
            const skillMap = new Map<string, number>();
            let totalUsers = 0;

            Object.values(skillData).forEach(levelData => {
                if (levelData && levelData.skills) {
                    totalUsers += levelData.memberCount || 0;
                    levelData.skills.forEach(skill => {
                        if (skill && skill.skillName && skill.userCount > 0) {
                            const existing = skillMap.get(skill.skillName) || 0;
                            skillMap.set(skill.skillName, existing + skill.userCount);
                        }
                    });
                }
            });

            const skills = Array.from(skillMap.entries())
                .map(([skillName, userCount]) => ({
                    skillName,
                    userCount,
                    percentage: totalUsers > 0 ? (userCount / totalUsers) * 100 : 0
                }))
                .sort((a, b) => b.userCount - a.userCount)
                .slice(0, 6)
                .map((skill, index) => {
                    let displayName = skill.skillName;
                    if (displayName.length > 12) {
                        displayName = displayName.substring(0, 12) + '...';
                    }
                    
                    return {
                        name: displayName,
                        fullName: skill.skillName,
                        value: skill.userCount,
                        percentage: Math.round(skill.percentage),
                        color: SKILL_COLORS[index % SKILL_COLORS.length]
                    };
                });

            console.log('Skills for ALL levels:', skills);
            return skills;
        } else {
            // 특정 레벨의 스킬
            const levelData = skillData[selectedLevel];
            if (!levelData || !levelData.skills || levelData.skills.length === 0) {
                return [];
            }
            
            const skills = levelData.skills
                .filter(skill => skill && skill.skillName && skill.userCount > 0)
                .sort((a, b) => b.userCount - a.userCount)
                .slice(0, 6)
                .map((skill, index) => {
                    let displayName = skill.skillName;
                    if (displayName.length > 12) {
                        displayName = displayName.substring(0, 12) + '...';
                    }
                    
                    return {
                        name: displayName,
                        fullName: skill.skillName,
                        value: skill.userCount,
                        percentage: Math.round(skill.percentage || 0),
                        color: SKILL_COLORS[index % SKILL_COLORS.length]
                    };
                });

            console.log(`Skills for ${selectedLevel}:`, skills);
            return skills;
        }
    };

    const levelSkillCounts = getLevelSkillCounts();
    const selectedLevelSkills = getSelectedLevelSkills();

    // 유효한 레벨 목록 (전체 옵션 포함)
    const levelsWithSkills = Object.keys(skillData || {}).filter(level => 
        skillData[level] && skillData[level].skills && skillData[level].skills.length > 0
    );
    const validLevels = levelsWithSkills.length > 0 ? ['ALL', ...levelsWithSkills] : [];

    // 선택된 레벨이 유효하지 않으면 처리
    useEffect(() => {
        if (validLevels.length === 0) {
            // 스킬이 전혀 없는 경우
            setSelectedLevel('ALL');
        } else if (!validLevels.includes(selectedLevel)) {
            setSelectedLevel('ALL');
        }
    }, [validLevels, selectedLevel]);

    // 툴팁 컴포넌트들
    const LevelCountTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.level} 레벨</p>
                    <p className="text-blue-600">보유 스킬: {data.skillCount}개</p>
                    <p className="text-green-600">구성원 수: {data.memberCount}명</p>
                </div>
            );
        }
        return null;
    };

    const SkillPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
                    <p className="font-semibold text-gray-900">{data.payload.fullName}</p>
                    <p className="text-blue-600">사용자 수: {data.value}명</p>
                    <p className="text-gray-600">비율: {data.payload.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 레벨별 보유 스킬 개수 */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    레벨별 보유 스킬 개수
                </h2>
                {levelSkillCounts.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={levelSkillCounts}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="level"
                                    tick={{ fontSize: 14, fill: '#374151' }}
                                    axisLine={{ stroke: '#d1d5db' }}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={{ stroke: '#d1d5db' }}
                                />
                                <Tooltip 
                                    content={<LevelCountTooltip />}
                                    cursor={false}
                                />
                                <Bar 
                                    dataKey="skillCount" 
                                    radius={[4, 4, 0, 0]}
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                >
                                    {levelSkillCounts.map((entry, index) => (
                                        <Cell 
                                            key={`level-${index}`}
                                            fill={LEVEL_COLORS[entry.level] || '#6b7280'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p>레벨별 스킬 데이터가 없습니다</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 오른쪽: 선택된 레벨의 스킬 분포 (원형 차트) */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {selectedLevel === 'ALL' ? '전체 레벨 스킬 분포' : `${selectedLevel} 레벨 스킬 분포`}
                    </h2>
                    
                    {/* 레벨 선택만 남김 */}
                    {validLevels.length > 0 && (
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {validLevels.map(level => (
                                <option key={level} value={level}>
                                    {level === 'ALL' ? '전체' : level}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                
                {(selectedLevelSkills.length > 0 && validLevels.length > 0) ? (
                    <div className="h-80 [&_*]:outline-none [&_*]:border-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={selectedLevelSkills}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                                    labelLine={false}
                                >
                                    {selectedLevelSkills.map((entry, index) => (
                                        <Cell 
                                            key={`skill-pie-${index}`} 
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    content={<SkillPieTooltip />}
                                    cursor={false}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <p>
                                {validLevels.length === 0 
                                    ? '스킬 데이터가 없습니다'
                                    : selectedLevel === 'ALL' 
                                        ? '전체 레벨의 스킬 데이터가 없습니다'
                                        : `${selectedLevel} 레벨의 스킬 데이터가 없습니다`
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}