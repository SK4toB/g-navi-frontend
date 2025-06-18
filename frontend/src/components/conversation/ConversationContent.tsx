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

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지가 추가되거나 로딩 상태가 변경될 때 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className={`${height} flex flex-col overflow-y-auto mt-[10px] px-2`}
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
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          }
        />
      )}
      
      {/* 스크롤 타겟 엘리먼트 */}
      <div ref={messagesEndRef} />
    </div>
  );
}