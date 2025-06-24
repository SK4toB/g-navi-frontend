import React from 'react';

interface SkillSetSectionProps {
  skills: { name: string }[];
  isLoading?: boolean;
}

export default function SkillSetSection({ skills, isLoading = false }: SkillSetSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const MAX_VISIBLE_SKILLS = 9;

  interface SkillTagProps {
    name: string;
  }

  const SkillTag: React.FC<SkillTagProps> = ({ name }) => {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
        {name}
      </div>
    );
  };

  // 표시할 스킬들 결정
  const visibleSkills = isExpanded ? skills : skills.slice(0, MAX_VISIBLE_SKILLS);
  const hasMoreSkills = skills.length > MAX_VISIBLE_SKILLS;

  return (
    <div className="w-[945px] bg-white bg-opacity-80 rounded-lg shadow-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">보유 스킬</h2>
          {skills.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {skills.length}개
            </span>
          )}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-500">업데이트 중...</span>
            </div>
          )}
        </div>

        {/* 토글 버튼 */}
        {hasMoreSkills && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>
              {isExpanded ? '접기' : `더보기 (+${skills.length - MAX_VISIBLE_SKILLS})`}
            </span>
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

      {/* 스킬 목록 */}
      <div className="p-6">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill, index) => (
              <SkillTag key={index} name={skill.name} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                <span className="text-gray-500">스킬 정보를 불러오는 중...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">등록된 스킬이 없습니다</p>
                  <p className="text-sm text-gray-400">프로젝트를 등록하면 자동으로 스킬이 추가됩니다</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}