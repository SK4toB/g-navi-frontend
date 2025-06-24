// frontend/src/components/home/HomeCardSkeleton.tsx
import { useState, useEffect } from 'react';

export default function HomeCardSkeleton() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    // 화면 크기에 따른 보이는 카드 수와 카드 너비 계산 (HomeCard와 동일)
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

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 스켈레톤 카드 컴포넌트
    const SkeletonCard = () => (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 mb-3 animate-pulse"
            style={{ width: cardInfo.cardWidth }}
        >
            {/* 이미지 스켈레톤 */}
            <div className="h-32 bg-gray-200"></div>
            
            {/* 내용 스켈레톤 */}
            <div className="p-3 h-26 flex flex-col justify-between">
                {/* 제목 스켈레톤 */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                {/* 하단 정보 스켈레톤 */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4 my-4">
            <div className='py-8 font-bold text-lg' style={{ width: containerWidth, margin: '0 auto' }}>NEWS</div>            
            {/* 스켈레톤 카드 컨테이너 */}
            <div className="relative" style={{ width: containerWidth, margin: '0 auto' }}>
                {/* 이전/다음 버튼 스켈레톤 */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>

                {/* 스켈레톤 카드들 */}
                <div className="overflow-hidden">
                    <div
                        className="flex"
                        style={{ gap: `${cardInfo.gap}px` }}
                    >
                        {Array.from({ length: cardInfo.visibleCards }).map((_, idx) => (
                            <SkeletonCard key={idx} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 슬라이더 컨트롤 스켈레톤 */}
            <div className="flex items-center justify-center mt-6 space-x-4">
                <div className="flex-1 max-w-sm">
                    <div className="w-full h-2 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}