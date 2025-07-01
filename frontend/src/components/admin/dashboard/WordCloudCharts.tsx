// frontend/src/components/admin/dashboard/WordCloudCharts.tsx
import { useState, useEffect, useRef } from 'react';
import { wordcloudApi, type CategoryType, type LevelType } from '../../../api/wordcloud';

interface WordCloudChartsProps {
    adminId: number;
}

type ViewType = 'all' | 'category' | 'level';

// API 응답에서 받는 실제 데이터 타입
interface ApiWordData {
    text: string;
    count: number;
}

// 워드클라우드 렌더링을 위한 Canvas 기반 컴포넌트
const CanvasWordCloud = ({ words, width = 600, height = 400 }: { 
    words: ApiWordData[], 
    width?: number, 
    height?: number 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!words.length || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas 초기화
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 최대값으로 정규화
        const maxValue = Math.max(...words.map(w => w.count));
        const minValue = Math.min(...words.map(w => w.count));
        const valueRange = maxValue - minValue || 1;

        // 색상 팔레트
        const colors = [
            '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
            '#ef4444', '#f97316', '#84cc16', '#ec4899', '#6366f1'
        ];

        // 폰트 크기 계산 함수
        const getFontSize = (count: number) => {
            const normalized = (count - minValue) / valueRange;
            return Math.max(12, Math.min(48, 12 + normalized * 36));
        };

        // 단어 배치 정보 저장
        const placedWords: Array<{
            text: string;
            x: number;
            y: number;
            width: number;
            height: number;
            fontSize: number;
            color: string;
        }> = [];

        // 충돌 검사 함수
        const checkCollision = (x: number, y: number, w: number, h: number) => {
            return placedWords.some(word => 
                x < word.x + word.width &&
                x + w > word.x &&
                y < word.y + word.height &&
                y + h > word.y
            );
        };

        // 나선형 기반 단어 배치 함수 (기존 방식 유지하되 약간 개선)
        const placeWord = (word: ApiWordData, fontSize: number, color: string) => {
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = color;
            
            const metrics = ctx.measureText(word.text);
            const wordWidth = metrics.width;
            const wordHeight = fontSize;

            // 배치 시도 횟수
            let attempts = 0;
            const maxAttempts = 50;
            
            while (attempts < maxAttempts) {
                // 나선형 배치 (기존 방식 유지하되 약간 확장)
                const angle = Math.random() * Math.PI * 2;
                const radius = attempts * 6; // 5에서 6으로 약간 증가
                const centerX = width / 2;
                const centerY = height / 2;
                
                const x = centerX + Math.cos(angle) * radius - wordWidth / 2;
                const y = centerY + Math.sin(angle) * radius + wordHeight / 2;

                // 캔버스 영역 내부인지 확인 (여백 30px 유지)
                if (x >= 30 && y >= 30 && x + wordWidth <= width - 30 && y <= height - 30) {
                    // 충돌 검사
                    if (!checkCollision(x, y - wordHeight, wordWidth, wordHeight)) {
                        // 텍스트 그리기
                        ctx.fillText(word.text, x, y);
                        
                        // 배치된 단어 정보 저장
                        placedWords.push({
                            text: word.text,
                            x: x,
                            y: y - wordHeight,
                            width: wordWidth,
                            height: wordHeight,
                            fontSize: fontSize,
                            color: color
                        });
                        
                        return true;
                    }
                }
                attempts++;
            }
            return false;
        };

        // 단어들을 count 순으로 정렬 (큰 것부터)
        const sortedWords = [...words].sort((a, b) => b.count - a.count);

        // 단어 배치 실행
        sortedWords.forEach((word, index) => {
            const fontSize = getFontSize(word.count);
            const color = colors[index % colors.length];
            placeWord(word, fontSize, color);
        });

    }, [words, width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border border-gray-200 rounded-lg bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
};

export default function WordCloudCharts({ adminId }: WordCloudChartsProps) {
    const [viewType, setViewType] = useState<ViewType>('all');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('skill');
    const [selectedLevel, setSelectedLevel] = useState<LevelType>('CL1');
    const [wordData, setWordData] = useState<ApiWordData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxWords, setMaxWords] = useState(50);

    // 데이터 로딩 함수
    const loadWordCloudData = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            
            switch (viewType) {
                case 'all':
                    response = await wordcloudApi.getAllWordCloud(adminId, maxWords);
                    break;
                case 'category':
                    response = await wordcloudApi.getCategoryWordCloud(adminId, selectedCategory, maxWords);
                    break;
                case 'level':
                    response = await wordcloudApi.getLevelWordCloud(adminId, selectedLevel, maxWords);
                    break;
                default:
                    throw new Error('잘못된 view 타입입니다.');
            }

            if (response.isSuccess && response.result && response.result.words) {
                setWordData(response.result.words);
            } else {
                setError(response.message || '데이터 로딩에 실패했습니다.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 초기 로딩 및 설정 변경 시 데이터 새로고침
    useEffect(() => {
        loadWordCloudData();
    }, [adminId, viewType, selectedCategory, selectedLevel, maxWords]);

    const handleViewTypeChange = (newViewType: ViewType) => {
        setViewType(newViewType);
    };

    const handleMaxWordsChange = (newMaxWords: number) => {
        setMaxWords(newMaxWords);
    };

    return (
        <div className="w-full">
            <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">질문 키워드 분석</h2>
                        
                        {/* 분석 범위 버튼들 */}
                        <div className="flex gap-2">
                            {[
                                { value: 'all', label: '전체' },
                                { value: 'category', label: '카테고리별' },
                                { value: 'level', label: '레벨별' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleViewTypeChange(option.value as ViewType)}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        viewType === option.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        
                        {/* 카테고리 선택 */}
                        {viewType === 'category' && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">카테고리:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="career">커리어</option>
                                    <option value="skill">스킬</option>
                                    <option value="project">프로젝트</option>
                                    <option value="other">기타</option>
                                </select>
                            </div>
                        )}

                        {/* 레벨 선택 */}
                        {viewType === 'level' && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">레벨:</span>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value as LevelType)}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="CL1">CL1</option>
                                    <option value="CL2">CL2</option>
                                    <option value="CL3">CL3</option>
                                    <option value="CL4">CL4</option>
                                    <option value="CL5">CL5</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* 최대 단어 수 설정 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">최대 단어 수:</span>
                        <select
                            value={maxWords}
                            onChange={(e) => handleMaxWordsChange(Number(e.target.value))}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={25}>25개</option>
                            <option value={50}>50개</option>
                            <option value={100}>100개</option>
                            <option value={200}>200개</option>
                        </select>
                    </div>
                </div>

                {/* 워드클라우드 영역 - 적당한 여백 유지 */}
                <div className="flex justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 w-full">
                            <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mb-4"></div>
                            <p className="text-gray-600">워드클라우드를 생성하는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-96 w-full text-center">
                            <div className="text-4xl mb-4">⚠️</div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={loadWordCloudData}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : wordData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 mb-4 w-full text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <p className="text-gray-500">분석할 키워드가 없습니다</p>
                            <p className="text-sm text-gray-400 mt-4">
                                사용자들이 질문을 하면 키워드가 표시됩니다
                            </p>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <CanvasWordCloud 
                                words={wordData} 
                                width={Math.min(1100, window.innerWidth - 100)} 
                                height={332} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}