// frontend/src/components/chat/Message.tsx
import React from 'react';

interface MessageProps {
 sender: 'user' | 'bot';
 text: React.ReactNode;
}

export default function Message({ sender, text }: MessageProps) {
 const isUser = sender === 'user';

 // 발신자에 따른 스타일 적용
 const finalMessageClasses = `
   max-w-[60%] p-4 mb-6 font-pretendard text-[15px] leading-[1.6em] text-text-primary
   ${isUser
     ? 'bg-gradient-to-br from-[#2f5a69] to-main-color text-white rounded-[20px_20px_6px_20px] self-end shadow-[0_4px_12px_0_rgba(79,70,229,0.25)]' // 사용자 메시지
     : 'bg-white border border-[#E5E7EB] rounded-[20px_20px_20px_6px] self-start shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-shadow duration-200' // 챗봇 메시지
   }
 `.replace(/\s+/g, ' ');

 return (
   <div className={finalMessageClasses}>
     {text}
   </div>
 );
}