// frontend/src/components/profile/ProfileSection.tsx
import React, { useState } from 'react';
import { authApi, type UpdateMemberLevelRequest } from '../../api/auth';
import useAuthStore from '../../store/authStore';

interface UserInfo {
  name: string;
  isExpert: boolean;
  level?: string;
  onLevelUpdate?: (newLevel: string) => void;
}

const LEVEL_OPTIONS = ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'] as const;

export default function ProfileSection({ name, isExpert, level, onLevelUpdate }: UserInfo) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(level || 'CL1');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLevelUpdate = async () => {
    if (!user?.memberId || !selectedLevel || selectedLevel === level) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const response = await authApi.updateMemberLevel({
        memberId: user.memberId,
        newLevel: selectedLevel as any
      });

      if (response.isSuccess) {
        onLevelUpdate?.(selectedLevel);
        setIsEditing(false);
      } else {
        alert(`레벨 업데이트 실패: ${response.message}`);
        setSelectedLevel(level || 'CL1');
      }
    } catch (error) {
      alert('레벨 업데이트 중 오류가 발생했습니다.');
      setSelectedLevel(level || 'CL1');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setSelectedLevel(level || 'CL1');
    setIsEditing(false);
  };

  return (
    <div className="w-[945px] min-h-[75px] flex flex-col">
      <div className="min-h-[74px] flex items-center justify-between border-[#E2E8F0] px-[24px]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[22px] text-[#1E293B]">{name}</span>
          {isEditing ? (
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none px-5 py-1.5 bg-white text-black-700 text-xs rounded-md font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 pr-8"
                disabled={isUpdating}
              >
                {LEVEL_OPTIONS.map((levelOption) => (
                  <option key={levelOption} value={levelOption} className="bg-white text-gray-800">
                    {levelOption}
                  </option>
                ))}
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-black-700 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          ) : (
            <span className="px-5 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-md font-semibold shadow-md">
              {level || 'CL1'}
            </span>
          )}

          <div className="flex items-center gap-3">
            {/* 버튼들 */}
            {isEditing ? (
              <>
                <button
                  onClick={handleLevelUpdate}
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>저장중...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>저장</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span>취소</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 opacity-70 hover:opacity-100"
                title="레벨 수정"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-xs">수정</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {isExpert && (
            <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full border border-orange-200">
              전문가
            </span>
          )}
        </div>
      </div>
    </div>
  )
};