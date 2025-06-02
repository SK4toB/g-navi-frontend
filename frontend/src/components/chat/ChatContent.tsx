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

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="
      w-[816px] min-h-[300px] flex flex-col overflow-y-auto">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            {msg.sender === 'bot' ? (
              <ChatbotMessage message={msg.text} />
            ) : (
              <UserMessage message={msg.text} />
            )}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }