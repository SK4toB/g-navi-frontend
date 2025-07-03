// frontend/src/pages/ExpertPage.tsx
import { useState } from 'react';
import { newsApi } from '../api/news';
import CommonButton from '../components/common/CommonButton';
import useAuthStore from '../store/authStore'; // 추가

export default function ExpertPage() {
    const { user } = useAuthStore(); // 추가
    const [articleUrl, setArticleUrl] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');

        // 사용자 정보 확인
        if (!user?.memberId) {
            setError('로그인이 필요합니다.');
            return;
        }

        // 빈 값 체크
        if (!articleUrl.trim()) {
            setError('기사 링크를 입력해주세요.');
            return;
        }

        
        setIsSubmitting(true);

        try {
            const response = await newsApi.registerNews(
                user.memberId,
                articleTitle.trim(),
                articleUrl.trim()
            );

            if (response.isSuccess && response.result) {
                setSuccessMessage('인사이트 신청이 완료되었습니다! 관리자 승인 후 게시됩니다.');
                setArticleUrl('');
                setArticleTitle('');
            } else {
                setError(`신청 실패: ${response.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setArticleUrl(e.target.value);
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    // 로그인하지 않은 경우 처리
    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center text-2xl font-bold py-8 text-gray-800">
                    로그인이 필요합니다
                </div>
                <p className="text-gray-600">
                    인사이트 신청을 위해서는 로그인이 필요합니다.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col mt-40">
            <div className="text-center text-2xl font-bold py-8 text-gray-800">
                사내 구성원에게 전달하고 싶은 소식이 있나요?
            </div>

            <div className="max-w-2xl mx-auto w-full mt-10 px-6">
                <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-8 text-gray-700">
                        카드 인사이트 신청
                    </h2>

                    <div className="mb-4">
                        <label htmlFor="articleUrl" className="block text-sm font-medium text-gray-600 mb-2">
                            인사이트 링크
                        </label>
                        <input
                            id="articleUrl"
                            type="url"
                            value={articleUrl}
                            onChange={handleInputChange}
                            placeholder="예시) https://n.news.naver.com/article/1"
                            className="w-full px-4 py-3 font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            disabled={isSubmitting}
                        />

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
                    <div className='flex justify-center mt-8'>
                        <CommonButton
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            loadingText="등록 요청 중..."
                            width={240}
                        >
                            등록 요청하기
                        </CommonButton>
                    </div>
                </div>

            </div>
        </div>
    );
}