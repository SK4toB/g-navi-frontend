// \src\components\admin\dashboard\LevelCharts.tsx

import { type DashboardData } from "../../../api/admin";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState } from 'react';
import LevelDetail from "./LevelDetail";

export default function LevelCharts({ data, selectedLevel, onLevelSelect }: {
    data: DashboardData;
    selectedLevel: string | null;
    onLevelSelect: (level: string) => void;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLevel, setModalLevel] = useState<string>('');


    const levelData = ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'].map(level => {
        const count = data.userStatistics.usersByLevel[level] || 0;
        return {
            name: level,
            value: count,
            percentage: data.userStatistics.totalUsers > 0
                ? ((count / data.userStatistics.totalUsers) * 100).toFixed(1)
                : '0.0'
        };
    });

    const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

    const onLevelPieClick = (data: any) => {
        setModalLevel(data.name);
        setIsModalOpen(true);
        onLevelSelect(data.name);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalLevel('');
        onLevelSelect(null);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length && !isModalOpen) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-medium">{`${data.name}: ${data.value}명`}</p>
                    <p className="text-sm text-gray-600">{`비율: ${data.percentage}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">레벨별 사용자 분포</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={levelData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                onClick={onLevelPieClick}
                                className="cursor-pointer focus:outline-none"
                                style={{ outline: 'none' }}
                            >
                                {levelData.map((entry, index) => {
                                    const baseColor = COLORS[index % COLORS.length];
                                    const isSelected = selectedLevel === entry.name;
                                    const isOtherSelected = selectedLevel && selectedLevel !== entry.name;
                                    
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={baseColor}
                                            fillOpacity={isOtherSelected ? 0.3 : 1}
                                            stroke={isSelected ? baseColor : "none"}
                                            strokeWidth={isSelected ? 3 : 0}
                                            style={{
                                                filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' : 'none',
                                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transition: 'all 0.3s ease-in-out'
                                            }}
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                content={<CustomTooltip />}
                                animationDuration={0}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    💡 레벨을 클릭하면 해당 레벨의 상세 통계를 모달로 확인할 수 있습니다
                </p>
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                            aria-label="모달 닫기"
                        >
                            ✕
                        </button>
                        <LevelDetail level={modalLevel} data={data}/>
                    </div>
                </div>
            )}
        </>
    );
}