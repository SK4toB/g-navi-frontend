// frontend/src/components/profile/ProfileSection.tsx
import React, { useState } from 'react';
import { authApi, type UpdateMemberLevelRequest } from '../../api/auth';
import useAuthStore from '../../store/authStore';

interface UserInfo {
  name: string;
  level?: string;
  onLevelUpdate?: (newLevel: string) => void; // 레벨 업데이트 콜백 추가
}

const LEVEL_OPTIONS = ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'] as const;

export default function ProfileSection({ name, level, onLevelUpdate }: UserInfo) {
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
        // 상태 업데이트
        onLevelUpdate?.(selectedLevel);
        setIsEditing(false);
        alert('레벨이 성공적으로 업데이트되었습니다.');
      } else {
        alert(`레벨 업데이트 실패: ${response.message}`);
        setSelectedLevel(level || 'CL1'); // 원래값으로 복원
      }
    } catch (error) {
      console.error('레벨 업데이트 중 오류:', error);
      alert('레벨 업데이트 중 오류가 발생했습니다.');
      setSelectedLevel(level || 'CL1'); // 원래값으로 복원
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
        <div className="flex items-center gap-4">
          <span className="font-bold text-[24px] text-[#1E293B]">{name}</span>
          
          {/* 레벨 표시/수정 영역 */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              // 수정 모드
              <div className="flex items-center gap-2">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                >
                  {LEVEL_OPTIONS.map((levelOption) => (
                    <option key={levelOption} value={levelOption}>
                      {levelOption}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={handleLevelUpdate}
                  disabled={isUpdating}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isUpdating ? '저장중...' : '저장'}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            ) : (
              // 표시 모드
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-semibold">
                  {level || 'CL1'}
                </span>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="레벨 수정"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}