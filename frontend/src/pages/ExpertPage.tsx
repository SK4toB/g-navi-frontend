import { useState } from 'react';

export default function ExpertPage() {
    const [articleUrl, setArticleUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateNaverNewsUrl = (url) => {
        const naverNewsPattern = /^https:\/\/news\.naver\.com\//;
        return naverNewsPattern.test(url);
    };

    const handleSubmit = async () => {
        // 입력값 초기화
        setError('');
        setSuccessMessage('');

        // 빈 값 체크
        if (!articleUrl.trim()) {
            setError('기사 링크를 입력해주세요.');
            return;
        }

        // 네이버 뉴스 링크 유효성 검사
        if (!validateNaverNewsUrl(articleUrl)) {
            setError('네이버 뉴스 링크만 등록 가능합니다.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 실제 API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccessMessage('카드뉴스 등록 요청이 완료되었습니다!');
            setArticleUrl('');
        } catch (err) {
            setError('등록 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setArticleUrl(e.target.value);
        // 입력 시 에러 메시지 초기화
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    return (
        <div className="h-full flex flex-col mt-40">
            <div className="text-center text-2xl font-bold py-8 text-gray-800">
                사내 구성원에게 전달하고 싶은 소식이 있나요?
            </div>
            
            <div className="max-w-2xl mx-auto w-full mt-10 px-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-8 text-gray-700">
                        카드 뉴스 등록 요청
                    </h2>
                    
                    <div className="mb-4">
                        <label htmlFor="articleUrl" className="block text-sm font-medium text-gray-600 mb-2">
                            네이버 뉴스 기사 링크
                        </label>
                        <input
                            id="articleUrl"
                            type="url"
                            value={articleUrl}
                            onChange={handleInputChange}
                            placeholder="https://n.news.naver.com/article/으로 시작하는 링크를 입력해주세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            disabled={isSubmitting}
                        />
                        
                        {/* 안내 메시지 */}
                        <div className="mt-2 text-sm text-gray-500">
                            💡 네이버 뉴스 기사 링크만 등록 가능합니다
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="mt-7 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* 성공 메시지 */}
                    {successMessage && (
                        <div className="mt-7  mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 text-sm">{successMessage}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`mt-5 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-main-color hover:bg-blue-900 active:bg-blue-800'
                        } text-white`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                등록 요청 중...
                            </div>
                        ) : (
                            '등록 요청하기'
                        )}
                    </button>
                </div>

                {/* 사용 예시 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">올바른 링크 예시:</h3>
                    <div className="text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                        https://n.news.naver.com/article/...
                    </div>
                </div>
            </div>
        </div>
    );
}