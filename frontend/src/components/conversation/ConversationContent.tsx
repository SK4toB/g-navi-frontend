// frontend/src/components/conversation/ConversationContent.tsx
import React, { useEffect, useRef } from 'react';
import Message from './Message'

interface ConversationMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

interface ConversationContentProps {
  messages: ConversationMessage[];
  height: string;
  isLoading?: boolean;
}

export default function ConversationContent({ messages, height, isLoading }: ConversationContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 느린 스크롤을 위한 커스텀 함수
  const scrollToBottom = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const targetScrollTop = container.scrollHeight - container.clientHeight;
    const startScrollTop = container.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    
    // 스크롤 애니메이션 지속시간 (밀리초) - 이 값을 조절해서 속도 변경
    const duration = 800; // 800ms로 느리게 설정 (기본은 보통 300ms 정도)
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeInOutCubic 이징 함수로 부드러운 애니메이션
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      const easedProgress = easeInOutCubic(progress);
      container.scrollTop = startScrollTop + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // 메시지가 추가되거나 로딩 상태가 변경될 때 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className={`${height} flex flex-col overflow-y-auto mt-[10px] scrollbar-hide`}
    >
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <Message sender={msg.sender} text={msg.text} />
        </React.Fragment>
      ))}

      {/* 로딩 중일 때 봇 메시지 표시 */}
      {isLoading && (
        <Message
          sender="bot"
          text={
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          }
        />
      )}

      {/* 스크롤 타겟 엘리먼트 */}
      <div ref={messagesEndRef} />
    </div>
  );
}