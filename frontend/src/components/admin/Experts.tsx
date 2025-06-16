import { useState } from 'react';

const experts = [
    {
        'name': '양석우',
        'isExpert': true
    },
    {
        'name': '김효준',
        'isExpert': true
    },
    {
        'name': '오현진',
        'isExpert': true
    },
    {
        'name': '이소희',
        'isExpert': true
    },
    {
        'name': '이재원',
        'isExpert': false
    },
]

export default function Experts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expertsData, setExpertsData] = useState(experts);

    // 전문가 목록 (isExpert: true인 사람들)
    const currentExperts = expertsData.filter(expert => expert.isExpert);

    // 검색 결과 (isExpert: false이면서 검색어에 맞는 사람들)
    const searchResults = expertsData.filter(expert =>
        !expert.isExpert &&
        expert.name.includes(searchTerm) &&
        searchTerm.trim() !== ''
    );

    // 전문가 등록 함수
    const handleRegisterExpert = (expertName) => {
        setExpertsData(prev =>
            prev.map(expert =>
                expert.name === expertName
                    ? { ...expert, isExpert: true }
                    : expert
            )
        );
        setSearchTerm(''); // 검색창 초기화
    };

    // 전문가 삭제 함수
    const handleRemoveExpert = (expertName) => {
        setExpertsData(prev =>
            prev.map(expert =>
                expert.name === expertName
                    ? { ...expert, isExpert: false }
                    : expert
            )
        );
    };

    return (
        <article className="Expert flex-[3] mr-20 flex flex-col h-full">
            <div className="flex justify-center text-lg font-bold">Expert</div>
            <figure className="bg-gray-100 rounded-3xl my-6 p-6 flex-1">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="이름을 검색하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 검색 결과 (isExpert: false인 사람들) */}
                {searchTerm && (
                    <div className="mb-4">
                        {searchResults.length > 0 ? (
                            <div className="space-y-2">
                                {searchResults.map((expert, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleRegisterExpert(expert.name)}
                                        className="p-2 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition-colors flex justify-between items-center"
                                    >
                                        <span className="text-blue-700">{expert.name}</span>
                                        <span className="text-xs text-blue-500">[클릭하여 등록]</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-4 text-sm">
                                검색 결과가 없습니다
                            </div>
                        )}
                    </div>
                )}

                {/* 현재 전문가 목록 (isExpert: true인 사람들) */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">등록된 전문가</div>
                    {currentExperts.length > 0 ? (
                        currentExperts.map((expert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                <span className="font-medium">{expert.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRemoveExpert(expert.name)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            등록된 전문가가 없습니다
                        </div>
                    )}
                </div>
            </figure>
        </article>
    )
}