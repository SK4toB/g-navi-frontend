// frontend/src/components/chat/ChatContent.tsx
import React from 'react';
import Message from './Message'
import type { ChatMessage } from '../../store/chatStore';

interface ChatContentProps {
    messages: ChatMessage[];
}
  
export default function ChatContent({ messages }: ChatContentProps) {

  return (
    <div className="
      h-[400px] flex flex-col overflow-y-auto">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <Message sender={msg.sender} text={msg.text} />
          </React.Fragment>
        ))}
      </div>
    );
  }