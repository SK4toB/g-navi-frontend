// frontend/src/components/rightBar/RightBar.tsx
import React from 'react';

interface UserInfoData {
  name: string;
  avatar: string;
}

interface ChatData {
  id: string; 
  title: string; 
}


export default function RightBar() {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const dummyUserProfile: UserInfoData = {
    name: '하니',
    avatar: '/src/assets/avatar.png',
  };

  const dummyRecentChats: ChatData[] = [
    { id: 'dchat-1', title: '커리어에 대한 고민' },
    { id: 'dchat-2', title: '어떤 스킬을 쌓으면 좋을지?' },
    { id: 'dchat-3', title: '롤모델 커리어 확인하기' },
  ];


  return (
    <div className={`
      ${isOpen ? 'w-[365px] transition-all duration-300' : 'w-[70px] transition-all duration-300'}
      bg-white border-l border-[#ECECF1] flex flex-col items-center h-[1024px] {/* 높이와 기본 스타일 */}
    `}>
      {/* 상단 섹션: 접기/펴기 아이콘 및 사용자 아바타/이름 */}
      <div className="
        flex flex-row justify-between items-center py-[20px] px-[24px]
        border-b border-[#E2E8F0] w-full
      ">
        <button onClick={toggleOpen} className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fill-rule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
            </svg>

          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
          )}
        </button>
        {isOpen && (
          <div className="flex flex-row items-center gap-[12px]">
            {/* 아바타 이미지 (더미 데이터 사용) */}
            <div className="w-[48px] h-[48px] rounded-full bg-gray-300 flex items-center justify-center relative">
              <img src={dummyUserProfile.avatar} alt="User Avatar" className="w-full h-full rounded-full" />
            </div>
            {/* 사용자 이름 (더미 데이터 사용) */}
            <div className="font-plusjakartasans font-bold text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
              {dummyUserProfile.name}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <>
          {/* 최근 대화 섹션 */}
          <div className="flex flex-col self-stretch mt-[16px] w-full h-[252px]"> {/* 이미지에 맞춰 높이 지정 */}
            {/* 섹션 타이틀 */}
            <div className="
              flex flex-row items-center justify-between px-[24px] py-[9px]
              border-b border-[#E2E8F0]
            ">
                <div className="font-plusjakartasans font-bold text-[18px] leading-[1.33em] tracking-[-0.8%] text-[#1E293B]">최근 대화</div>
            </div>
            {/* 대화 목록 */}
            <div className="flex flex-col justify-center px-[24px]">
                {dummyRecentChats.map((chat) => (
                  <div key={chat.id} className="flex flex-col self-stretch py-[16px] border-b border-[#E2E8F0]">
                      <div className="font-plusjakartasans font-medium text-[16px] leading-[1.375em] tracking-[-0.7%] text-[#1E293B]">
                        {chat.title}
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