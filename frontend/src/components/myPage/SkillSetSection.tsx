// frontend/src/components/myPage/SkillSetSection.tsx
import React from 'react';

interface SkillSetSectionProps {
  skills: { name: string }[];
}

export default function SkillSetSection({ skills }: SkillSetSectionProps) {
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

  return (
    <div className="w-[945px] min-h-[156px] flex flex-col">
      <div className="min-h-[74px] flex items-center border-b border-t border-[#E2E8F0]">
        <span className="ml-[24px] font-bold text-[24px] text-[#1E293B]">Skill Sets</span>
      </div>

      <div className="flex flex-wrap p-[24px] gap-[24px]">
        {skills.map((skill, index) => (
          <SkillTag key={index} name={skill.name} />
        ))}
      </div>
    </div>
  );
}