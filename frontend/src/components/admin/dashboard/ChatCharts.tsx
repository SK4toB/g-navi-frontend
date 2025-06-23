import { type DashboardData } from "../../../api/admin";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export default function ChatCharts({ data }: { data: DashboardData }) {
    
    const categoryData = [
        { name: '커리어', value: data.categoryStatistics.careerQuestions, percentage: data.categoryStatistics.careerPercentage.toFixed(1) },
        { name: '스킬', value: data.categoryStatistics.skillQuestions, percentage: data.categoryStatistics.skillPercentage.toFixed(1) },
        { name: '프로젝트', value: data.categoryStatistics.projectQuestions, percentage: data.categoryStatistics.projectPercentage.toFixed(1) },
        { name: '기타', value: data.categoryStatistics.otherQuestions, percentage: data.categoryStatistics.otherPercentage.toFixed(1) }
    ].filter(item => item.value > 0);

    const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#eab308', '#6b7280'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-medium">{`${data.name}: ${data.value}개`}</p>
                    <p className="text-sm text-gray-600">{`비율: ${data.percentage}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">질문 카테고리 분포</h2>
            {categoryData.length > 0 ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#8884d8">
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <div className="text-4xl mb-2">💬</div>
                        <p>표시할 질문 데이터가 없습니다</p>
                    </div>
                </div>
            )}
        </div>
    );
}