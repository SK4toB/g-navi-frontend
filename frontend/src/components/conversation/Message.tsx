// frontend/src/components/chat/Message.tsx
import React from 'react';

interface MessageProps {
  sender: 'user' | 'bot';
  text: React.ReactNode;
}

export default function Message({ sender, text }: MessageProps) {
  const isUser = sender === 'user';

  // 발신자에 따른 스타일 적용
  const messageClasses = `
    max-w-[60%] p-[12px] mb-[8px] rounded-[12px] font-pretendard text-[16px] leading-[1.5em]
    ${isUser
      ? 'bg-[#DCF8C6] self-end' 
      : 'bg-[#F9FAFB] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] self-start' 
    }
    text-text-primary ${isUser ? '' : 'text-primary-dark'} // 전역 텍스트 색상 사용. 필요시 챗봇 메시지는 메인 색상으로
  `.replace(/\s+/g, ' '); 

  const finalMessageClasses = `
    max-w-[60%] p-[12px] mb-[8px] rounded-[12px] font-pretendard text-[16px] leading-[1.5em] text-text-primary
    ${isUser
      ? 'bg-[#DCF8C6] self-end' // 사용자 메시지 배경
      : 'bg-[#F9FAFB] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] self-start' // 챗봇 메시지 배경
    }
  `.replace(/\s+/g, ' ');

  return (
    <div className={finalMessageClasses}>
      {text}
    </div>
  );
}