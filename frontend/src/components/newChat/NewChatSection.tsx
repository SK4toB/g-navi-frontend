// frontend/src/components/newChat/NewChatSection.tsx
import React from 'react';
import CommonTitle from '../common/CommonTitle';
import NewChatInput from '../chat/NewChatInput';
import RecommendationCards from './RecommendationCards';
import ChatContent from '../chat/ChatContent';
import type { ChatMessage } from '../chat/ChatContent';

export default function NewChatSection() {
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [messageIdCounter, setMessageIdCounter] = React.useState(0);

  React.useEffect(() => {
      const initialId = messageIdCounter + 1;
      setMessageIdCounter(initialId);

      const initialIntroMessage: ChatMessage = {
        id: initialId,
        sender: 'bot',
        text: (
          <>
            안녕하세요, 하니 매니저님! 반갑습니다.
            현재 경력은 10년차로 우리은행 차세대 시스템 구축에서 Back-end 개발 업무를 수행하고 계시네요.
            오늘은 무엇이 궁금하세요?
          </>
        ),
        timestamp: Date.now(),
      };
      setChatMessages([initialIntroMessage]);
  }, []);

  const handleSendMessage = (message: string) => {
    const newId = messageIdCounter + 1;
    const newUserMessage: ChatMessage = {
      id: newId,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "좋은 질문이네요! 해당 질문에 대한 답변을 준비 중입니다.",
        timestamp: Date.now() + 1,
      };
      setChatMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="w-[816px]">
        <CommonTitle>G Navi</CommonTitle>

        <ChatContent messages={chatMessages} />

        <NewChatInput onSendMessage={handleSendMessage} />

        <RecommendationCards />
      </div>
    </div>
  );
}