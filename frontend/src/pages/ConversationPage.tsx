// frontend/src/pages/ChatPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../components/common/CommonTitle';
import ConversationInput from '../components/conversation/ConversationInput';
import RecommendationCards from '../components/conversation/RecommendationCards';
import ConversationContent from '../components/conversation/ConversationContent';
import { conversationApi, type ConversationMessage } from '../api/conversation';
import useAuthStore from '../store/authStore';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageIdCounter, setMessageIdCounter] = React.useState(0);
  const [isNewChat, setIsNewChat] = React.useState(true); // 초기값은 true

  // 서버 메시지를 UI 메시지로 변환
  const convertToUIMessage = (msg: ConversationMessage, id: number): Message => ({
    id,
    sender: msg.senderType === 'USER' ? 'user' : 'bot',
    text: msg.messageText,
    timestamp: new Date(msg.timestamp).getTime(),
  });

  // 새 대화 시작
  const startNewConversation = async () => {
    if (!user?.memberId) return;

    setIsLoading(true);
    const response = await conversationApi.startConversation(user.memberId);
    setIsLoading(false);

    if (response.isSuccess) {
      setCurrentConversationId(response.result.conversationId);
      setMessages([{
        id: 1,
        sender: 'bot',
        text: response.result.botMessage,
        timestamp: new Date(response.result.timestamp).getTime(),
      }]);
      setMessageIdCounter(1);
      setIsNewChat(true); // 새 대화이므로 true
      navigate(`/conversation/${response.result.conversationId}`, { replace: true });
    }
  };

  // 기존 대화 내역 로드
  const loadConversationHistory = async (existingConversationId: string) => {
    setIsLoading(true);
    const response = await conversationApi.getConversationHistory(existingConversationId);
    setIsLoading(false);

    if (response.isSuccess) {
      setCurrentConversationId(existingConversationId);
      const convertedMessages = response.result.messages.map((msg, index) => 
        convertToUIMessage(msg, index + 1)
      );
      setMessages(convertedMessages);
      setMessageIdCounter(response.result.messageCount || convertedMessages.length);
      
      // 기존 대화에 메시지가 1개(봇의 첫 인사만)이면 isNewChat = true
      setIsNewChat(convertedMessages.length <= 1);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !user?.memberId) return;

    // 사용자 메시지 즉시 추가
    const userMessage: Message = {
      id: messageIdCounter + 1,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);

    // 봇 응답 요청
    const response = await conversationApi.sendMessage(currentConversationId, message, user.memberId);

    if (response.isSuccess) {
      // 봇 응답 추가
      setMessages(prev => [...prev, {
        id: messageIdCounter + 2,
        sender: 'bot',
        text: response.result.botMessage,
        timestamp: new Date(response.result.timestamp).getTime(),
      }]);
      setMessageIdCounter(prev => prev + 1);
    } else {
      // 실패 시 사용자 메시지 제거
      setMessages(prev => prev.slice(0, -1));
      setMessageIdCounter(prev => prev - 1);
    }
  };

  // 초기화
  React.useEffect(() => {
    if (conversationId) {
      loadConversationHistory(conversationId);
    } else if (user?.memberId) {
      startNewConversation();
    }
  }, [conversationId, user?.memberId]);

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <div className="w-[816px] h-[100vh]">
        
        {isNewChat ? (
          // 새 대화일 때 렌더링할 내용
          <>
            <Title>G Navi</Title>
            <ConversationContent 
              messages={messages} 
              height="h-[400px]"
            />
            <ConversationInput onSendMessage={handleSendMessage} />
            <RecommendationCards />
          </>
        ) : (
          // 기존 대화일 때 렌더링할 내용  
          <>
            <Title>G Navi</Title>
            <ConversationContent 
              messages={messages} 
              height="h-[550px]"
            />
            <ConversationInput onSendMessage={handleSendMessage} />
          </>
        )}
        
      </div>
    </div>
  );
}