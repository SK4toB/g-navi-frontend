// frontend/src/pages/ConversationPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../components/common/CommonTitle';
import ConversationInput from '../components/conversation/ConversationInput';
import RecommendationCards from '../components/conversation/RecommendationCards';
import ConversationContent from '../components/conversation/ConversationContent';
import { conversationApi } from '../api/conversation';
import useAuthStore from '../store/authStore';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageIdCounter, setMessageIdCounter] = React.useState(0);

  // 새 대화 시작
  const startNewConversation = async () => {
    if (!user?.memberId) {
      console.error('회원 ID가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await conversationApi.startConversation({
        memberId: user.memberId,
        conversationId: null // 새 대화
      });

      if (response.isSuccess) {
        const newConversationId = response.result.conversationId;
        setCurrentConversationId(newConversationId);
        
        // 봇의 첫 메시지 추가
        const botMessage: Message = {
          id: 1,
          sender: 'bot',
          text: response.result.botMessage,
          timestamp: Date.now(),
        };
        setMessages([botMessage]);
        setMessageIdCounter(1);

        // URL 업데이트
        navigate(`/conversation/${newConversationId}`, { replace: true });
      } else {
        console.error('새 대화 시작 실패:', response.message);
      }
    } catch (error) {
      console.error('새 대화 시작 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 기존 대화 내역 로드
  const loadConversationHistory = async (existingConversationId: string) => {
    try {
      setIsLoading(true);
      const response = await conversationApi.getConversationHistory(existingConversationId);

      if (response.isSuccess) {
        setCurrentConversationId(existingConversationId);
        
        // 서버에서 받은 메시지들을 UI 형태로 변환
        const convertedMessages: Message[] = response.result.messages.map((msg, index) => ({
          id: index + 1,
          sender: msg.senderType === 'USER' ? 'user' : 'bot',
          text: msg.messageText,
          timestamp: new Date(msg.timestamp).getTime(),
        }));
        
        setMessages(convertedMessages);
        setMessageIdCounter(response.result.messageCount || convertedMessages.length);
      } else {
        console.error('대화 내역 로드 실패:', response.message);
      }
    } catch (error) {
      console.error('대화 내역 로드 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !user?.memberId) {
      console.error('대화 ID 또는 회원 ID가 없습니다.');
      return;
    }

    // 사용자 메시지 즉시 UI에 추가
    const userMessage: Message = {
      id: messageIdCounter + 1,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);

    try {
      const response = await conversationApi.sendMessage(
        currentConversationId,
        message,
        user.memberId
      );

      if (response.isSuccess) {
        // 봇 응답 추가
        const botResponse: Message = {
          id: messageIdCounter + 2,
          sender: 'bot',
          text: response.result.botMessage,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, botResponse]);
        setMessageIdCounter(prev => prev + 1);
      } else {
        console.error('메시지 전송 실패:', response.message);
        // 실패 시 사용자 메시지 제거
        setMessages(prev => prev.slice(0, -1));
        setMessageIdCounter(prev => prev - 1);
      }
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      // 실패 시 사용자 메시지 제거
      setMessages(prev => prev.slice(0, -1));
      setMessageIdCounter(prev => prev - 1);
    }
  };

  // 컴포넌트 마운트 시 대화 초기화
  React.useEffect(() => {
    if (conversationId) {
      // URL에 conversationId가 있으면 기존 대화 내역 로드
      loadConversationHistory(conversationId);
    } else if (user?.memberId) {
      // URL에 conversationId가 없으면 새 대화 시작
      startNewConversation();
    }
  }, [conversationId, user?.memberId]);

  const isNewConversationSession = !conversationId; // URL에 conversationId가 없으면 새 대화 세션

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
        <p className="mt-4 text-gray-600">대화를 준비 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <div className={isNewConversationSession ? "w-[816px]" : "w-[1000px]"}>
        {isNewConversationSession ? <Title>G Navi</Title> : <div className='h-[100px]'></div>}

        <ConversationContent messages={messages} />

        <ConversationInput onSendMessage={handleSendMessage} />

        {isNewConversationSession && <RecommendationCards />}
      </div>
    </div>
  );
}