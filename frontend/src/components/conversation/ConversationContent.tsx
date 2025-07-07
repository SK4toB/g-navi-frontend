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
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 사용자의 최근 메시지를 상단에 위치시키는 스크롤 함수
  const scrollToLatestUserMessage = () => {
    if (!containerRef.current) return;

    // 가장 최근 사용자 메시지 찾기
    const userMessages = messages.filter(msg => msg.sender === 'user');
    if (userMessages.length === 0) {
      // 사용자 메시지가 없으면 맨 아래로 스크롤
      scrollToBottom();
      return;
    }

    const latestUserMessage = userMessages[userMessages.length - 1];
    const latestUserMessageElement = messageRefs.current[latestUserMessage.id];

    if (latestUserMessageElement && containerRef.current) {
      const container = containerRef.current;
      const messageElement = latestUserMessageElement;
      
      // 메시지 요소의 위치 계산
      const containerRect = container.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      
      // 현재 스크롤 위치에서 메시지까지의 거리 계산
      const targetScrollTop = container.scrollTop + (messageRect.top - containerRect.top);
      
      // 부드러운 스크롤 애니메이션
      const startScrollTop = container.scrollTop;
      const distance = targetScrollTop - startScrollTop;
      const duration = 500;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeInOutCubic 이징 함수
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        
        const easedProgress = easeInOutCubic(progress);
        container.scrollTop = startScrollTop + distance * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  // 기존 맨 아래로 스크롤하는 함수 (봇 메시지나 로딩 시 사용)
  const scrollToBottom = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const targetScrollTop = container.scrollHeight - container.clientHeight;
    const startScrollTop = container.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    
    const duration = 500;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
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

  // 메시지가 추가되거나 로딩 상태가 변경될 때 스크롤 결정
  useEffect(() => {
    if (isLoading) {
      // 로딩 중일 때는 맨 아래로 스크롤 (로딩 인디케이터 표시를 위해)
      scrollToBottom();
    } else if (messages.length > 0) {
      // 메시지가 있을 때는 최근 사용자 메시지를 상단에 위치
      scrollToLatestUserMessage();
    }
  }, [messages, isLoading]);

  // 메시지 ref 설정 함수
  const setMessageRef = (id: number) => (el: HTMLDivElement | null) => {
    messageRefs.current[id] = el;
  };

  return (
    <div
      ref={containerRef}
      className={`${height} flex flex-col overflow-y-auto mt-[10px] scrollbar-hide`}
    >
      {messages.map((msg) => (
        <div key={msg.id} ref={setMessageRef(msg.id)} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <Message sender={msg.sender} text={msg.text} />
        </div>
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