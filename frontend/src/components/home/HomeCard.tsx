import { useState, useEffect, useMemo } from 'react';
import { newsApi } from '../../api/news';
import type { NewsItem } from '../../api/news';
import HomeCardSkeleton from './HomeCardSkeleton'; // 추가

export default function HomeCard() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 화면 크기에 따른 보이는 카드 수와 카드 너비 계산 (0.8배 축소)
    const getCardInfo = (width: number) => {
        if (width >= 1024) {
            return { visibleCards: 3, cardWidth: 256, gap: 19 };
        } else if (width >= 768) {
            return { visibleCards: 2, cardWidth: 224, gap: 16 };
        } else {
            return { visibleCards: 1, cardWidth: 224, gap: 13 };
        }
    };

    const cardInfo = getCardInfo(windowWidth);
    const containerWidth = cardInfo.visibleCards * cardInfo.cardWidth + (cardInfo.visibleCards - 1) * cardInfo.gap;

    // 승인된 뉴스 가져오기
    const fetchApprovedNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await newsApi.getAllNewsList(1);
            if (response.isSuccess && response.result) {
                // 승인된 뉴스만 필터링
                const approvedNews = response.result.filter(news =>
                    news.status === '승인' || news.status === '승인됨'
                );
                setNewsData(approvedNews);
            } else {
                setError(response.message || 'API 응답 오류');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '뉴스를 불러오는 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedNews();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setScrollPosition(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const registeredNews = useMemo(() => newsData, [newsData]);
    const totalContentWidth = registeredNews.length * cardInfo.cardWidth + (registeredNews.length - 1) * cardInfo.gap;
    const maxScrollDistance = Math.max(0, totalContentWidth - containerWidth);
    const sliderMax = 100;

    const handleSliderChange = (value: number) => {
        const newPosition = (value / sliderMax) * maxScrollDistance;
        setScrollPosition(newPosition);
    };

    const next = () => {
        const step = cardInfo.cardWidth + cardInfo.gap;
        const newPosition = Math.min(scrollPosition + step, maxScrollDistance);
        setScrollPosition(newPosition);
    };

    const prev = () => {
        const step = cardInfo.cardWidth + cardInfo.gap;
        const newPosition = Math.max(scrollPosition - step, 0);
        setScrollPosition(newPosition);
    };
    
    const currentSliderValue = maxScrollDistance > 0 ? (scrollPosition / maxScrollDistance) * sliderMax : 0;

    // 로딩 중일 때 스켈레톤 표시
    if (loading) {
        return <HomeCardSkeleton />;
    }

    // 에러 발생 시 간단한 메시지만 표시 (홈페이지니까 크게 문제되지 않도록)
    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 my-4">
                <div className='py-8 font-bold text-lg' style={{ width: containerWidth, margin: '0 auto' }}>NEWS</div>
                <div className="text-center text-gray-500 py-8">
                    뉴스를 불러올 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 my-4">
            <div className='py-8 font-bold text-lg' style={{ width: containerWidth, margin: '0 auto' }}>Insights</div>
            {/* 캐러셀 컨테이너 */}
            <div className="relative" style={{ width: containerWidth, margin: '0 auto' }}>
                {/* 이전 버튼 */}
                <button
                    onClick={prev}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 border border-gray-200 disabled:opacity-50 disabled:cursor-default"
                    disabled={scrollPosition <= 0}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* 다음 버튼 */}
                <button
                    onClick={next}
                    className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 border border-gray-200 disabled:opacity-50 disabled:cursor-default"
                    disabled={scrollPosition >= maxScrollDistance}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* 슬라이드 트랙 */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                            transform: `translateX(-${scrollPosition}px)`,
                            gap: `${cardInfo.gap}px`
                        }}
                    >
                        {registeredNews.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex-shrink-0 mb-3"
                                style={{ width: cardInfo.cardWidth }}
                            >
                                {/* 이미지 */}
                                <div className="h-32 bg-gray-200">
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* 내용 */}
                                <div className="p-3 h-26 flex flex-col justify-between">
                                    <h3 className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                        <a
                                            className="block overflow-hidden text-ellipsis"
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={item.title}
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {item.title}
                                        </a>
                                    </h3>
                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span>{item.expert}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 슬라이더 컨트롤 */}
            <div className="flex items-center justify-center mt-6 space-x-4">
                <div className="flex-1 max-w-sm">
                    <input
                        type="range"
                        min="0"
                        max={sliderMax}
                        step="0.1"
                        value={currentSliderValue}
                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-main-color
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 
                        [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md
                        [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:bg-main-color [&::-moz-range-thumb]:cursor-pointer 
                        [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                    />
                </div>
            </div>
        </div>
    );
}