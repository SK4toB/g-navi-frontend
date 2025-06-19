// frontend/src/pages/ConversationPage.tsx
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

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = React.useState(false); // 응답 대기 상태
  const [messageIdCounter, setMessageIdCounter] = React.useState(0);
  const [isNewChat, setIsNewChat] = React.useState(true); // 초기값은 true

  // 서버 메시지를 UI 메시지로 변환
  const convertToUIMessage = (msg: ConversationMessage, id: number): Message => ({
    id,
    sender: msg.senderType === 'USER' ? 'user' : 'bot',
    text: msg.messageText,
    timestamp: new Date(msg.timestamp).getTime(),
  });

  // 카드 클릭 시 메시지 전송
  const handleCardClick = (message: string) => {
    handleSendMessage(message);
  };

  // 새 대화 시작
  const startNewConversation = async () => {
    if (!user?.memberId) return;

    setIsLoading(true);
    setIsLoadingResponse(true); // 새 대화 시작 시 로딩 상태

    try {
      const response = await conversationApi.startConversation(user.memberId);

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
    } catch (error) {
      console.error('새 대화 시작 실패:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingResponse(false);
    }
  };

  // 기존 대화 내역 로드
  const loadConversationHistory = async (existingConversationId: string) => {
    setIsLoading(true);

    try {
      const response = await conversationApi.getConversationHistory(existingConversationId);

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
    } catch (error) {
      console.error('대화 내역 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !user?.memberId || isLoadingResponse) return;

    // 사용자 메시지 즉시 추가
    const userMessage: Message = {
      id: messageIdCounter + 1,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);

    // 더 이상 새 채팅이 아님
    setIsNewChat(false);

    // 봇 응답 대기 상태 시작
    setIsLoadingResponse(true);

    try {
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
        console.error('메시지 전송 실패:', response.message);
      }
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      // 실패 시 사용자 메시지 제거
      setMessages(prev => prev.slice(0, -1));
      setMessageIdCounter(prev => prev - 1);
    } finally {
      setIsLoadingResponse(false);
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
    <div className="w-full flex flex-col items-center justify-start mb-2">
      <div className="w-[816px]">

        {isNewChat ? (
          // 새 대화일 때 렌더링할 내용
          <>
            <div className='mt-12'>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                G Navi
              </h1>
            </div>
            <ConversationContent
              messages={messages}
              height="h-[452px]"
              isLoading={isLoadingResponse}
            />
            <ConversationInput
              onSendMessage={handleSendMessage}
              isLoading={isLoadingResponse}
            />
            <RecommendationCards
              onCardClick={handleCardClick}
            />
          </>
        ) : (
          <>
            <div className='mt-12'>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                G Navi
              </h1>
            </div>
            <ConversationContent
              messages={messages}
              height="h-[560px]"
              isLoading={isLoadingResponse}
            />
            <ConversationInput
              onSendMessage={handleSendMessage}
              isLoading={isLoadingResponse}
            />
          </>
        )}

      </div>
    </div>
  );
}