// frontend/src/components/profile/SkillSetSection.tsx
import React from 'react';

interface SkillSetSectionProps {
  skills: { name: string }[];
  isLoading?: boolean;
}

export default function SkillSetSection({ skills, isLoading = false }: SkillSetSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const MAX_VISIBLE_SKILLS = 6;

  interface SkillTagProps {
    name: string;
  }

  const SkillTag: React.FC<SkillTagProps> = ({ name }) => {
    return (
      <div
        className={`
          rounded-[10px] flex items-center justify-center w-[253px] h-[42px] box-border
          text-[16px] bg-[#162550] text-[#FFFFFF]
        `}
      >
        {name}
      </div>
    );
  };

  // 표시할 스킬들 결정
  const visibleSkills = isExpanded ? skills : skills.slice(0, MAX_VISIBLE_SKILLS);
  const hasMoreSkills = skills.length > MAX_VISIBLE_SKILLS;

  return (
    <div className="w-[945px] min-h-[156px] flex flex-col">
      <div className="min-h-[74px] flex items-center justify-between border-b border-t border-[#E2E8F0] px-[24px]">
        <div className="flex items-center">
          <span className="font-bold text-[24px] text-[#1E293B]">Skill Sets</span>
          {isLoading && (
            <div className="ml-4 flex items-center">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              <span className="ml-2 text-sm text-gray-500">업데이트 중...</span>
            </div>
          )}
        </div>

        {/* 토글 버튼 - 스킬이 3개 초과일 때만 표시 */}
        {hasMoreSkills && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-[#122250] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>{isExpanded ? '접기' : `더보기 (+${skills.length - MAX_VISIBLE_SKILLS})`}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-center p-[24px] gap-[32px] max-h-[180px] overflow-y-auto">
        {skills.length > 0 ? (
          visibleSkills.map((skill, index) => (
            <SkillTag key={index} name={skill.name} />
          ))
        ) : (
          <div className="w-full text-center text-gray-500 py-8">
            {isLoading ? '스킬 정보를 불러오는 중...' : '등록된 스킬이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}