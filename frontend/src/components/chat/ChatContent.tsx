import React from 'react';
import ChatbotMessage from './ChatbotMessage';
import UserMessage from './UserMessage';

export type ChatMessage = {
    id: number;
    sender: 'user' | 'bot';
    text: React.ReactNode;
    timestamp: number;
  };
  
interface ChatContentProps {
    messages: ChatMessage[];
}
  
export default function ChatContent({ messages }: ChatContentProps) {

  return (
    <div className="
      h-[400px] flex flex-col overflow-y-auto">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            {msg.sender === 'bot' ? (
              <ChatbotMessage message={msg.text} />
            ) : (
              <UserMessage message={msg.text} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }