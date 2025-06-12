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
}
  
export default function ConversationContent({ messages }: ConversationContentProps) {
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