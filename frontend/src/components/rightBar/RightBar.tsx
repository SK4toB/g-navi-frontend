// frontend/src/components/rightBar/RightBar.tsx
import React from 'react';

// RightBar에 표시될 정보에 대한 인터페이스 정의
interface UserInfo {
  name: string;
  team: string;
  careerLevel: string;
}

interface TechStack {
  name: string;
  colorClass: string; // Tailwind 클래스를 위한 색상 정보
}

interface Project {
  name: string;
}

interface Chat {
  name: string;
}

interface RightBarData {
  userInfo: UserInfo;
  techStacks: TechStack[];
  projects: Project[];
  recentChats: Chat[];
}

interface RightBarProps {
  className?: string; // className prop은 외부에서 전달받는 경우를 위해 유지
}

export default function RightBar({ className }: RightBarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 임시 데이터 (추후 API 연동 시 이 부분을 교체)
  const rightBarData: RightBarData = {
    userInfo: {
      name: '하니',
      team: 'Team Acquistion',
      careerLevel: 'Career Level 3',
    },
    techStacks: [
      { name: 'Spring', colorClass: 'bg-[rgba(22,220,88,0.08)] text-[#34C759]' },
      { name: 'Docker', colorClass: 'bg-[#7E91DD] text-[#FFFFFF]' },
      { name: 'K8S', colorClass: 'bg-[rgba(0,122,255,0.15)] text-[#0040FF]' },
    ],
    projects: [
      { name: '우리은행 차세대 프로젝트' },
    ],
    recentChats: [
      { name: '커리어에 대한 고민' },
      { name: '어떤 스킬을 쌓으면 좋을지?' },
      { name: '롤모델 커리어 확인하기' },
    ],
  };

  return (
    <div className={`
      ${className}
      ${isCollapsed ? 'w-[70px] transition-all duration-300' : 'w-[365px] transition-all duration-300'}
      bg-white border-l border-[#ECECF1] flex flex-col items-center
    `}>
      {/* 이미지의 '접기 아이콘'이 있는 헤더 */}
      <div className="
        flex flex-row justify-center items-center py-[20px] pr-[24px] pl-[13px]
        border-b border-[#E2E8F0] self-stretch
      ">
        <button onClick={toggleCollapse} className="w-[52px] h-[52px] flex items-center justify-center">
          {isCollapsed ? (
            // 펴기 아이콘 (예: 오른쪽 화살표)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            // 접기 아이콘 (예: 왼쪽 화살표)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        {!isCollapsed && (
          <div className="flex flex-row items-center gap-[12px] ml-auto"> {/* AvatarLabel 역할 */}
            <div className="w-[48px] h-[48px] rounded-full bg-gray-300 flex items-center justify-center"> {/* 아바타 이미지 자리 */}
              {/* <img src="..." alt="User Avatar" /> */}
            </div>
            <div className="font-plusjakartasans font-bold text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
              {rightBarData.userInfo.name}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* 본인 정보 섹션 */}
          <div className="flex flex-col self-stretch py-[16px] border-b border-[#E2E8F0]"> {/* UserInfo 역할 */}
            <div className="flex flex-row items-center gap-[8px] px-[24px] py-[16px]"> {/* DetailItem 역할 */}
              {/* 아이콘 자리 */}
              <div className="font-plusjakartasans font-medium text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
                {rightBarData.userInfo.team}
              </div>
            </div>
            <div className="flex flex-row items-center gap-[8px] px-[24px] py-[16px]"> {/* DetailItem 역할 */}
              {/* 아이콘 자리 */}
              <div className="font-plusjakartasans font-medium text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
                {rightBarData.userInfo.careerLevel}
              </div>
            </div>
          </div>

          {/* 기술 스택 섹션 */}
          <div className="flex flex-col self-stretch mt-[16px]"> {/* TechStack 역할 */}
            <div className="
              flex flex-row items-center justify-between px-[24px] py-[9px]
              border-y border-[#E2E8F0]
            "> {/* SectionTitle 역할 */}
              <div className="font-plusjakartasans font-bold text-[18px] leading-[1.33em] tracking-[-0.8%] text-[#1E293B]">기술스택</div>
              <div className="w-[20px] h-[20px]"></div> {/* 드롭다운 아이콘 자리 */}
            </div>
            <div className="flex flex-row items-center gap-[23px] px-[24px] py-[16px] flex-wrap"> {/* TechItems 역할 */}
              {rightBarData.techStacks.map((stack, index) => (
                <div key={index} className={`
                  flex justify-center items-center px-[16px] py-[10px] rounded-full
                  font-roboto font-medium text-[14px] leading-[1.42em] tracking-[0.71%] cursor-pointer
                  ${stack.colorClass}
                `}>
                  {stack.name}
                </div>
              ))}
            </div>
          </div>

          {/* 참여 프로젝트 섹션 */}
          <div className="flex flex-col self-stretch mt-[16px]"> {/* Projects 역할 */}
            <div className="
              flex flex-row items-center justify-between px-[24px] py-[9px]
              border-y border-[#E2E8F0]
            "> {/* SectionTitle 역할 */}
                <div className="font-plusjakartasans font-bold text-[18px] leading-[1.33em] tracking-[-0.8%] text-[#1E293B]">참여 프로젝트</div>
                <div className="w-[20px] h-[20px]"></div> {/* 드롭다운 아이콘 자리 */}
            </div>
            <div className="flex flex-col justify-center px-[24px]"> {/* ProjectItems 역할 */}
                {rightBarData.projects.map((project, index) => (
                  <div key={index} className="flex flex-col self-stretch py-[16px] border-b border-[#E2E8F0]"> {/* ProjectItem 역할 */}
                      <div className="font-plusjakartasans font-medium text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
                        {project.name}
                      </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 최근 대화 섹션 */}
          <div className="flex flex-col self-stretch mt-[16px]"> {/* RecentChats 역할 */}
            <div className="
              flex flex-row items-center justify-between px-[24px] py-[9px]
              border-y border-[#E2E8F0]
            "> {/* SectionTitle 역할 */}
                <div className="font-plusjakartasans font-bold text-[18px] leading-[1.33em] tracking-[-0.8%] text-[#1E293B]">최근 대화</div>
                <div className="w-[20px] h-[20px]"></div> {/* 드롭다운 아이콘 자리 */}
            </div>
            <div className="flex flex-col justify-center px-[24px]"> {/* ChatItems 역할 */}
                {rightBarData.recentChats.map((chat, index) => (
                  <div key={index} className="flex flex-col self-stretch py-[16px] border-b border-[#E2E8F0]"> {/* ChatItem 역할 */}
                      <div className="font-plusjakartasans font-medium text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
                        {chat.name}
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}