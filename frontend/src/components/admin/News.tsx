import { useState } from 'react';

const news = [
    {
        "title": "메타의 AI 앱 프라이버시 악몽, 사적인 대화 노출",
        "writer": "김효준",
        "isRegistered": true,
        "url": 'url',
        "date": "2025-06-16",
    },
    {
        "title": "기업의 AI 노력이 실패하는 11가지 흔한 이유",
        "writer": "양석우",
        "isRegistered": true,
        "url": 'url',
        "date": "2025-06-16",
    },
    {
        "title": "구글의 제미니 AI가 작업 자동화를 위한 예약된 동작을 추가",
        "writer": "오현진",
        "isRegistered": false,
        "url": 'url',
        "date": "2025-06-16",
    },
]

export default function News() {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredNews = news.filter(item => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'registered') return item.isRegistered === true;
        if (statusFilter === 'unregistered') return item.isRegistered === false;
        return true;
    });

    return (
        <article className="News flex-[7] ml-20 flex flex-col h-full">
            <div className="flex justify-center text-lg font-bold">News</div>
            <div className="bg-gray-100 rounded-3xl my-6 p-6 flex-1">
                {/* 필터 */}
                <div className="flex justify-end mb-4 p-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setStatusFilter('registered')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'registered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            등록
                        </button>
                        <button
                            onClick={() => setStatusFilter('unregistered')}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === 'unregistered' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            미등록
                        </button>
                    </div>
                </div>

                {/* 헤더 */}
                <figure className="flex p-3 border-b-2 border-gray-400 mb-2">
                    <span className="font-bold w-1/2 pr-4">기사제목</span>
                    <span className="font-bold w-1/4 text-center">작성자</span>
                    <span className="font-bold w-1/6 text-center">날짜</span>
                    <div className="w-24 text-center">
                        <span className="font-bold text-sm">관리</span>
                    </div>
                </figure>

                {/* 뉴스 목록 */}
                {filteredNews.map((item, index) => (
                    <figure key={index} className="flex p-3 border-b border-gray-300 last:border-b-0 items-center">
                        <span className="font-medium w-1/2 truncate pr-4">{item.title}</span>
                        <span className="text-gray-600 w-1/4 text-center">{item.writer}</span>
                        <span className="text-gray-600 w-1/6 text-center">{item.date}</span>
                        <div className="w-24 flex gap-1 justify-center">
                            {item.isRegistered ? (
                                <>
                                    <button className="text-xs text-orange-600 hover:text-orange-800">등록해제</button>
                                </>
                            ) : (
                                <>
                                    <button className="text-xs text-blue-600 hover:text-blue-800">등록</button>
                                    <button className="text-xs text-red-600 hover:text-red-800">삭제</button>
                                </>
                            )}
                        </div>
                    </figure>
                ))}

                {/* 필터 결과가 없을 때 */}
                {filteredNews.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        해당 상태의 뉴스가 없습니다.
                    </div>
                )}
            </div>
        </article>
    )
}