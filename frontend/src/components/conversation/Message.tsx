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
      ? 'bg-[#DCF8C6] self-end' // 사용자 메시지 배경색 (기존 UserMessage의 색상 유지)
      : 'bg-[#F9FAFB] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] self-start' // 챗봇 메시지 배경/테두리/그림자 (기존 ChatbotMessage의 색상 및 스타일 유지)
    }
    text-text-primary ${isUser ? '' : 'text-primary-dark'} // 전역 텍스트 색상 사용. 필요시 챗봇 메시지는 메인 색상으로
  `.replace(/\s+/g, ' '); // 불필요한 공백 제거

  // 텍스트 색상 추가 조정:
  // UserMessage의 텍스트 색상은 #111827 이었는데, 이는 text-primary(#1E293B)와 유사하므로 text-primary 사용.
  // ChatbotMessage의 텍스트 색상도 #111827 이었으므로 text-primary 사용.
  // 즉, 둘 다 text-primary를 사용하면 되겠습니다.
  // 'text-primary-dark'는 메인 색상으로, 텍스트에 사용하기엔 어둡습니다.
  // class string을 다시 정리:
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