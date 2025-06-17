// frontend/src/components/conversation/ConversationContent.tsx
import React from 'react';
import Message from './Message'

interface ConversationMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

// 메시지 목록 끝에 로딩 표시를 추가하고 싶다면
interface ConversationContentProps {
  messages: ConversationMessage[];
  height: string;
  isLoading?: boolean; // 추가
}

export default function ConversationContent({ messages, height, isLoading }: ConversationContentProps) {
  return (
    <div className={`${height} flex flex-col overflow-y-auto mt-[50px]`}>
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
    </div>
  );
}