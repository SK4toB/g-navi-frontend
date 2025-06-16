// frontend/src/components/conversation/ConversationContent.tsx
import React from 'react';
import Message from './Message'

interface ConversationMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

interface ConversationContentProps {
  messages: ConversationMessage[];
  height: string; // Tailwind CSS 클래스로 높이 전달 (예: 'h-[400px]', 'h-[calc(100vh-300px)]')
}
  
export default function ConversationContent({ messages, height }: ConversationContentProps) {

  return (
    <div className={`${height} flex flex-col overflow-y-auto p-4`}>
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <Message sender={msg.sender} text={msg.text} />
        </React.Fragment>
      ))}
    </div>
  );
}