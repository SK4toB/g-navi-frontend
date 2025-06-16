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
  const [hasUserSentMessage, setHasUserSentMessage] = React.useState(false);

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
      setHasUserSentMessage(convertedMessages.some(msg => msg.sender === 'user'));
    }
  };

  // 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !user?.memberId) return;

    // 첫 메시지 전송 시 추천 카드 숨김
    setHasUserSentMessage(true);

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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
        <p className="mt-4 text-gray-600">대화를 준비 중입니다...</p>
      </div>
    );
  }

  const shouldShowRecommendationCards = !hasUserSentMessage;

  // 높이 계산
  const contentHeight = shouldShowRecommendationCards 
    ? 'h-[400px]'  // 추천 카드가 있을 때는 고정 높이
    : 'h-[calc(100vh-300px)]';  // 추천 카드가 없을 때는 화면 높이에서 여백 제외

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="w-80% ml-[10%] mr-[5%] mt-[5%]">
      {/* Title - 추천 카드가 있을 때만 표시 */}
        {shouldShowRecommendationCards && <Title>G Navi</Title>}
        {/* Content 영역 - 계산된 높이 전달 */}
        <ConversationContent 
          messages={messages} 
          height={contentHeight}
        />
        {/* Input - 항상 표시 */}
        <ConversationInput onSendMessage={handleSendMessage} />
        {/* Recommendation Cards - 추천 카드가 있을 때만 표시 */}
        {shouldShowRecommendationCards && <RecommendationCards />}
      </div>
    </div>
  );
}