// frontend/src/pages/ChatPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../components/common/CommonTitle';
import ChatInput from '../components/chat/ChatInput';
import RecommendationCards from '../components/chat/RecommendationCards';
import ChatContent from '../components/chat/ChatContent';
import useChatStore from '../store/chatStore';
import type { ChatMessage } from '../store/chatStore';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const currentChatMessages = useChatStore((state) => state.currentChatMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  const messageIdCounter = useChatStore((state) => state.messageIdCounter);
  const loadChatMessages = useChatStore((state) => state.loadChatMessages);
  const startNewChat = useChatStore((state) => state.startNewChat);
  const currentStoreChatId = useChatStore((state) => state.currentChatId);

  // 컴포넌트 마운트 시 또는 chatId 변경 시 채팅 초기화/로드
  React.useEffect(() => {
    if (chatId && chatId !== currentStoreChatId) {
      // 기존 채팅방 로드
      loadChatMessages(chatId);
    } else if (!chatId && !currentStoreChatId) {
      // 새 채팅 시작 (URL에 chatId가 없고, 스토어에도 채팅이 없을 때)
      startNewChat();
    }
  }, [chatId, currentStoreChatId, loadChatMessages, startNewChat]);

  // 스토어의 currentChatId가 변경되면 URL 업데이트
  React.useEffect(() => {
    if (currentStoreChatId && currentStoreChatId !== chatId) {
      navigate(`/chat/${currentStoreChatId}`, { replace: true });
    }
  }, [currentStoreChatId, chatId, navigate]);

  const handleSendMessage = (message: string) => {
    if (!currentStoreChatId) {
      console.error("Chat ID is null when sending message in a new chat. This should not happen.");
      return;
    }

    const newUserMessage: ChatMessage = {
      id: messageIdCounter + 1,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    addMessage(newUserMessage);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messageIdCounter + 2,
        sender: 'bot',
        text: "좋은 질문이네요! 해당 질문에 대한 답변을 준비 중입니다.",
        timestamp: Date.now() + 1,
      };
      addMessage(botResponse);
    }, 1000);
  };

  const isNewChatSession = !chatId; // URL에 chatId가 없으면 새 채팅 세션으로 간주

  return (
    <div className="flex flex-col items-center justify-start">
      <div className={isNewChatSession ? "w-[816px]" : "w-[1000px]"}>
        {isNewChatSession ? <Title>G Navi</Title> : <div className='h-[100px]'></div>}

        <ChatContent messages={currentChatMessages} />

        <ChatInput onSendMessage={handleSendMessage} />

        {isNewChatSession && <RecommendationCards />}
      </div>
    </div>
  );
}