// frontend/src/components/rightBar/RightBar.tsx
import React from 'react';
// import {getChatList} from 

interface ChatData {
  id: string;
  title: string;
}

export default function RightBar() {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const userProfile = {
    name: '하니',
    avatar: '/src/assets/avatar.png',
  };

  const dummyRecentChats: ChatData[] = [
    { id: 'dchat-1', title: '커리어에 대한 고민' },
    { id: 'dchat-2', title: '어떤 스킬을 쌓으면 좋을지?' },
    { id: 'dchat-3', title: '롤모델 커리어 확인하기' },
  ];

  const getChatList = React.useCallback(async () => {
    // console.log("채팅 리스트 요청");
  }, []);

  React.useEffect(() => {
    getChatList();
  }, [isOpen, getChatList]);

  return (
    <div className={`
      ${isOpen ? 'w-[365px]' : 'w-[70px]'}
      border-l border-[#E2E8F0] h-[1024px] flex flex-col
    `}>
      <div className="
        flex flex-row justify-between items-center py-[12px] px-[12px]
      ">
        <button onClick={toggleOpen} className="w-[40px] h-[40px] flex items-center justify-center p-0 bg-transparent border-none cursor-pointer">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
            </svg>

          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        {isOpen && (
          <div className="flex flex-row items-center gap-[12px] p-[12px]">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center relative">
              <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full" />
            </div>
            <div className="font-bold text-[24px] text-[#1E293B]">
              {userProfile.name}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <>
          <div className="flex flex-col flex-1">
            <div className="
              flex flex-row items-center justify-between p-[24px]
              border-b border-[#E2E8F0]
            ">
              <div className="font-bold text-[24px] text-[#1E293B]">최근 대화</div>
            </div>
            <div className="flex flex-col px-[24px]">
                {dummyRecentChats.map((chat) => (
                  <div key={chat.id} className="py-[16px] border-b border-[#E2E8F0]">
                      <div className="text-[16px] text-[#1E293B]">
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